const { body } = require('express-validator');

const orderValidator = [
  body('direccion').notEmpty().withMessage('Debes seleccionar una dirección'),
  body('productos')
    .notEmpty().withMessage('Debes agregar al menos un producto')
];

module.exports = { orderValidator };