/* eslint-disable no-underscore-dangle */
const { Controller } = require('egg');

class ArticleController extends Controller {
  get articleService() {
    return this.service.article;
  }

  get userService() {
    return this.service.user;
  }

  async getArticles() {
    const { ctx } = this;
    const { offset, limit, author, tag, favorited } = ctx.query;
    const { pick } = ctx.helper.lodash;

    const conditions = { offset: +offset, limit: +limit, author, tag, favorited };
    const [articles, articlesCount] = await Promise.all([
      this.articleService.find(conditions),
      this.articleService.count(conditions),
    ]);

    ctx.body = {
      articles: articles.map((article) => {
        const authorId = article.author._id;
        return {
          ...this.makeArticleForShow(article._id, article),
          author: {
            ...pick(article.author, ['username', 'bio', 'image']),
            following: ctx.user?.following.some((id) => id.equals(authorId)),
          },
        };
      }),
      articlesCount,
    };
  }

  async feedArticles() {
    const { ctx } = this;
    const { offset, limit } = ctx.query;
    const { pick } = ctx.helper.lodash;

    const authors = ctx.user.following;

    const conditions = { offset: +offset, limit: +limit, authors };
    const [articles, articlesCount] = await Promise.all([
      this.articleService.find(conditions),
      this.articleService.count(conditions),
    ]);

    ctx.body = {
      articles: articles.map((article) => {
        const authorId = article.author._id;
        return {
          ...this.makeArticleForShow(article._id, article),
          author: {
            ...pick(article.author, ['username', 'bio', 'image']),
            following: ctx.user?.following.some((id) => id.equals(authorId)),
          },
        };
      }),
      articlesCount,
    };
  }

  async getArticle() {
    const { ctx } = this;
    const article = await this.articleService.findById(ctx.params.slug).populate('author');

    if (!article) {
      ctx.body = { article: null };
      return;
    }

    const { pick } = ctx.helper.lodash;
    const author = article.author.toJSON();

    ctx.body = {
      article: {
        ...this.makeArticleForShow(article._id, article),
        author: {
          ...pick(article.author, ['username', 'bio', 'image']),
          following: ctx.user?.following.some((id) => id.equals(author._id)),
        },
      },
    };
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

    const ret = await this.articleService.createArticle(articleData);
    this.responseArticle(ret);
  }

  makeArticleForShow(slug, article) {
    const { ctx } = this;
    const { pick } = ctx.helper.lodash;

    return {
      slug,
      ...pick(article.toJSON(), [
        'title',
        'description',
        'body',
        'tagList',
        'createdAt',
        'updatedAt',
        'favorited',
        'favoritesCount',
      ]),
    };
  }

  responseArticle(ret) {
    const { ctx } = this;
    const { pick } = ctx.helper.lodash;

    ctx.body = {
      article: {
        ...this.makeArticleForShow(ret._id, ret),
        author: {
          ...pick(ctx.user, ['username', 'bio', 'image']),
          following: false,
        },
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

    const ret = await this.articleService.updateArticle(slug, articleData);

    this.responseArticle(ret);
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
    ctx.body = 'favoriteArticle';
  }

  async unfavoriteArticle() {
    const { ctx } = this;
    ctx.body = 'unfavoriteArticle';
  }
}

module.exports = ArticleController;
