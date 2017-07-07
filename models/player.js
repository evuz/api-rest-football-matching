'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = Schema({
  userId: { type: Schema.ObjectId, ref: 'User' },
  name: { type: String, require: true },
  description: String,
  image: String,
  city: String,
  favoritePosition: String,
  birthdate: Date,
  stars: { type: Number, default: 0 }
});

module.exports = {
  PlayerModel: mongoose.model('Player', PlayerSchema),
  PlayerSchema
}
