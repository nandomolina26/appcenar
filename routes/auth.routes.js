const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isNotAuthenticated } = require('../middlewares/auth.middleware');
const upload = require('../config/multer');
const {
  loginValidator,
  registerValidator,
  registerCommerceValidator,
  forgotPasswordValidator,
  resetPasswordValidator
} = require('../middlewares/validators/auth.validator');

router.get('/login', isNotAuthenticated, authController.getLogin);
router.post('/login', isNotAuthenticated, loginValidator, authController.postLogin);

router.get('/register', isNotAuthenticated, authController.getRegister);
router.post('/register', isNotAuthenticated, upload.single('foto'),
  registerValidator, authController.postRegister);

router.get('/register-commerce', isNotAuthenticated, authController.getRegisterCommerce);
router.post('/register-commerce', isNotAuthenticated, upload.single('logo'),
  registerCommerceValidator, authController.postRegisterCommerce);

router.get('/activate/:token', authController.activateAccount);

router.get('/forgot-password', isNotAuthenticated, authController.getForgotPassword);
router.post('/forgot-password', isNotAuthenticated,
  forgotPasswordValidator, authController.postForgotPassword);

router.get('/reset-password/:token', authController.getResetPassword);
router.post('/reset-password/:token', resetPasswordValidator, authController.postResetPassword);

router.get('/logout', authController.logout);

module.exports = router;