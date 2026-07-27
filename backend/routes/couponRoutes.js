const express = require('express');
const router = express.Router();
const { createCoupon, getCoupons, updateCoupon, deleteCoupon, validateCoupon } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

// Validate is public — any visitor can check a coupon code at checkout
router.post('/validate', validateCoupon);

router.get('/', protect, admin, getCoupons);
router.post('/', protect, admin, createCoupon);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;
