const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comercio: { type: mongoose.Schema.Types.ObjectId, ref: 'Commerce', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Favorite', favoriteSchema);