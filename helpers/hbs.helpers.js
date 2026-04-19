const hbs = require('express-handlebars');

const helpers = {
  eq: (a, b) => a === b,
  neq: (a, b) => a !== b,
  formatDate: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-DO', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  },
  formatPrice: (price) => {
    if (!price) return 'RD$ 0.00';
    return `RD$ ${Number(price).toFixed(2)}`;
  },
  calcITBIS: (subtotal, itbis) => {
    if (!subtotal || !itbis) return 0;
    return ((subtotal * itbis) / 100).toFixed(2);
  },
  calcTotal: (subtotal, itbis) => {
    if (!subtotal || !itbis) return subtotal;
    return (subtotal + (subtotal * itbis) / 100).toFixed(2);
  },
  statusClass: (status) => {
    const map = { pendiente: 'warning', 'en proceso': 'info', completado: 'success' };
    return map[status] || 'secondary';
  }
};

module.exports = helpers;