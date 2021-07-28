/* eslint-disable no-underscore-dangle */
const { Controller } = require('egg');

class ProfileController extends Controller {
  get userService() {
    return this.service.user;
  }

  async getProfile() {
    const { ctx } = this;
    const user = await this.userService.findByUsername(ctx.params.username);

    if (user) {
      let following = false;
      if (ctx.user?._id) {
        following = user.followedBy.some((id) => id.equals(ctx.user._id));
      }

      ctx.body = {
        profile: {
          following,
          username: user.username,
          bio: user.bio,
          image: user.image,
        },
      };
    } else {
      ctx.body = { profile: null };
    }
  }

  async followUser() {
    const { ctx } = this;
    const currentUserId = ctx.user._id;
    const targetUser = await this.userService.findByUsername(ctx.params.username);
    if (!targetUser) ctx.throw(422, '无此用户');
    if (targetUser._id.equals(currentUserId)) ctx.throw(422, '不能关注自己');

    await this.userService.follow(currentUserId, targetUser);

    ctx.body = {
      profile: {
        following: true,
        username: targetUser.username,
        bio: targetUser.bio,
        image: targetUser.image,
      },
    };
  }

  async unfollowUser() {
    const { ctx } = this;
    const currentUserId = ctx.user._id;
    const targetUser = await this.userService.findByUsername(ctx.params.username);
    if (!targetUser) ctx.throw(422, '无此用户');
    if (targetUser._id.equals(currentUserId)) ctx.throw(422, '不能取关自己');

    await this.userService.unfollow(currentUserId, targetUser);

    ctx.body = {
      profile: {
        following: false,
        username: targetUser.username,
        bio: targetUser.bio,
        image: targetUser.image,
      },
    };
  }
}

module.exports = ProfileController;
