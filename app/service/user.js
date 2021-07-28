/* eslint-disable no-underscore-dangle */
const { Service } = require('egg');

class UserService extends Service {
  get User() {
    return this.app.model.User;
  }

  findById(_id) {
    return this.User.findOne({ _id });
  }

  findByUsername(username) {
    return this.User.findOne({ username });
  }

  findByEmail(email) {
    return this.User.findOne({ email });
  }

  async createUser(data) {
    data.password = this.ctx.helper.saltMd5(data.password);
    const user = new this.User(data);
    await user.save();
    return user;
  }

  async updateUser(data) {
    if (data.password) data.password = this.ctx.helper.saltMd5(data.password);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _id } = this.ctx.user;
    return this.User.findOneAndUpdate({ _id }, data, { new: true });
  }

  createToken(data) {
    return this.ctx.helper.sign(data);
  }

  verifyToken(token) {
    return this.ctx.helper.verify(token);
  }

  async follow(currentUserId, targetUser) {
    const currentUser = await this.findById(currentUserId);
    const targetUserId = targetUser._id;

    const { following = [] } = currentUser;
    if (!following.includes(targetUserId)) following.push(targetUserId);

    const { followedBy = [] } = targetUser;
    if (!followedBy.includes(currentUserId)) followedBy.push(currentUserId);

    await Promise.all([currentUser.save(), targetUser.save()]);
  }

  async unfollow(currentUserId, targetUser) {
    const currentUser = await this.findById(currentUserId);
    const targetUserId = targetUser._id;

    const { following = [] } = currentUser;
    if (following.includes(targetUserId)) {
      currentUser.following = following.filter((id) => !id.equals(targetUserId));
    }

    const { followedBy = [] } = targetUser;
    if (followedBy.includes(currentUserId)) {
      targetUser.followedBy = followedBy.filter((id) => !id.equals(currentUserId));
    }

    await Promise.all([currentUser.save(), targetUser.save()]);
  }
}

module.exports = UserService;
