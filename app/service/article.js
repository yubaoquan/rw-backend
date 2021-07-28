/* eslint-disable no-underscore-dangle */
const { Service } = require('egg');

class ArticleService extends Service {
  get Article() {
    return this.app.model.Article;
  }

  findById(_id) {
    return this.Article.findOne({ _id });
  }

  async createArticle(data) {
    const article = new this.Article(data);
    await article.save();
    return article;
  }

  async updateArticle(_id, data) {
    return this.Article.findOneAndUpdate({ _id }, data, { new: true });
  }

  async deleteArticle(id) {
    return this.Article.findByIdAndDelete(id);
  }

  async find(options = {}) {
    const { tag, author, favorited, offset = 0, limit = 20, authors } = options;

    const condition = {};

    if (author !== undefined) {
      const user = await this.ctx.service.user.findByUsername(author);
      condition.author = user?._id;
    }

    if (tag) condition.tagList = [tag];
    if (favorited) condition.favoritedBy = [favorited];
    if (authors) condition.author = { $in: authors };

    return this.Article.find(condition)
      .populate('author')
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async count(options = {}) {
    const { tag, author, favorited, authors } = options;

    const condition = {};

    if (author !== undefined) {
      const user = await this.ctx.service.user.findByUsername(author);
      condition.author = user?._id;
    }

    if (tag) condition.tagList = [tag];
    if (favorited) condition.favoritedBy = [favorited];
    if (authors) condition.author = { $in: authors };

    return this.Article.countDocuments(condition);
  }
}

module.exports = ArticleService;
