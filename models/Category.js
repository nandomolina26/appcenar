const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  comercio: { type: mongoose.Schema.Types.ObjectId, ref: 'Commerce', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);