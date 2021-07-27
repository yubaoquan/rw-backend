const { Controller } = require('egg');

class CommentController extends Controller {
  async createComment() {
    const { ctx } = this;
    ctx.body = 'createComment';
  }

  async getComments() {
    const { ctx } = this;
    ctx.body = 'getComments';
  }

  async deleteComment() {
    const { ctx } = this;
    ctx.body = 'deleteComment';
  }
}

module.exports = CommentController;
