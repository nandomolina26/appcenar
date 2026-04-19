const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { hasRole } = require('../middlewares/role.middleware');
const clientController = require('../controllers/clientController');
const orderController = require('../controllers/orderController');
const addressController = require('../controllers/addressController');
const profileController = require('../controllers/profileController');
const upload = require('../config/multer');
const { updateProfileValidator } = require('../middlewares/validators/user.validator');

router.use(isAuthenticated, hasRole('cliente'));

router.get('/home', clientController.getHome);
router.get('/commerces/:typeId', clientController.getCommerces);
router.get('/catalog/:commerceId', clientController.getCatalog);
router.get('/checkout/:commerceId', orderController.getCheckout);
router.post('/checkout', orderController.postCheckout);
router.get('/orders', orderController.getClientOrders);
router.get('/orders/:id', orderController.getClientOrderDetail);
router.get('/addresses', addressController.getAddresses);
router.get('/addresses/create', addressController.getCreateAddress);
router.post('/addresses/create', addressController.postCreateAddress);
router.get('/addresses/edit/:id', addressController.getEditAddress);
router.post('/addresses/edit/:id', addressController.postEditAddress);
router.get('/addresses/delete/:id', addressController.getDeleteAddress);
router.post('/addresses/delete/:id', addressController.postDeleteAddress);
router.get('/favorites', clientController.getFavorites);
router.post('/favorites/:commerceId', clientController.toggleFavorite);
router.get('/profile', profileController.getClientProfile);
router.post('/profile', upload.single('foto'), updateProfileValidator, profileController.postClientProfile);

module.exports = router;