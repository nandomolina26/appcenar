const Address = require('../models/Address');

const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ cliente: req.session.user.id });
    res.render('client/addresses', { addresses: addresses.map(a => a.toObject()) });
  } catch (error) {
    res.render('client/addresses', { error: 'Error cargando direcciones.' });
  }
};

const getCreateAddress = (req, res) => {
  res.render('client/addresses', { showCreate: true });
};

const postCreateAddress = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    await new Address({ nombre, descripcion, cliente: req.session.user.id }).save();
    res.redirect('/client/addresses');
  } catch (error) {
    res.render('client/addresses', { error: 'Error creando dirección.' });
  }
};

const getEditAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, cliente: req.session.user.id });
    if (!address) return res.redirect('/client/addresses');
    res.render('client/addresses', { editAddress: address.toObject() });
  } catch (error) {
    res.redirect('/client/addresses');
  }
};

const postEditAddress = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    await Address.findOneAndUpdate(
      { _id: req.params.id, cliente: req.session.user.id },
      { nombre, descripcion }
    );
    res.redirect('/client/addresses');
  } catch (error) {
    res.redirect('/client/addresses');
  }
};

const getDeleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, cliente: req.session.user.id });
    if (!address) return res.redirect('/client/addresses');
    res.render('client/addresses', { deleteAddress: address.toObject() });
  } catch (error) {
    res.redirect('/client/addresses');
  }
};

const postDeleteAddress = async (req, res) => {
  try {
    await Address.findOneAndDelete({ _id: req.params.id, cliente: req.session.user.id });
    res.redirect('/client/addresses');
  } catch (error) {
    res.redirect('/client/addresses');
  }
};

module.exports = {
  getAddresses, getCreateAddress, postCreateAddress,
  getEditAddress, postEditAddress,
  getDeleteAddress, postDeleteAddress
};