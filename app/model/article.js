const baseFields = require('./base');

module.exports = (app) => {
  const { Schema, model } = app.mongoose;

  const ArticleSchema = new Schema({
    ...baseFields,
    title: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    body: {
      type: String,
      default: null,
    },
    tagList: {
      type: [String],
      default: [],
    },
    favoritesCount: {
      type: Number,
      default: 0,
    },
    favoritedBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  });

  return model('Article', ArticleSchema);
};
