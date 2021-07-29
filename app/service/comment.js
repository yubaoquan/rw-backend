const { Service } = require('egg');

class CommentService extends Service {
  get Comment() {
    return this.app.model.Comment;
  }

  async createComment(data) {
    const comment = new this.Comment(data);
    await comment.save();
    return comment;
  }

  getByArticleId(articleId) {
    return this.Comment.find({ articleId }).populate('author');
  }

  findById(commentId) {
    return this.Comment.findById(commentId);
  }

  deleteById(_id) {
    return this.Comment.deleteOne({ _id });
  }
}

module.exports = CommentService;
