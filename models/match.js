'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

const MatchSchema = Schema({
  name: String,
  description: String,
  date: { type: Date, require: true },
  city: { type: String, require: true },
  direction: { type: String, require: true },
  price: { type: Number, default: 0 },
  playersByTeam: { type: Number, default: 5 },
  localTeam: { type: Schema.ObjectId, ref: 'Team' },
  awayTeam: { type: Schema.ObjectId, ref: 'Team' }
});

module.exports = {
  MatchModel: mongoose.model('Match', MatchSchema),
  MatchSchema
};
