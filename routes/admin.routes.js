const express = require('express');
const router = express.Router();const { isAuthenticated } = require('../middlewares/auth.middleware');
const { hasRole } = require('../middlewares/role.middleware');
const adminController = require('../controllers/adminController');
const commerceTypeController = require('../controllers/commerceTypeController');
const configController = require('../controllers/configController');
const upload = require('../config/multer');
const { createAdminValidator } = require('../middlewares/validators/user.validator');

router.use(isAuthenticated, hasRole('administrador'));

// Dashboard
router.get('/home', adminController.getDashboard);

// Clientes
router.get('/clients', adminController.getClients);
router.post('/clients/:id/toggle', adminController.toggleClientStatus);

// Deliveries
router.get('/deliveries', adminController.getDeliveries);
router.post('/deliveries/:id/toggle', adminController.toggleDeliveryStatus);

// Comercios
router.get('/commerces', adminController.getCommerces);
router.post('/commerces/:id/toggle', adminController.toggleCommerceStatus);

// Administradores
router.get('/admins', adminController.getAdmins);
router.get('/admins/create', adminController.getCreateAdmin);
router.post('/admins/create', createAdminValidator, adminController.postCreateAdmin);
router.get('/admins/edit/:id', adminController.getEditAdmin);
router.post('/admins/edit/:id', createAdminValidator, adminController.postEditAdmin);
router.post('/admins/:id/toggle', adminController.toggleAdminStatus);

// Tipos de comercio
router.get('/commerce-types', commerceTypeController.getCommerceTypes);
router.get('/commerce-types/create', commerceTypeController.getCreateCommerceType);
router.post('/commerce-types/create', upload.single('icono'),
  commerceTypeController.postCreateCommerceType);
router.get('/commerce-types/edit/:id', commerceTypeController.getEditCommerceType);
router.post('/commerce-types/edit/:id', upload.single('icono'),
  commerceTypeController.postEditCommerceType);
router.get('/commerce-types/delete/:id', commerceTypeController.getDeleteCommerceType);
router.post('/commerce-types/delete/:id', commerceTypeController.postDeleteCommerceType);

// Configuración
router.get('/config', configController.getConfig);
router.get('/config/edit', configController.getEditConfig);
router.post('/config/edit', configController.postEditConfig);

module.exports = router;