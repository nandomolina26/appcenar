const User = require('../models/User');
const Commerce = require('../models/Commerce');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const getDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalOrders = await Order.countDocuments();
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });

    const activeCommerces = await Commerce.countDocuments({ activo: true });
    const inactiveCommerces = await Commerce.countDocuments({ activo: false });

    const activeClients = await User.countDocuments({ role: 'cliente', activo: true });
    const inactiveClients = await User.countDocuments({ role: 'cliente', activo: false });

    const activeDeliveries = await User.countDocuments({ role: 'delivery', activo: true });
    const inactiveDeliveries = await User.countDocuments({ role: 'delivery', activo: false });

    const totalProducts = await require('../models/Product').countDocuments();

    res.render('admin/dashboard', {
      totalOrders, todayOrders,
      activeCommerces, inactiveCommerces,
      activeClients, inactiveClients,
      activeDeliveries, inactiveDeliveries,
      totalProducts
    });
  } catch (error) {
    console.error(error);
    res.render('admin/dashboard', { error: 'Error cargando el dashboard.' });
  }
};

const getClients = async (req, res) => {
  try {
    const clients = await User.find({ role: 'cliente' });
    const clientsWithOrders = await Promise.all(
      clients.map(async (c) => {
        const orderCount = await Order.countDocuments({ cliente: c._id });
        return { ...c.toObject(), orderCount };
      })
    );
    res.render('admin/clients', { clients: clientsWithOrders });
  } catch (error) {
    res.render('admin/clients', { error: 'Error cargando clientes.' });
  }
};

const toggleClientStatus = async (req, res) => {
  try {
    const client = await User.findOne({ _id: req.params.id, role: 'cliente' });
    if (!client) return res.redirect('/admin/clients');
    client.activo = !client.activo;
    await client.save();
    res.redirect('/admin/clients');
  } catch (error) {
    res.redirect('/admin/clients');
  }
};

const getDeliveries = async (req, res) => {
  try {
    const deliveries = await User.find({ role: 'delivery' });
    const deliveriesWithOrders = await Promise.all(
      deliveries.map(async (d) => {
        const orderCount = await Order.countDocuments({ delivery: d._id, estado: 'completado' });
        return { ...d.toObject(), orderCount };
      })
    );
    res.render('admin/deliveries', { deliveries: deliveriesWithOrders });
  } catch (error) {
    res.render('admin/deliveries', { error: 'Error cargando deliveries.' });
  }
};

const toggleDeliveryStatus = async (req, res) => {
  try {
    const delivery = await User.findOne({ _id: req.params.id, role: 'delivery' });
    if (!delivery) return res.redirect('/admin/deliveries');
    delivery.activo = !delivery.activo;
    await delivery.save();
    res.redirect('/admin/deliveries');
  } catch (error) {
    res.redirect('/admin/deliveries');
  }
};

const getCommerces = async (req, res) => {
  try {
    const commerces = await Commerce.find().populate('tipo');
    const commercesWithOrders = await Promise.all(
      commerces.map(async (c) => {
        const orderCount = await Order.countDocuments({ comercio: c._id });
        return { ...c.toObject(), orderCount };
      })
    );
    res.render('admin/commerces', { commerces: commercesWithOrders });
  } catch (error) {
    res.render('admin/commerces', { error: 'Error cargando comercios.' });
  }
};

const toggleCommerceStatus = async (req, res) => {
  try {
    const commerce = await Commerce.findById(req.params.id);
    if (!commerce) return res.redirect('/admin/commerces');
    commerce.activo = !commerce.activo;
    await commerce.save();
    res.redirect('/admin/commerces');
  } catch (error) {
    res.redirect('/admin/commerces');
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'administrador' });
    res.render('admin/admins', {
      admins: admins.map(a => a.toObject()),
      currentUser: req.session.user.id
    });
  } catch (error) {
    res.render('admin/admins', { error: 'Error cargando administradores.' });
  }
};

const getCreateAdmin = (req, res) => {
  res.render('admin/admins', { showCreate: true });
};

const postCreateAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('admin/admins', { errors: errors.array(), showCreate: true, body: req.body });
  }

  const { nombre, apellido, cedula, correo, usuario, password } = req.body;

  try {
    const exists = await User.findOne({ $or: [{ correo }, { usuario }] });
    if (exists) {
      return res.render('admin/admins', {
        error: 'El correo o usuario ya existe.',
        showCreate: true,
        body: req.body
      });
    }

    const hash = await bcrypt.hash(password, 10);
    await new User({
      nombre, apellido, telefono: cedula, correo, usuario,
      password: hash, role: 'administrador', activo: true,
      cedula
    }).save();

    res.redirect('/admin/admins');
  } catch (error) {
    res.render('admin/admins', { error: 'Error creando administrador.', showCreate: true });
  }
};

const getEditAdmin = async (req, res) => {
  try {
    if (req.params.id === req.session.user.id) return res.redirect('/admin/admins');
    const admin = await User.findOne({ _id: req.params.id, role: 'administrador' });
    if (!admin) return res.redirect('/admin/admins');
    res.render('admin/admins', { editAdmin: admin.toObject(), currentUser: req.session.user.id });
  } catch (error) {
    res.redirect('/admin/admins');
  }
};

const postEditAdmin = async (req, res) => {
  try {
    if (req.params.id === req.session.user.id) return res.redirect('/admin/admins');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('admin/admins', {
        errors: errors.array(),
        editAdmin: { _id: req.params.id, ...req.body }
      });
    }

    const { nombre, apellido, cedula, correo, usuario, password } = req.body;
    const update = { nombre, apellido, cedula, correo, usuario };
    if (password) update.password = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(req.params.id, update);
    res.redirect('/admin/admins');
  } catch (error) {
    res.redirect('/admin/admins');
  }
};

const toggleAdminStatus = async (req, res) => {
  try {
    if (req.params.id === req.session.user.id) return res.redirect('/admin/admins');
    const admin = await User.findOne({ _id: req.params.id, role: 'administrador' });
    if (!admin) return res.redirect('/admin/admins');
    admin.activo = !admin.activo;
    await admin.save();
    res.redirect('/admin/admins');
  } catch (error) {
    res.redirect('/admin/admins');
  }
};

module.exports = {
  getDashboard,
  getClients, toggleClientStatus,
  getDeliveries, toggleDeliveryStatus,
  getCommerces, toggleCommerceStatus,
  getAdmins, getCreateAdmin, postCreateAdmin,
  getEditAdmin, postEditAdmin, toggleAdminStatus
};