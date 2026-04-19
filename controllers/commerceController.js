const Order = require('../models/Order');

const getHome = async (req, res) => {
  try {
    const orders = await Order.find({ comercio: req.session.user.id })
      .populate('comercio')
      .sort({ createdAt: -1 });

    res.render('commerce/home', { orders: orders.map(o => o.toObject()) });
  } catch (error) {
    console.error(error);
    res.render('commerce/home', { error: 'Error cargando pedidos.' });
  }
};

module.exports = { getHome };