'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

const TeamSchema = new Schema({
  name: String,
  players: Array
});

module.exports = {
  TeamModel: mongoose.model('Team', TeamSchema),
  TeamSchema
};
