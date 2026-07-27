const Payment = require('../models/Payment');
const Order = require('../models/Order');

// CREATE payment (simulate initiating payment)
const createPayment = async (req, res) => {
  try {
    const { orderId, method } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this order' });
    }

    const transactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);

    const payment = await Payment.create({
      order: orderId,
      user: req.user._id,
      amount: order.totalAmount,
      method: method || 'upi',
      transactionId,
      status: 'pending'
    });

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// VERIFY payment (simulate gateway confirming success)
const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Simulate success (in a real gateway, this would check a signature/callback)
    payment.status = 'success';
    await payment.save();

    await Order.findByIdAndUpdate(payment.order, { paymentStatus: 'paid' });

    res.status(200).json({ message: 'Payment verified', payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createPayment, verifyPayment };