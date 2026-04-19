const Category = require('../models/Category');
const Product = require('../models/Product');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ comercio: req.session.user.id });
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ categoria: cat._id });
        return { ...cat.toObject(), productCount: count };
      })
    );
    res.render('commerce/categories', { categories: categoriesWithCount });
  } catch (error) {
    res.render('commerce/categories', { error: 'Error cargando categorías.' });
  }
};

const getCreateCategory = (req, res) => {
  res.render('commerce/categories', { showCreate: true });
};

const postCreateCategory = async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    await new Category({ nombre, descripcion, comercio: req.session.user.id }).save();
    res.redirect('/commerce/categories');
  } catch (error) {
    res.render('commerce/categories', { error: 'Error creando categoría.' });
  }
};

const getEditCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, comercio: req.session.user.id });
    if (!category) return res.redirect('/commerce/categories');
    res.render('commerce/categories', { editCategory: category.toObject() });
  } catch (error) {
    res.redirect('/commerce/categories');
  }
};

const postEditCategory = async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    await Category.findOneAndUpdate(
      { _id: req.params.id, comercio: req.session.user.id },
      { nombre, descripcion }
    );
    res.redirect('/commerce/categories');
  } catch (error) {
    res.redirect('/commerce/categories');
  }
};

const getDeleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, comercio: req.session.user.id });
    if (!category) return res.redirect('/commerce/categories');
    res.render('commerce/categories', { deleteCategory: category.toObject() });
  } catch (error) {
    res.redirect('/commerce/categories');
  }
};

const postDeleteCategory = async (req, res) => {
  try {
    await Category.findOneAndDelete({ _id: req.params.id, comercio: req.session.user.id });
    res.redirect('/commerce/categories');
  } catch (error) {
    res.redirect('/commerce/categories');
  }
};

module.exports = {
  getCategories, getCreateCategory, postCreateCategory,
  getEditCategory, postEditCategory,
  getDeleteCategory, postDeleteCategory
};