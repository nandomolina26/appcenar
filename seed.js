const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.development' });

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');

  const existe = await User.findOne({ usuario: 'admin' });
  if (existe) {
    console.log('El administrador ya existe');
    process.exit();
  }

  const hash = await bcrypt.hash('admin123', 10);
  await User.create({
    nombre: 'Admin',
    apellido: 'Principal',
    telefono: '8091234567',
    correo: 'admin@appcenar.com',
    usuario: 'admin',
    password: hash,
    role: 'administrador',
    activo: true
  });

  console.log('Administrador creado exitosamente');
  console.log('Usuario: admin');
  console.log('Password: admin123');
  process.exit();

}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});