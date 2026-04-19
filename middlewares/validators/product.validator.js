const { body } = require('express-validator');

const productValidator = [
  body('nombre').notEmpty().withMessage('El nombre del producto es requerido'),
  body('descripcion').notEmpty().withMessage('La descripción es requerida'),
  body('precio')
    .isNumeric().withMessage('El precio debe ser un número')
    .custom(v => v > 0).withMessage('El precio debe ser mayor a 0'),
  body('categoria').notEmpty().withMessage('La categoría es requerida')
];

const categoryValidator = [
  body('nombre').notEmpty().withMessage('El nombre de la categoría es requerido'),
  body('descripcion').notEmpty().withMessage('La descripción es requerida')
];

module.exports = { productValidator, categoryValidator };