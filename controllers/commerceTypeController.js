const CommerceType = require('../models/CommerceType');
const Commerce = require('../models/Commerce');

const getCommerceTypes = async (req, res) => {
  try {
    const types = await CommerceType.find();
    const typesWithCount = await Promise.all(
      types.map(async (t) => {
        const count = await Commerce.countDocuments({ tipo: t._id });
        return { ...t.toObject(), commerceCount: count };
      })
    );
    res.render('admin/commerce-types', { types: typesWithCount });
  } catch (error) {
    res.render('admin/commerce-types', { error: 'Error cargando tipos.' });
  }
};

const getCreateCommerceType = (req, res) => {
  res.render('admin/commerce-types', { showCreate: true });
};

const postCreateCommerceType = async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    await new CommerceType({
      nombre, descripcion,
      icono: req.file ? req.file.filename : null
    }).save();
    res.redirect('/admin/commerce-types');
  } catch (error) {
    res.render('admin/commerce-types', { error: 'Error creando tipo de comercio.', showCreate: true });
  }
};

const getEditCommerceType = async (req, res) => {
  try {
    const type = await CommerceType.findById(req.params.id);
    if (!type) return res.redirect('/admin/commerce-types');
    res.render('admin/commerce-types', { editType: type.toObject() });
  } catch (error) {
    res.redirect('/admin/commerce-types');
  }
};

const postEditCommerceType = async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const update = { nombre, descripcion };
    if (req.file) update.icono = req.file.filename;
    await CommerceType.findByIdAndUpdate(req.params.id, update);
    res.redirect('/admin/commerce-types');
  } catch (error) {
    res.redirect('/admin/commerce-types');
  }
};

const getDeleteCommerceType = async (req, res) => {
  try {
    const type = await CommerceType.findById(req.params.id);
    if (!type) return res.redirect('/admin/commerce-types');
    res.render('admin/commerce-types', { deleteType: type.toObject() });
  } catch (error) {
    res.redirect('/admin/commerce-types');
  }
};

const postDeleteCommerceType = async (req, res) => {
  try {
    await Commerce.deleteMany({ tipo: req.params.id });
    await CommerceType.findByIdAndDelete(req.params.id);
    res.redirect('/admin/commerce-types');
  } catch (error) {
    res.redirect('/admin/commerce-types');
  }
};

module.exports = {
  getCommerceTypes, getCreateCommerceType, postCreateCommerceType,
  getEditCommerceType, postEditCommerceType,
  getDeleteCommerceType, postDeleteCommerceType
};