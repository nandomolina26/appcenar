const Config = require('../models/Config');

const getConfig = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) config = await new Config({ itbis: 18 }).save();
    res.render('admin/config', { config: config.toObject() });
  } catch (error) {
    res.render('admin/config', { error: 'Error cargando configuración.' });
  }
};

const getEditConfig = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) config = await new Config({ itbis: 18 }).save();
    res.render('admin/config', { config: config.toObject(), showEdit: true });
  } catch (error) {
    res.redirect('/admin/config');
  }
};

const postEditConfig = async (req, res) => {
  const { itbis } = req.body;
  try {
    let config = await Config.findOne();
    if (!config) {
      await new Config({ itbis }).save();
    } else {
      config.itbis = itbis;
      await config.save();
    }
    res.redirect('/admin/config');
  } catch (error) {
    res.render('admin/config', { error: 'Error guardando configuración.', showEdit: true });
  }
};

module.exports = { getConfig, getEditConfig, postEditConfig };