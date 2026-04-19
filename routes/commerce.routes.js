const express = require('express');
const router = express.Router();const { isAuthenticated } = require('../middlewares/auth.middleware');
const { hasRole } = require('../middlewares/role.middleware');
const commerceController = require('../controllers/commerceController');
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const profileController = require('../controllers/profileController');
const upload = require('../config/multer');
const { updateCommerceProfileValidator } = require('../middlewares/validators/user.validator');
const { productValidator, categoryValidator } = require('../middlewares/validators/product.validator');

router.use(isAuthenticated, hasRole('comercio'));

// Home y pedidos
router.get('/home', commerceController.getHome);
router.get('/orders/:id', orderController.getCommerceOrderDetail);
router.post('/orders/:id/assign', orderController.assignDelivery);

// Perfil
router.get('/profile', profileController.getCommerceProfile);
router.post('/profile', upload.single('logo'),
  updateCommerceProfileValidator, profileController.postCommerceProfile);

// Categorías
router.get('/categories', categoryController.getCategories);
router.get('/categories/create', categoryController.getCreateCategory);
router.post('/categories/create', categoryValidator, categoryController.postCreateCategory);
router.get('/categories/edit/:id', categoryController.getEditCategory);
router.post('/categories/edit/:id', categoryValidator, categoryController.postEditCategory);
router.get('/categories/delete/:id', categoryController.getDeleteCategory);
router.post('/categories/delete/:id', categoryController.postDeleteCategory);

// Productos
router.get('/products', productController.getProducts);
router.get('/products/create', productController.getCreateProduct);
router.post('/products/create', upload.single('imagen'),
  productValidator, productController.postCreateProduct);
router.get('/products/edit/:id', productController.getEditProduct);
router.post('/products/edit/:id', upload.single('imagen'),
  productValidator, productController.postEditProduct);
router.get('/products/delete/:id', productController.getDeleteProduct);
router.post('/products/delete/:id', productController.postDeleteProduct);

module.exports = router;