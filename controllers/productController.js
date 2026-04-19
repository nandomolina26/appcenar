const Product = require('../models/Product');
const Category = require('../models/Category');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ comercio: req.session.user.id })
      .populate('categoria');
    res.render('commerce/products', { products: products.map(p => p.toObject()) });
  } catch (error) {
    res.render('commerce/products', { error: 'Error cargando productos.' });
  }
};

const getCreateProduct = async (req, res) => {
  const categories = await Category.find({ comercio: req.session.user.id });
  res.render('commerce/products', { showCreate: true, categories: categories.map(c => c.toObject()) });
};

const postCreateProduct = async (req, res) => {
  const { nombre, descripcion, precio, categoria } = req.body;
  try {
    await new Product({
      nombre, descripcion, precio, categoria,
      comercio: req.session.user.id,
      imagen: req.file ? req.file.filename : null
    }).save();
    res.redirect('/commerce/products');
  } catch (error) {
    const categories = await Category.find({ comercio: req.session.user.id });
    res.render('commerce/products', { error: 'Error creando producto.', categories: categories.map(c => c.toObject()) });
  }
};

const getEditProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, comercio: req.session.user.id });
    if (!product) return res.redirect('/commerce/products');
    const categories = await Category.find({ comercio: req.session.user.id });
    res.render('commerce/products', {
      editProduct: product.toObject(),
      categories: categories.map(c => c.toObject())
    });
  } catch (error) {
    res.redirect('/commerce/products');
  }
};

const postEditProduct = async (req, res) => {
  const { nombre, descripcion, precio, categoria } = req.body;
  try {
    const update = { nombre, descripcion, precio, categoria };
    if (req.file) update.imagen = req.file.filename;

    await Product.findOneAndUpdate(
      { _id: req.params.id, comercio: req.session.user.id },
      update
    );
    res.redirect('/commerce/products');
  } catch (error) {
    res.redirect('/commerce/products');
  }
};

const getDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, comercio: req.session.user.id });
    if (!product) return res.redirect('/commerce/products');
    res.render('commerce/products', { deleteProduct: product.toObject() });
  } catch (error) {
    res.redirect('/commerce/products');
  }
};

const postDeleteProduct = async (req, res) => {
  try {
    await Product.findOneAndDelete({ _id: req.params.id, comercio: req.session.user.id });
    res.redirect('/commerce/products');
  } catch (error) {
    res.redirect('/commerce/products');
  }
};

module.exports = {
  getProducts, getCreateProduct, postCreateProduct,
  getEditProduct, postEditProduct,
  getDeleteProduct, postDeleteProduct
};