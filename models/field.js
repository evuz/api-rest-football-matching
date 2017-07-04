'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FieldSchema = Schema({
    name: String,
    description: String,
    image: String,
    city: String,
    category: { type: String, enum: ['soccer', 'basketball', 'tennis'] },
    stars: { type: Number, default: 0 }
});

module.exports = mongoose.model('Field', FieldSchema);