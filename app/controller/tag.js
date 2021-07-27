const { Controller } = require('egg');

class TagController extends Controller {
  async getTags() {
    const { ctx } = this;
    ctx.body = 'getTags';
  }
}

module.exports = TagController;
