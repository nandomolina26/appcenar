const Order = require('../models/Order');
const Address = require('../models/Address');
const Commerce = require('../models/Commerce');
const Product = require('../models/Product');
const Config = require('../models/Config');
const User = require('../models/User');

const getCheckout = async (req, res) => {
  try {
    const { commerceId } = req.params;
    const commerce = await Commerce.findById(commerceId);
    const addresses = await Address.find({ cliente: req.session.user.id });
    const config = await Config.findOne();

    res.render('client/checkout', {
      commerce: commerce.toObject(),
      addresses: addresses.map(a => a.toObject()),
      itbis: config ? config.itbis : 18
    });
  } catch (error) {
    console.error(error);
    res.redirect('/client/home');
  }
};

const postCheckout = async (req, res) => {
  try {
    const { comercioId, direccion, productos } = req.body;
    const config = await Config.findOne();
    const itbis = config ? config.itbis : 18;

    const parsedProducts = JSON.parse(productos);
    const address = await Address.findById(direccion);

    let subtotal = 0;
    const orderProducts = await Promise.all(
      parsedProducts.map(async (p) => {
        const product = await Product.findById(p.id);
        subtotal += product.precio;
        return {
          producto: product._id,
          nombre: product.nombre,
          imagen: product.imagen,
          precio: product.precio
        };
      })
    );

    const itbisAmount = (subtotal * itbis) / 100;
    const total = subtotal + itbisAmount;

    const order = new Order({
      cliente: req.session.user.id,
      comercio: comercioId,
      direccion: direccion,
      direccionTexto: `${address.nombre} - ${address.descripcion}`,
      productos: orderProducts,
      subtotal,
      itbis: itbisAmount,
      total,
      estado: 'pendiente'
    });

    await order.save();
    res.redirect('/client/home');

  } catch (error) {
    console.error(error);
    res.redirect('/client/home');
  }
};

const getClientOrders = async (req, res) => {
  try {
    const orders = await Order.find({ cliente: req.session.user.id })
      .populate('comercio')
      .sort({ createdAt: -1 });

    res.render('client/orders', { orders: orders.map(o => o.toObject()) });
  } catch (error) {
    console.error(error);
    res.render('client/orders', { error: 'Error cargando pedidos.' });
  }
};

const getClientOrderDetail = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      cliente: req.session.user.id
    }).populate('comercio');

    if (!order) return res.redirect('/client/orders');

    res.render('client/order-detail', { order: order.toObject() });
  } catch (error) {
    console.error(error);
    res.redirect('/client/orders');
  }
};

const getCommerceOrderDetail = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      comercio: req.session.user.id
    }).populate('comercio');

    if (!order) return res.redirect('/commerce/home');

    res.render('commerce/order-detail', { order: order.toObject() });
  } catch (error) {
    console.error(error);
    res.redirect('/commerce/home');
  }
};

const assignDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.estado !== 'pendiente') return res.redirect('/commerce/home');

    const delivery = await User.findOne({ role: 'delivery', disponible: true, activo: true });

    if (!delivery) {
      const fullOrder = await Order.findById(req.params.id).populate('comercio');
      return res.render('commerce/order-detail', {
        order: fullOrder.toObject(),
        error: 'No hay delivery disponible en este momento. Intente más tarde.'
      });
    }

    order.delivery = delivery._id;
    order.estado = 'en proceso';
    await order.save();

    delivery.disponible = false;
    await delivery.save();

    res.redirect('/commerce/home');
  } catch (error) {
    console.error(error);
    res.redirect('/commerce/home');
  }
};

const getDeliveryOrderDetail = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      delivery: req.session.user.id
    }).populate('comercio');

    if (!order) return res.redirect('/delivery/home');

    res.render('delivery/order-detail', { order: order.toObject() });
  } catch (error) {
    console.error(error);
    res.redirect('/delivery/home');
  }
};

const completeOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      delivery: req.session.user.id,
      estado: 'en proceso'
    });

    if (!order) return res.redirect('/delivery/home');

    order.estado = 'completado';
    await order.save();

    await User.findByIdAndUpdate(req.session.user.id, { disponible: true });

    res.redirect('/delivery/home');
  } catch (error) {
    console.error(error);
    res.redirect('/delivery/home');
  }
};

module.exports = {
  getCheckout, postCheckout,
  getClientOrders, getClientOrderDetail,
  getCommerceOrderDetail, assignDelivery,
  getDeliveryOrderDetail, completeOrder
};