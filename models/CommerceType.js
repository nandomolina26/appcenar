const mongoose = require('mongoose');

const commerceTypeSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  icono: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('CommerceType', commerceTypeSchema);