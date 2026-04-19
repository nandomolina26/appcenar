const { body } = require('express-validator');

const loginValidator = [
  body('usuario').notEmpty().withMessage('El usuario o correo es requerido'),
  body('password').notEmpty().withMessage('La contraseña es requerida')
];

const registerValidator = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('apellido').notEmpty().withMessage('El apellido es requerido'),
  body('telefono').notEmpty().withMessage('El teléfono es requerido'),
  body('correo').isEmail().withMessage('El correo no es válido'),
  body('usuario').notEmpty().withMessage('El nombre de usuario es requerido'),
  body('role')
    .isIn(['cliente', 'delivery'])
    .withMessage('El rol debe ser cliente o delivery'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('confirmarPassword').custom((value, { req }) => {
    if (value !== req.body.password)
      throw new Error('Las contraseñas no coinciden');
    return true;
  })
];

const registerCommerceValidator = [
  body('nombre').notEmpty().withMessage('El nombre del comercio es requerido'),
  body('telefono').notEmpty().withMessage('El teléfono es requerido'),
  body('correo').isEmail().withMessage('El correo no es válido'),
  body('horaApertura').notEmpty().withMessage('La hora de apertura es requerida'),
  body('horaCierre').notEmpty().withMessage('La hora de cierre es requerida'),
  body('tipo').notEmpty().withMessage('El tipo de comercio es requerido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('confirmarPassword').custom((value, { req }) => {
    if (value !== req.body.password)
      throw new Error('Las contraseñas no coinciden');
    return true;
  })
];

const forgotPasswordValidator = [
  body('usuario').notEmpty().withMessage('El usuario o correo es requerido')
];

const resetPasswordValidator = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('confirmarPassword').custom((value, { req }) => {
    if (value !== req.body.password)
      throw new Error('Las contraseñas no coinciden');
    return true;
  })
];

module.exports = {
  loginValidator,
  registerValidator,
  registerCommerceValidator,
  forgotPasswordValidator,
  resetPasswordValidator
};