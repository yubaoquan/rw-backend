/* eslint-disable no-underscore-dangle */
const { Controller } = require('egg');

class ArticleController extends Controller {
  get articleService() {
    return this.service.article;
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
          slug: article._id,
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
    ctx.body = 'feedArticles';
  }

  async getArticle() {
    const { ctx } = this;
    const article = await this.articleService.findById(ctx.params.slug).populate('author');

    if (!article) {
      ctx.body = { article: null };
    } else {
      const { pick } = ctx.helper.lodash;
      const author = article.author.toJSON();

      ctx.body = {
        article: {
          slug: article._id,
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
          author: {
            ...pick(article.author, ['username', 'bio', 'image']),
            following: ctx.user?.following.some((id) => id.equals(author._id)),
          },
        },
      };
    }
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

    const { pick } = ctx.helper.lodash;
    ctx.body = {
      article: {
        slug: ret._id,
        ...pick(ret.toJSON(), [
          'title',
          'description',
          'body',
          'tagList',
          'createdAt',
          'updatedAt',
          'favorited',
          'favoritesCount',
        ]),
        author: {
          ...pick(ctx.user, ['username', 'bio', 'image']),
          following: false,
        },
      },
    };
  }

  async updateArticle() {
    const { ctx } = this;
    ctx.body = 'updateArticle';
  }

  async deleteArticle() {
    const { ctx } = this;
    ctx.body = 'deleteArticle';
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
