const { Controller } = require('egg');

class ProfileController extends Controller {
  async getProfile() {
    const { ctx } = this;
    ctx.body = 'getProfile';
  }

  async followUser() {
    const { ctx } = this;
    ctx.body = 'followUser';
  }

  async unfollowUser() {
    const { ctx } = this;
    ctx.body = 'unfollowUser';
  }
}

module.exports = ProfileController;
