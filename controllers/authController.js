const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Commerce = require('../models/Commerce');
const CommerceType = require('../models/CommerceType');
const { sendActivationEmail, sendResetPasswordEmail } = require('../services/mail.service');

const getLogin = (req, res) => {
  res.render('auth/login');
};

const postLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/login', { errors: errors.array() });
  }

  const { usuario, password } = req.body;

  try {
    let user = await User.findOne({
      $or: [{ usuario }, { correo: usuario }]
    });

    let isCommerce = false;

    if (!user) {
      user = await Commerce.findOne({ correo: usuario });
      isCommerce = true;
    }

    if (!user) {
      return res.render('auth/login', { error: 'Usuario o contraseña incorrectos' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('auth/login', { error: 'Usuario o contraseña incorrectos' });
    }

    if (!user.activo) {
      return res.render('auth/login', {
        error: 'Tu cuenta está inactiva. Revisa tu correo o contacta un administrador.'
      });
    }

    req.session.user = {
      id: user._id,
      nombre: isCommerce ? user.nombre : `${user.nombre} ${user.apellido}`,
      correo: user.correo,
      foto: user.logo || user.foto || null,
      role: isCommerce ? 'comercio' : user.role
    };

    if (isCommerce) return res.redirect('/commerce/home');
    if (user.role === 'cliente') return res.redirect('/client/home');
    if (user.role === 'delivery') return res.redirect('/delivery/home');
    if (user.role === 'administrador') return res.redirect('/admin/home');

  } catch (error) {
    console.error(error);
    res.render('auth/login', { error: 'Error en el servidor' });
  }
};

const getRegister = (req, res) => {
  res.render('auth/register');
};

const postRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/register', { errors: errors.array(), body: req.body });
  }

  const { nombre, apellido, telefono, correo, usuario, role, password } = req.body;

  try {
    const exists = await User.findOne({ $or: [{ correo }, { usuario }] });
    if (exists) {
      return res.render('auth/register', {
        error: 'El correo o usuario ya está registrado',
        body: req.body
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      nombre, apellido, telefono, correo, usuario,
      password: hash,
      role,
      foto: req.file ? req.file.filename : null,
      activationToken: token,
      activo: false
    });

    await newUser.save();

    sendActivationEmail(correo, token).catch(err =>
      console.error('Error enviando correo activacion:', err.message)
    );

    res.render('auth/login', {
      success: 'Cuenta creada. Revisa tu correo para activarla.'
    });

  } catch (error) {
    console.error(error);
    res.render('auth/register', { error: 'Error en el servidor', body: req.body });
  }
};

const getRegisterCommerce = async (req, res) => {
  try {
    const types = await CommerceType.find().lean();
    res.render('auth/register-commerce', { types });
  } catch (error) {
    res.render('auth/register-commerce', { types: [] });
  }
};

const postRegisterCommerce = async (req, res) => {
  const errors = validationResult(req);
  const types = await CommerceType.find().lean();

  if (!errors.isEmpty()) {
    return res.render('auth/register-commerce', {
      errors: errors.array(), body: req.body, types
    });
  }

  const { nombre, telefono, correo, horaApertura, horaCierre, tipo, password } = req.body;

  try {
    const exists = await Commerce.findOne({ correo });
    if (exists) {
      return res.render('auth/register-commerce', {
        error: 'El correo ya está registrado', body: req.body, types
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString('hex');

    const newCommerce = new Commerce({
      nombre, telefono, correo, horaApertura, horaCierre, tipo,
      password: hash,
      logo: req.file ? req.file.filename : null,
      activationToken: token,
      activo: false
    });

    await newCommerce.save();

    sendActivationEmail(correo, token).catch(err =>
      console.error('Error enviando correo comercio:', err.message)
    );

    res.render('auth/login', {
      success: 'Comercio registrado. Revisa tu correo para activarlo.'
    });

  } catch (error) {
    console.error(error);
    res.render('auth/register-commerce', {
      error: 'Error en el servidor', body: req.body, types
    });
  }
};

const activateAccount = async (req, res) => {
  const { token } = req.params;

  try {
    let user = await User.findOne({ activationToken: token });
    if (!user) user = await Commerce.findOne({ activationToken: token });

    if (!user) {
      return res.render('auth/login', { error: 'Token inválido o ya utilizado.' });
    }

    user.activo = true;
    user.activationToken = null;
    await user.save();

    res.render('auth/login', { success: 'Cuenta activada exitosamente. Ya puedes iniciar sesión.' });

  } catch (error) {
    console.error(error);
    res.render('auth/login', { error: 'Error al activar la cuenta.' });
  }
};

const getForgotPassword = (req, res) => {
  res.render('auth/forgot-password');
};

const postForgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/forgot-password', { errors: errors.array() });
  }

  const { usuario } = req.body;

  try {
    let user = await User.findOne({ $or: [{ usuario }, { correo: usuario }] });
    if (!user) user = await Commerce.findOne({ correo: usuario });

    if (!user) {
      return res.render('auth/forgot-password', {
        error: 'No existe una cuenta con ese usuario o correo.'
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    sendResetPasswordEmail(user.correo, token).catch(err =>
      console.error('Error enviando correo reset:', err.message)
    );

    res.render('auth/forgot-password', {
      success: 'Te enviamos un correo con las instrucciones.'
    });

  } catch (error) {
    console.error(error);
    res.render('auth/forgot-password', { error: 'Error en el servidor.' });
  }
};

const getResetPassword = async (req, res) => {
  const { token } = req.params;

  let user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
  if (!user) user = await Commerce.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });

  if (!user) {
    return res.render('auth/login', { error: 'El enlace es inválido o ha expirado.' });
  }

  res.render('auth/reset-password', { token });
};

const postResetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/reset-password', {
      errors: errors.array(), token: req.params.token
    });
  }

  const { token } = req.params;
  const { password } = req.body;

  try {
    let user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) user = await Commerce.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });

    if (!user) {
      return res.render('auth/login', { error: 'El enlace es inválido o ha expirado.' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.render('auth/login', { success: 'Contraseña actualizada. Ya puedes iniciar sesión.' });

  } catch (error) {
    console.error(error);
    res.render('auth/reset-password', { error: 'Error en el servidor.', token });
  }
};

const logout = (req, res) => {
  req.session.destroy(() => res.redirect('/auth/login'));
};

module.exports = {
  getLogin, postLogin,
  getRegister, postRegister,
  getRegisterCommerce, postRegisterCommerce,
  activateAccount,
  getForgotPassword, postForgotPassword,
  getResetPassword, postResetPassword,
  logout
};