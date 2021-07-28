/* eslint-disable no-underscore-dangle */
const { Controller } = require('egg');

class UserController extends Controller {
  get userService() {
    return this.service.user;
  }

  async login() {
    const { ctx } = this;
    const { user } = ctx.request.body;

    ctx.validate({
      email: { type: 'email' },
      password: { type: 'string' },
    }, user);

    const userFromDb = await this.userService.findByEmail(user.email).select('+password');
    if (!userFromDb) this.ctx.throw(422, '用户不存在');

    const pwdMd5 = this.ctx.helper.saltMd5(user.password);
    if (pwdMd5 !== userFromDb.password) this.ctx.throw(422, '密码不正确');

    const token = await this.userService.createToken({ userId: userFromDb._id });

    ctx.body = {
      user: {
        username: userFromDb.username,
        email: userFromDb.email,
        token,
      },
    };
  }

  async register() {
    const { ctx } = this;
    const { user } = ctx.request.body;

    ctx.validate({
      username: { type: 'string' },
      email: { type: 'email' },
      password: { type: 'string' },
    }, user);

    if (await this.userService.findByUsername(user.username)) {
      this.ctx.throw(422, '用户名已存在');
    }

    if (await this.userService.findByEmail(user.email)) {
      this.ctx.throw(422, '邮箱已存在');
    }

    const ret = await this.userService.createUser(user);
    const token = await this.userService.createToken({ userId: ret._id });

    ctx.body = {
      user: {
        username: ret.username,
        email: ret.email,
        token,
      },
    };
  }

  async getCurrentUser() {
    const { ctx } = this;
    const { user } = ctx;
    ctx.body = { user: ctx.helper.lodash.pick(user, ['email', 'token', 'username', 'bio', 'image']) };
  }

  async updateUser() {
    const { ctx } = this;
    const userData = ctx.request.body.user;

    ctx.validate({
      username: { type: 'string', required: false, allowEmpty: false, max: 20 },
      email: { type: 'email', required: false, allowEmpty: false, max: 20 },
      password: { type: 'string', required: false, allowEmpty: false, max: 20 },
      image: { type: 'string', required: false, max: 300 },
      bio: { type: 'string', required: false, max: 50 },
    }, userData);

    const currentUserId = ctx.user._id;

    if (userData.username) {
      const user1 = await this.userService.findByUsername(userData.username);
      if (user1 && !user1._id.equals(currentUserId)) ctx.throw(422, '用户名已存在');
    }

    if (userData.email) {
      const user2 = await this.userService.findByEmail(userData.email);
      if (user2 && !user2._id.equals(currentUserId)) ctx.throw(422, '邮箱已存在');
    }

    const ret = await this.userService.updateUser(userData);
    ctx.body = { user: ret };
  }
}

module.exports = UserController;
