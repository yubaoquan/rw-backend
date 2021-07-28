const baseFields = require('./base');

module.exports = (app) => {
  const { Schema, model } = app.mongoose;

  const CommentSchema = new Schema({
    ...baseFields,
    articleId: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
    },
    body: {
      type: String,
      default: null,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  });

  return model('Comment', CommentSchema);
};
