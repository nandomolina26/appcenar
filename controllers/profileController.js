const User = require('../models/User');
const Commerce = require('../models/Commerce');
const { validationResult } = require('express-validator');

const getClientProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    res.render('client/profile', { profile: user.toObject() });
  } catch (error) {
    res.render('client/profile', { error: 'Error cargando perfil.' });
  }
};

const postClientProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const user = await User.findById(req.session.user.id);
    return res.render('client/profile', {
      errors: errors.array(),
      profile: user.toObject()
    });
  }

  try {
    const { nombre, apellido, telefono } = req.body;
    const update = { nombre, apellido, telefono };
    if (req.file) update.foto = req.file.filename;

    const updated = await User.findByIdAndUpdate(req.session.user.id, update, { new: true });

    req.session.user.nombre = `${updated.nombre} ${updated.apellido}`;
    req.session.user.foto = updated.foto;

    res.redirect('/client/profile');
  } catch (error) {
    res.render('client/profile', { error: 'Error actualizando perfil.' });
  }
};

const getDeliveryProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    res.render('delivery/profile', { profile: user.toObject() });
  } catch (error) {
    res.render('delivery/profile', { error: 'Error cargando perfil.' });
  }
};

const postDeliveryProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const user = await User.findById(req.session.user.id);
    return res.render('delivery/profile', {
      errors: errors.array(),
      profile: user.toObject()
    });
  }

  try {
    const { nombre, apellido, telefono } = req.body;
    const update = { nombre, apellido, telefono };
    if (req.file) update.foto = req.file.filename;

    const updated = await User.findByIdAndUpdate(req.session.user.id, update, { new: true });

    req.session.user.nombre = `${updated.nombre} ${updated.apellido}`;
    req.session.user.foto = updated.foto;

    res.redirect('/delivery/profile');
  } catch (error) {
    res.render('delivery/profile', { error: 'Error actualizando perfil.' });
  }
};

const getCommerceProfile = async (req, res) => {
  try {
    const commerce = await Commerce.findById(req.session.user.id);
    res.render('commerce/profile', { profile: commerce.toObject() });
  } catch (error) {
    res.render('commerce/profile', { error: 'Error cargando perfil.' });
  }
};

const postCommerceProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const commerce = await Commerce.findById(req.session.user.id);
    return res.render('commerce/profile', {
      errors: errors.array(),
      profile: commerce.toObject()
    });
  }

  try {
    const { telefono, correo, horaApertura, horaCierre } = req.body;
    const update = { telefono, correo, horaApertura, horaCierre };
    if (req.file) update.logo = req.file.filename;

    const updated = await Commerce.findByIdAndUpdate(req.session.user.id, update, { new: true });

    req.session.user.foto = updated.logo;

    res.redirect('/commerce/profile');
  } catch (error) {
    res.render('commerce/profile', { error: 'Error actualizando perfil.' });
  }
};

module.exports = {
  getClientProfile, postClientProfile,
  getDeliveryProfile, postDeliveryProfile,
  getCommerceProfile, postCommerceProfile
};