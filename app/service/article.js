/* eslint-disable no-underscore-dangle */
const { Service } = require('egg');

class ArticleService extends Service {
  get Article() {
    return this.app.model.Article;
  }

  get User() {
    return this.app.model.User;
  }

  get userService() {
    return this.ctx.service.user;
  }

  findById(id) {
    return this.Article.findById(id);
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
      const user = await this.userService.findByUsername(author);
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
      const user = await this.userService.findByUsername(author);
      condition.author = user?._id;
    }

    if (tag) condition.tagList = [tag];
    if (favorited) condition.favoritedBy = [favorited];
    if (authors) condition.author = { $in: authors };

    return this.Article.countDocuments(condition);
  }

  async addFavorite(articleId, userId) {
    const [article, user] = await Promise.all([
      this.Article.findById(articleId),
      this.User.findById(userId),
    ]);

    if (article.favoritedBy.every((fId) => !fId.equals(user._id))) {
      article.favoritedBy.push(user._id);
      article.favoritesCount += 1;
      article.save();
    }

    if (user.favoriteArticles.every((fId) => !fId.equals(article._id))) {
      user.favoriteArticles.push(article._id);
      user.save();
    }

    return article;
  }

  async unfavorite(articleId, userId) {
    const [article, user] = await Promise.all([
      this.Article.findById(articleId),
      this.User.findById(userId),
    ]);

    const userIndex = article.favoritedBy.findIndex((fId) => fId.equals(user._id));
    if (userIndex > -1) {
      article.favoritedBy.splice(userIndex, 1);
      article.favoritesCount -= 1;
      article.save();
    }

    const articleIndex = user.favoriteArticles.findIndex((fId) => fId.equals(article._id));
    if (articleIndex > -1) {
      user.favoriteArticles.splice(articleIndex, 1);
      user.save();
    }

    return article;
  }
}

module.exports = ArticleService;
