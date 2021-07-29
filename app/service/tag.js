const { Service } = require('egg');

class TagService extends Service {
  get Tag() {
    return this.app.model.Tag;
  }

  async findAll() {
    return this.Tag.find();
  }

  async titleExists(title) {
    const tag = await this.Tag.findOne({ title });
    return !!tag;
  }

  async createTag(data) {
    const tag = new this.Tag(data);
    await tag.save();
    return tag;
  }
}

module.exports = TagService;
