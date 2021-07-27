const { Controller } = require('egg');

class ArticleController extends Controller {
  async getArticles() {
    const { ctx } = this;
    ctx.body = 'getArticles';
  }

  async feedArticles() {
    const { ctx } = this;
    ctx.body = 'feedArticles';
  }

  async getArticle() {
    const { ctx } = this;
    ctx.body = 'getArticle';
  }

  async createArticle() {
    const { ctx } = this;
    ctx.body = 'createArticle';
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
