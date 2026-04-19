const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  imagen: { type: String, default: null },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  comercio: { type: mongoose.Schema.Types.ObjectId, ref: 'Commerce', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);