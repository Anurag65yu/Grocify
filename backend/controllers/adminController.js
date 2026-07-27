const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const lowStockProducts = await Product.find({ stock: { $lt: 10 } }).select('name stock');

    res.status(200).json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      lowStockProducts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET sales report (orders grouped by date)
const getSalesReport = async (req, res) => {
  try {
    const report = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllUsers, getDashboardStats, getSalesReport };