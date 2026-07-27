const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// PLACE ORDER — accepts items from request body (frontend cart) or falls back to server cart
const placeOrder = async (req, res) => {
  try {
    const { address, items: clientItems, couponCode, discountAmount: clientDiscount } = req.body;

    if (!address) {
      return res.status(400).json({ message: 'Address is required' });
    }

    let orderItemsData;

    if (clientItems && clientItems.length > 0) {
      // Items sent directly from frontend (localStorage cart)
      const productIds = clientItems.map(i => i.productId);
      const products = await Product.find({ _id: { $in: productIds } });

      for (const ci of clientItems) {
        const product = products.find(p => p._id.toString() === ci.productId);
        if (!product) return res.status(400).json({ message: 'Product not found' });
        if (product.stock < ci.quantity) {
          return res.status(400).json({
            message: `Not enough stock for ${product.name}. Available: ${product.stock}`
          });
        }
      }

      orderItemsData = clientItems.map(ci => {
        const product = products.find(p => p._id.toString() === ci.productId);
        return { product: product._id, quantity: ci.quantity, priceAtPurchase: product.price };
      });
    } else {
      // Fall back to server-side cart
      const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          return res.status(400).json({
            message: `Not enough stock for ${item.product.name}. Available: ${item.product.stock}`
          });
        }
      }
      orderItemsData = cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
      }));
      cart.items = [];
      await cart.save();
    }

    const subtotal = orderItemsData.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0);
    const discountAmount = Number(clientDiscount) || 0;
    const totalAmount = Math.max(0, subtotal - discountAmount);

    const order = await Order.create({
      user: req.user._id,
      items: orderItemsData,
      totalAmount,
      couponApplied: couponCode || null,
      discountAmount,
      address,
      paymentStatus: 'paid',
    });

    for (const item of orderItemsData) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    const populatedOrder = await order.populate('items.product');
    res.status(201).json(populatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET orders — returns all orders for admin, own orders for regular users
const getMyOrders = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    const orders = await Order.find(filter)
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE delivery status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { deliveryStatus } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { deliveryStatus }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, updateOrderStatus };
