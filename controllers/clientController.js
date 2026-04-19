const CommerceType = require('../models/CommerceType');
const Commerce = require('../models/Commerce');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Favorite = require('../models/Favorite');

const getHome = async (req, res) => {
  try {
    const types = await CommerceType.find();
    res.render('client/home', { types: types.map(t => t.toObject()) });
  } catch (error) {
    console.error(error);
    res.render('client/home', { error: 'Error cargando los tipos de comercio.' });
  }
};

const getCommerces = async (req, res) => {
  try {
    const { typeId } = req.params;
    const { search } = req.query;
    const type = await CommerceType.findById(typeId);

    const filter = { tipo: typeId, activo: true };
    if (search) filter.nombre = { $regex: search, $options: 'i' };

    const commerces = await Commerce.find(filter);
    const favorites = await Favorite.find({ cliente: req.session.user.id });
    const favoriteIds = favorites.map(f => f.comercio.toString());

    const commercesWithFav = commerces.map(c => ({
      ...c.toObject(),
      isFavorite: favoriteIds.includes(c._id.toString())
    }));

    res.render('client/commerce-list', {
      commerces: commercesWithFav,
      type,
      total: commerces.length,
      search
    });
  } catch (error) {
    console.error(error);
    res.redirect('/client/home');
  }
};

const getCatalog = async (req, res) => {
  try {
    const { commerceId } = req.params;
    const commerce = await Commerce.findById(commerceId);
    const categories = await Category.find({ comercio: commerceId });

    const categoriesWithProducts = await Promise.all(
      categories.map(async (cat) => {
        const products = await Product.find({ categoria: cat._id });
        return { ...cat.toObject(), products: products.map(p => p.toObject()) };
      })
    );

    res.render('client/catalog', { commerce: commerce.toObject(), categoriesWithProducts });
  } catch (error) {
    console.error(error);
    res.redirect('/client/home');
  }
};

const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ cliente: req.session.user.id })
      .populate('comercio');
    res.render('client/favorites', { favorites: favorites.map(f => f.toObject()) });
  } catch (error) {
    console.error(error);
    res.render('client/favorites', { error: 'Error cargando favoritos.' });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const { commerceId } = req.params;
    const clientId = req.session.user.id;

    const exists = await Favorite.findOne({ cliente: clientId, comercio: commerceId });
    if (exists) {
      await Favorite.findByIdAndDelete(exists._id);
    } else {
      await new Favorite({ cliente: clientId, comercio: commerceId }).save();
    }

    res.redirect('back');
  } catch (error) {
    console.error(error);
    res.redirect('back');
  }
};

module.exports = { getHome, getCommerces, getCatalog, getFavorites, toggleFavorite };