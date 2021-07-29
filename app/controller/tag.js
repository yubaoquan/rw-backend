const { Controller } = require('egg');

class TagController extends Controller {
  async getTags() {
    const { ctx } = this;
    const tags = await this.service.tag.findAll();
    ctx.body = { tags: tags.map((tag) => tag.title) };
  }
}

module.exports = TagController;
