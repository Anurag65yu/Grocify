/**
 * Seed script — run once to populate the database.
 * Usage (from the backend/ directory):
 *   node seed.js
 * On Render: open Shell tab and run: node seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Category = require('./models/Category');
const Product  = require('./models/Product');
const User     = require('./models/User');
const Coupon   = require('./models/Coupon');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI is not set. Add it to your .env file.');
  process.exit(1);
}

const categoryNames = ['Fruits', 'Vegetables', 'Dairy', 'Snacks', 'Beverages'];

const productData = [
  { name: 'Fresh Apple',   category: 'Fruits',     price: 120, unit: '1 kg',    stock: 45,  description: 'Crisp and sweet apples',     image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400' },
  { name: 'Banana',        category: 'Fruits',     price: 60,  unit: '1 dozen', stock: 80,  description: 'Ripe bananas',               image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400' },
  { name: 'Mango',         category: 'Fruits',     price: 100, unit: '1 kg',    stock: 25,  description: 'Seasonal mangoes',           image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400' },
  { name: 'Tomato',        category: 'Vegetables', price: 40,  unit: '1 kg',    stock: 8,   description: 'Farm-fresh tomatoes',        image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400' },
  { name: 'Potato',        category: 'Vegetables', price: 50,  unit: '1 kg',    stock: 120, description: 'Fresh potatoes',             image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400' },
  { name: 'Milk',          category: 'Dairy',      price: 55,  unit: '1 L',     stock: 35,  description: 'Full cream milk',            image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400' },
  { name: 'Cheese',        category: 'Dairy',      price: 150, unit: '200 g',   stock: 5,   description: 'Processed cheese slices',    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400' },
  { name: 'Potato Chips',  category: 'Snacks',     price: 30,  unit: '1 pack',  stock: 60,  description: 'Classic salted chips',       image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400' },
  { name: 'Cold Drink',    category: 'Beverages',  price: 45,  unit: '750 ml',  stock: 90,  description: 'Chilled soft drink',         image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400' },
  { name: 'Orange Juice',  category: 'Beverages',  price: 90,  unit: '1 L',     stock: 3,   description: 'Fresh orange juice',         image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400' },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // ── Categories ──────────────────────────────────────────────────────────────
  const categoryMap = {};
  for (const name of categoryNames) {
    let cat = await Category.findOne({ name });
    if (!cat) {
      cat = await Category.create({ name });
      console.log(`  Created category: ${name}`);
    } else {
      console.log(`  Category already exists: ${name}`);
    }
    categoryMap[name] = cat._id;
  }

  // ── Products ─────────────────────────────────────────────────────────────────
  for (const p of productData) {
    const exists = await Product.findOne({ name: p.name });
    if (!exists) {
      await Product.create({ ...p, category: categoryMap[p.category] });
      console.log(`  Created product: ${p.name}`);
    } else {
      console.log(`  Product already exists: ${p.name}`);
    }
  }

  // ── Admin user ───────────────────────────────────────────────────────────────
  const adminEmail = 'admin@grocify.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Admin', email: adminEmail, password: hashed, role: 'admin' });
    console.log('  Created admin user: admin@grocify.com / admin123');
  } else {
    console.log('  Admin user already exists');
  }

  // ── Sample coupons ───────────────────────────────────────────────────────────
  const coupons = [
    { code: 'SAVE10',  discountType: 'flat',    discountValue: 10,  minOrderValue: 100, expiryDate: new Date('2027-12-31') },
    { code: 'FRESH20', discountType: 'percent', discountValue: 20,  minOrderValue: 200, expiryDate: new Date('2027-12-31') },
  ];
  for (const c of coupons) {
    const exists = await Coupon.findOne({ code: c.code });
    if (!exists) {
      await Coupon.create(c);
      console.log(`  Created coupon: ${c.code}`);
    } else {
      console.log(`  Coupon already exists: ${c.code}`);
    }
  }

  console.log('\nSeed complete!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
