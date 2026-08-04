# 🛒 Grocify — Online Grocery Delivery App

A full-stack grocery delivery web app built with **React + Vite** (frontend) and **Node.js / Express + MongoDB** (backend).

**Live Demo:** [grocify-eta-ruby.vercel.app](https://grocify-eta-ruby.vercel.app/)

---

## ✨ Features

- 🔐 JWT-based user authentication (register / login / logout)
- 🛍️ Product catalog with categories (Fruits, Vegetables, Dairy, Snacks, Beverages)
- 🛒 Cart with real-time item management
- ❤️ Wishlist
- 💳 Checkout with coupon/discount support
- 💰 Payment — UPI, Debit/Credit Card, Cash on Delivery (demo mode)
- 📦 Order placement & tracking with visual timeline
- 📍 Live location detection (browser Geolocation + OpenStreetMap)
- 🧑‍💼 Admin panel to manage orders and advance delivery status
- 📱 Responsive design — works on mobile and desktop

---

## 🏗️ Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 18, Vite, React Router v6, Context API |
| Backend   | Node.js, Express 5, Mongoose |
| Database  | MongoDB Atlas |
| Auth      | JWT (jsonwebtoken), bcryptjs |
| Hosting   | Vercel (frontend), Render (backend) |

---

## 📁 Project Structure

```
Grocify/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── Pages/     # All page components
│   │   ├── components/# Shared components (Header, Footer, etc.)
│   │   ├── context/   # React Context (Auth, Cart, Orders, etc.)
│   │   └── styles/    # Global CSS
│   └── package.json
│
└── backend/           # Express API server
    ├── controllers/   # Route handlers
    ├── models/        # Mongoose schemas
    ├── routes/        # API routes
    ├── config/        # DB connection, auto-seed
    └── server.js
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- pnpm (`npm install -g pnpm`)
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo

```bash
git clone https://github.com/Anurag65yu/Grocify.git
cd Grocify
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
PORT=5000
```

```bash
npm start
```

The backend runs on `http://localhost:5000`. On first start it auto-seeds the database with products, categories, and coupons.

### 3. Frontend setup

```bash
cd ../frontend
pnpm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
pnpm dev
```

The frontend runs on `http://localhost:5173`.

---

## 🔑 Demo Credentials (on live site)

| Role  | Email             | Password |
|-------|-------------------|----------|
| Admin | admin@grocify.com | admin123 |
| User  | Register a new account | —   |

---

## 🛒 Coupon Codes

| Code      | Discount      | Min Order |
|-----------|---------------|-----------|
| `SAVE10`  | ₹10 flat off  | ₹100      |
| `FRESH20` | 20% off       | ₹200      |

---

## 📦 API Endpoints

| Method | Route                       | Description          |
|--------|-----------------------------|----------------------|
| POST   | `/api/auth/register`        | Register user        |
| POST   | `/api/auth/login`           | Login user           |
| GET    | `/api/products`             | Get all products     |
| GET    | `/api/products/:id`         | Get product by ID    |
| GET    | `/api/categories`           | Get all categories   |
| POST   | `/api/orders/place`         | Place an order       |
| GET    | `/api/orders`               | Get user orders      |
| PATCH  | `/api/orders/:id/status`    | Advance order status |
| POST   | `/api/coupons/validate`     | Validate coupon      |
| GET    | `/api/wishlist`             | Get wishlist         |
| POST   | `/api/wishlist/:productId`  | Add to wishlist      |
| DELETE | `/api/wishlist/:productId`  | Remove from wishlist |
| GET    | `/health`                   | Health check         |

---

## 🌍 Deployment

- **Frontend** → [Vercel](https://vercel.com) — auto-deploys on push to `main`
- **Backend** → [Render](https://render.com) — auto-deploys on push to `main`

### Environment variables on Render (backend)

```
MONGO_URI       = <your Atlas connection string>
JWT_SECRET      = <random secret>
FRONTEND_URL    = https://grocify-eta-ruby.vercel.app
PORT            = 10000
```

### Environment variables on Vercel (frontend)

```
VITE_API_URL    = https://grocify-1-taev.onrender.com/api
```

---

## 📸 Pages

| Page | Route |
|------|-------|
| Home / Product Catalog | `/` |
| Category | `/category/:name` |
| Product Detail | `/product/:id` |
| Cart | `/cart` |
| Wishlist | `/wishlist` |
| Checkout | `/checkout` |
| Payment | `/payment` |
| Order Success | `/order-success/:id` |
| Order Tracking | `/track/:orderId` |
| My Orders | `/orders` |
| Profile | `/profile` |
| Admin Panel | `/admin` |
| Help Center | `/help` |
| Delivery Info | `/delivery-info` |
| Return Policy | `/return-policy` |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first.

---

## 📄 License

MIT License — feel free to use this project for learning or portfolio purposes.

---

> Built with ❤️ by [Anurag](https://github.com/Anurag65yu)
