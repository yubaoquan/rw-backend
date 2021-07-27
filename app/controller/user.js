const { Controller } = require('egg');

class UserController extends Controller {
  async login() {
    const { ctx } = this;
    ctx.body = 'login';
  }

  async register() {
    const { ctx } = this;
    ctx.body = 'register';
  }

  async getCurrentUser() {
    const { ctx } = this;
    ctx.body = 'getCurrentUser';
  }

  async updateUser() {
    const { ctx } = this;
    ctx.body = 'updateUser';
  }
}

module.exports = UserController;
