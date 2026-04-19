const mongoose = require('mongoose');

const commerceSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  telefono: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  logo: { type: String, default: null },
  horaApertura: { type: String, required: true },
  horaCierre: { type: String, required: true },
  tipo: { type: mongoose.Schema.Types.ObjectId, ref: 'CommerceType', required: true },
  password: { type: String, required: true },
  activo: { type: Boolean, default: false },
  activationToken: { type: String, default: null },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Commerce', commerceSchema);