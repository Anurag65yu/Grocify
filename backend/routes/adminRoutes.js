const express = require('express');
const router = express.Router();
const { getAllUsers, getDashboardStats, getSalesReport } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, getAllUsers);
router.get('/dashboard-stats', protect, admin, getDashboardStats);
router.get('/sales-report', protect, admin, getSalesReport);

module.exports = router;