const express = require('express');
const router = express.Router();const { isAuthenticated } = require('../middlewares/auth.middleware');
const { hasRole } = require('../middlewares/role.middleware');
const deliveryController = require('../controllers/deliveryController');
const orderController = require('../controllers/orderController');
const profileController = require('../controllers/profileController');
const upload = require('../config/multer');
const { updateProfileValidator } = require('../middlewares/validators/user.validator');

router.use(isAuthenticated, hasRole('delivery'));

// Home y pedidos
router.get('/home', deliveryController.getHome);
router.get('/orders/:id', orderController.getDeliveryOrderDetail);
router.post('/orders/:id/complete', orderController.completeOrder);

// Perfil
router.get('/profile', profileController.getDeliveryProfile);
router.post('/profile', upload.single('foto'),
  updateProfileValidator, profileController.postDeliveryProfile);

module.exports = router;