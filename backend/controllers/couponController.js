const Coupon = require('../models/Coupon');

// CREATE (admin)
const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL (admin)
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE (admin)
const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.status(200).json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE (admin)
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.status(200).json({ message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// VALIDATE (any logged-in user, called at checkout)
const validateCoupon = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: 'This coupon is no longer active' });
    }

    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({ message: 'This coupon has expired' });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'This coupon has reached its usage limit' });
    }

    if (orderTotal < coupon.minOrderValue) {
      return res.status(400).json({
        message: ` Minimum order value of ₹${coupon.minOrderValue} required for this coupon`
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'flat') {
      discountAmount = coupon.discountValue;
    } else {
      discountAmount = (orderTotal * coupon.discountValue) / 100;
    }

    // Don't let discount exceed the order total
    if (discountAmount > orderTotal) {
      discountAmount = orderTotal;
    }

    res.status(200).json({
      valid: true,
      code: coupon.code,
      discountAmount,
      finalAmount: orderTotal - discountAmount
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createCoupon, getCoupons, updateCoupon, deleteCoupon, validateCoupon };