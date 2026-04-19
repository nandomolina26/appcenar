const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const clientRoutes = require('./client.routes');
const commerceRoutes = require('./commerce.routes');
const deliveryRoutes = require('./delivery.routes');
const adminRoutes = require('./admin.routes');

router.use('/auth', authRoutes);
router.use('/client', clientRoutes);
router.use('/commerce', commerceRoutes);
router.use('/delivery', deliveryRoutes);
router.use('/admin', adminRoutes);

router.get('/', (req, res) => res.redirect('/auth/login'));

module.exports = router;