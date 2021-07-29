const baseFields = require('./base');

module.exports = (app) => {
  const { Schema, model } = app.mongoose;

  const UserSchema = new Schema({
    ...baseFields,
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    bio: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    followedBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    following: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    favoriteArticles: {
      type: [Schema.Types.ObjectId],
      ref: 'Article',
    },
  });

  return model('User', UserSchema);
};
