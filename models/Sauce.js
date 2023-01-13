const mongoose = require('mongoose');

const sauceSchema = mongoose.schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: String }, // + <userId>
  usersDisliked: { type: String }, // + <userId>
});

module.exports = mongoose.model('Sauce', sauceSchema);
