/* eslint-disable no-underscore-dangle */
const { Controller } = require('egg');

class ArticleController extends Controller {
  get articleService() {
    return this.service.article;
  }

  get userService() {
    return this.service.user;
  }

  get tagService() {
    return this.service.tag;
  }

  get commentService() {
    return this.service.comment;
  }

  async getArticles() {
    const { ctx } = this;
    const { offset, limit, author, tag, favorited } = ctx.query;

    const conditions = { offset: +offset, limit: +limit, author, tag, favorited };
    const [articles, articlesCount] = await Promise.all([
      this.articleService.find(conditions),
      this.articleService.count(conditions),
    ]);

    ctx.body = {
      articles: articles.map((article) => this.makeArticleForShow(article)),
      articlesCount,
    };
  }

  async feedArticles() {
    const { ctx } = this;
    const { offset, limit } = ctx.query;

    const authors = ctx.user.following;

    const conditions = { offset: +offset, limit: +limit, authors };
    const [articles, articlesCount] = await Promise.all([
      this.articleService.find(conditions),
      this.articleService.count(conditions),
    ]);

    ctx.body = {
      articles: articles.map((article) => this.makeArticleForShow(article)),
      articlesCount,
    };
  }

  async getArticle() {
    const { ctx } = this;
    const article = await this.articleService.findById(ctx.params.slug).populate('author');

    ctx.body = { article: article ? this.makeArticleForShow(article) : null };
  }

  async createArticle() {
    const { ctx } = this;
    const articleData = ctx.request.body.article;

    ctx.validate({
      title: { type: 'string', max: 60 },
      description: { type: 'string', max: 100 },
      body: { type: 'string', max: 20000 },
      tagList: {
        type: 'array',
        required: false,
        rule: {
          itemType: 'string',
          max: 5,
        },
      },
    }, articleData);

    articleData.author = ctx.user._id;
    articleData.tagList = this.getUniqueTags(articleData.tagList);

    await this.createTagsIfNeed(articleData.tagList);
    const ret = await this.articleService.createArticle(articleData);
    ctx.body = { article: this.makeArticleForShow(ret) };
  }

  makeArticleForShow(article) {
    const { ctx } = this;
    const { pick } = ctx.helper.lodash;
    const currentUser = ctx.user;

    return {
      slug: article._id,
      favorited: article.favoritedBy.some((fId) => fId.equals(currentUser?._id)),
      ...pick(article.toJSON(), [
        'title',
        'description',
        'body',
        'tagList',
        'createdAt',
        'updatedAt',
        'favoritesCount',
      ]),
      author: {
        ...pick(article.author, ['username', 'bio', 'image']),
        following: currentUser?.following.some((id) => id.equals(article.author._id)),
      },
    };
  }

  async updateArticle() {
    const { ctx } = this;
    const { slug } = ctx.params;
    const article = await this.articleService.findById(slug);

    if (!article) ctx.throw('无此文章');
    if (!ctx.user._id.equals(article.author)) ctx.throw(401, '未授权');

    const articleData = ctx.request.body.article;

    ctx.validate({
      title: { type: 'string', max: 60 },
      description: { type: 'string', max: 100 },
      body: { type: 'string', max: 20000 },
      tagList: {
        type: 'array',
        required: false,
        rule: {
          itemType: 'string',
          max: 5,
        },
      },
    }, articleData);
    articleData.tagList = this.getUniqueTags(articleData.tagList);
    await this.createTagsIfNeed(articleData.tagList);
    const ret = await this.articleService.updateArticle(slug, articleData);

    ctx.body = { article: this.makeArticleForShow(ret) };
  }

  // eslint-disable-next-line class-methods-use-this
  getUniqueTags(tags = []) {
    return Array.from(new Set(tags));
  }

  async createTagsIfNeed(tagsInput = []) {
    const tags = Array.from(new Set(tagsInput));
    const task = await Promise.all(
      tags.map(async (tag) => {
        const exists = await this.tagService.titleExists(tag);
        return exists ? false : tag;
      }),
    );
    const newTags = task.filter((tag) => !!tag);

    await Promise.all(newTags.map(async (tag) => {
      await this.tagService.createTag({ title: tag });
    }));
  }

  async deleteArticle() {
    const { ctx } = this;
    const { slug } = ctx.params;

    const article = await this.articleService.findById(slug);

    if (!article) ctx.throw('无此文章');
    if (!ctx.user._id.equals(article.author)) ctx.throw(401, '未授权');

    await this.articleService.deleteArticle(slug);

    ctx.body = { success: true };
  }

  async favoriteArticle() {
    const { ctx } = this;
    const { slug } = ctx.params;
    const article = await this.articleService.addFavorite(slug, ctx.user._id);

    ctx.body = { article: this.makeArticleForShow(article) };
  }

  async unfavoriteArticle() {
    const { ctx } = this;
    const { slug } = ctx.params;
    const article = await this.articleService.unfavorite(slug, ctx.user._id);

    ctx.body = { article: this.makeArticleForShow(article) };
  }

  async createComment() {
    const { ctx } = this;
    const commentData = ctx.request.body.comment;

    ctx.validate({ body: { type: 'string', max: 300 } }, commentData);
    commentData.author = ctx.user._id;
    commentData.articleId = ctx.params.slug;

    const { username, bio, image } = ctx.user;

    const ret = await this.commentService.createComment(commentData);

    ctx.body = {
      comment: {
        id: ret._id,
        createdAt: ret.createdAt,
        updatedAt: ret.updatedAt,
        body: ret.body,
        author: { username, bio, image, following: false },
      },
    };
  }

  async getComments() {
    const { ctx } = this;
    const { pick } = ctx.helper.lodash;
    const comments = await this.commentService.getByArticleId(ctx.params.slug);

    ctx.body = {
      comments: comments.map((comment) => {
        const author = pick(comment.author, ['username', 'bio', 'image']);
        author.following = comment.author.followedBy.some((userId) => userId.equals(ctx.user?._id));

        return {
          id: comment._id,
          ...pick(comment, ['createdAt', 'updatedAt', 'body']),
          author,
        };
      }),
    };
  }

  async deleteComment() {
    const { ctx } = this;
    const commentId = ctx.params.id;
    const userId = ctx.user._id;

    const [article, comment] = await Promise.all([
      this.articleService.findById(ctx.params.slug),
      this.commentService.findById(commentId),
    ]);

    const isArticleAuthor = article.author.equals(userId);
    const isCommentAuthor = comment.author.equals(ctx.user._id);
    if (!isArticleAuthor && !isCommentAuthor) ctx.throw(401);

    await this.commentService.deleteById(commentId);
    ctx.body = { success: true };
  }
}

module.exports = ArticleController;
