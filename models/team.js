'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

const TeamSchema = new Schema({
  name: String,
  creationDate: { type: Date, default: Date.now() },
  stars: { type: Number, default: 0 },
  tmp: { type: Boolean, default: false },
  players: [{ type: Schema.ObjectId, ref: 'Player' }]
});

module.exports = {
  TeamModel: mongoose.model('Team', TeamSchema),
  TeamSchema
};
