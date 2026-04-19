const { body } = require('express-validator');

const updateProfileValidator = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('apellido').notEmpty().withMessage('El apellido es requerido'),
  body('telefono').notEmpty().withMessage('El teléfono es requerido')
];

const updateCommerceProfileValidator = [
  body('telefono').notEmpty().withMessage('El teléfono es requerido'),
  body('correo').isEmail().withMessage('El correo no es válido'),
  body('horaApertura').notEmpty().withMessage('La hora de apertura es requerida'),
  body('horaCierre').notEmpty().withMessage('La hora de cierre es requerida')
];

const createAdminValidator = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('apellido').notEmpty().withMessage('El apellido es requerido'),
  body('cedula').notEmpty().withMessage('La cédula es requerida'),
  body('correo').isEmail().withMessage('El correo no es válido'),
  body('usuario').notEmpty().withMessage('El usuario es requerido'),
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
  updateProfileValidator,
  updateCommerceProfileValidator,
  createAdminValidator
};