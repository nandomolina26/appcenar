const mongoose = require('mongoose');

const orderProductSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  nombre: { type: String, required: true },
  imagen: { type: String },
  precio: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comercio: { type: mongoose.Schema.Types.ObjectId, ref: 'Commerce', required: true },
  delivery: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  direccion: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  direccionTexto: { type: String, required: true },
  productos: [orderProductSchema],
  subtotal: { type: Number, required: true },
  itbis: { type: Number, required: true },
  total: { type: Number, required: true },
  estado: {
    type: String,
    enum: ['pendiente', 'en proceso', 'completado'],
    default: 'pendiente'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);