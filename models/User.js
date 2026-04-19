const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  telefono: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  usuario: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  foto: { type: String, default: null },
  role: { type: String, enum: ['cliente', 'delivery', 'administrador'], required: true },
  activo: { type: Boolean, default: false },
  activationToken: { type: String, default: null },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
  // solo para delivery
  disponible: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);