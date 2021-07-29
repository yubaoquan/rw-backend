const baseFields = require('./base');

module.exports = (app) => {
  const { Schema, model } = app.mongoose;

  const TagSchema = new Schema({
    ...baseFields,
    title: {
      type: String,
      required: true,
      unique: true,
    },
  });

  return model('Tag', TagSchema);
};
