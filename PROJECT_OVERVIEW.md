# Govindha Canteen - Full Stack Food Ordering System
## Project Overview for Presentation

---

## 1. PROJECT INTRODUCTION

**Project Name:** Govindha Canteen  
**Project Type:** Full-Stack Web Application (Food Ordering System)  
**Purpose:** A digital canteen management system that allows customers to browse menu, place orders, and track their orders in real-time. Includes admin functionality for managing menu and orders.

---

## 2. TECHNOLOGY STACK

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | Latest | Runtime environment |
| **Express.js** | ^5.2.1 | Web framework for REST API |
| **MongoDB** | - | NoSQL database |
| **Mongoose** | ^8.23.0 | MongoDB ODM for data modeling |
| **JSON Web Token (JWT)** | ^9.0.2 | Authentication & authorization |
| **bcryptjs** | ^2.4.3 | Password hashing |
| **CORS** | ^2.8.6 | Cross-origin resource sharing |
| **dotenv** | ^17.3.1 | Environment variable management |
| **nodemon** | ^3.1.11 | Development server auto-restart |

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^19.2.0 | UI library |
| **React DOM** | ^19.2.0 | DOM rendering |
| **Vite** | ^7.2.4 | Build tool & dev server |
| **React Router DOM** | ^7.13.0 | Client-side routing |
| **Axios** | ^1.13.5 | HTTP client for API calls |
| **React Icons** | ^5.5.0 | Icon library |
| **ESLint** | ^9.39.1 | Code linting |

---

## 3. DATABASE SCHEMA

### User Model (`backend-nodejs/models/user.js`)
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  phone: String,
  createdAt: Date
}
```

### Food Model (`backend-nodejs/models/food.js`)
```
javascript
{
  name: String (required),
  description: String,
  price: Number (required),
  category: String (enum: ['snacks', 'beverages', 'meals', 'special']),
  image: String (file path),
  available: Boolean (default: true),
  createdAt: Date
}
```

### Order Model (`backend-nodejs/models/order.js`)
```
javascript
{
  orderId: String (unique, auto-generated),
  user: ObjectId (ref: User),
  items: [{
    food: ObjectId (ref: Food),
    name: String,
    quantity: Number,
    price: Number,
    image: String
  }],
  totalAmount: Number,
  discount: Number (default: 0),
  finalAmount: Number,
  status: String (enum: ['pending', 'cooking', 'ready', 'completed', 'cancelled']),
  paymentMethod: String (enum: ['phonepe', 'cod']),
  paymentStatus: String (enum: ['pending', 'paid', 'failed']),
  otp: Number (6-digit for order verification),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 4. API ENDPOINTS

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| GET | `/auth/profile` | Get user profile | Yes |

### Food Routes (`/api/foods`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/foods` | Get all available foods | No |
| GET | `/foods/:id` | Get single food item | No |
| POST | `/foods` | Add new food item | Yes (Admin) |
| PUT | `/foods/:id` | Update food item | Yes (Admin) |
| DELETE | `/foods/:id` | Delete food item) |

### Order | Yes (Admin Routes (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/orders` | Get user's orders | Yes |
| GET | `/orders/:orderId` | Get order details | Yes |
| POST | `/orders` | Place new order | Yes |
| PUT | `/orders/:id/status` | Update order status | Yes (Admin) |
| POST | `/orders/:orderId/verify-otp` | Verify OTP for pickup | Yes |

---

## 5. FRONTEND PAGES & COMPONENTS

### Pages (`frontend-react/src/pages/`)
| Page | File | Description |
|------|------|-------------|
| Home | `Home.jsx` | Landing page with hero section |
| Menu | `Menu.jsx` | Display all food items with categories |
| Cart | `Cart.jsx` | View cart items, apply discounts, checkout |
| Login | `Login.jsx` | User authentication |
| Signup | `Signup.jsx` | New user registration |
| Profile | `Profile.jsx` | User profile management |
| Order Tracking | `OrderTracking.jsx` | Real-time order status tracking |
| Admin Dashboard | `AdminDashboard.jsx` | Admin panel for menu & order management |

### Components (`frontend-react/src/components/`)
| Component | Description |
|-----------|-------------|
| `Navabar.jsx` | Navigation bar with cart icon & user menu |
| `foodcard.jsx` | Individual food item display card |
| `adimnmenucard.jsx` | Admin menu item card with edit/delete |

### Context (`frontend-react/src/context/`)
| Context | Purpose |
|---------|---------|
| `Usercontext.jsx` | User authentication state management |
| `CartContext.jsx` | Shopping cart state management |

---

## 6. KEY FEATURES

### Customer Features
1. **User Registration & Login** - JWT-based authentication
2. **Browse Menu** - View food items by categories
3. **Add to Cart** - Add items with quantity selection
4. **Place Order** - Checkout with payment method selection
5. **Order Tracking** - Real-time status updates (polling every 5 seconds)
6. **OTP Verification** - 6-digit OTP for order pickup verification
7. **Profile Management** - View and update user profile

### Admin Features
1. **Dashboard** - Overview of all orders and menu items
2. **Menu Management** - Add, edit, delete food items
3. **Order Management** - View and update order status (pending → cooking → ready → completed)
4. **Analytics** - View order statistics

---

## 7. PROJECT STRUCTURE

```
govindha canteen/
├── backend-nodejs/
│   ├── controllers/
│   │   ├── authcontroller.js      # Auth logic
│   │   ├── foodcontroller.js      # Food CRUD operations
│   │   ├── ordercontroller.js     # Order management
│   │   └── ordercontrolle.js      # Duplicate file (typo)
│   ├── middlewar/
│   │   ├── authMiddleware.js       # JWT verification
│   │   └── adminMiddleware.js     # Admin authorization
│   ├── models/
│   │   ├── user.js                # User schema
│   │   ├── food.js                # Food schema
│   │   └── order.js               # Order schema
│   ├── routes/
│   │   ├── auth.js                # Auth routes
│   │   ├── foodroutes.js          # Food routes
│   │   └── orderroutes.js         # Order routes
│   ├── server.js                  # Main server file
│   ├── seed.js                    # Database seeding
│   └── package.json
│
├── frontend-react/
│   ├── public/                    # Static assets (images)
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios configuration
│   │   ├── components/            # Reusable components
│   │   ├── context/               # React Context
│   │   ├── pages/                 # Page components
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Global styles
│   └── package.json
│
└── frontend-html/                 # Static HTML version (legacy)
```

---

## 8. SECURITY FEATURES

1. **Password Hashing** - Using bcryptjs for secure password storage
2. **JWT Authentication** - Token-based stateless authentication
3. **Protected Routes** - Middleware to verify user身份
4. **Admin Authorization** - Separate middleware for admin-only routes
5. **CORS Configuration** - Controlled cross-origin requests

---

## 9. HOW TO RUN THE PROJECT

### Prerequisites
- Node.js installed
- MongoDB installed and running

### Backend Setup
```
bash
cd backend-nodejs
npm install
npm run seed    # Seed database with sample data
npm start       # Server runs on http://localhost:5000
```

### Frontend Setup
```
bash
cd frontend-react
npm install
npm run dev     # Dev server runs on http://localhost:5173
```

### Default Admin Credentials
- Email: admin@govindha.com
- Password: admin123

---

## 10. CURRENT ISSUES & FIXES (From TODO files)

### Order Fixes (`TODO-order-fix.md`)
- ✅ Fixed duplicate orderId generation
- ✅ Added better error logging
- ✅ Fixed user ID field mismatch
- ✅ Added paymentMethod handling
- ✅ Improved frontend error messages

### Cart Fixes (`TODO-cart-fix.md`)
- ✅ Cart persistence issues resolved
- ✅ Quantity update logic fixed

### Profile Updates (`TODO-Profile-Update.md`)
- ✅ Profile update functionality implemented

---

## 11. SUMMARY

This is a **complete full-stack food ordering application** featuring:
- ✅ Modern React 19 frontend with Vite
- ✅ RESTful Node.js/Express backend
- ✅ MongoDB database with Mongoose
- ✅ JWT authentication system
- ✅ Real-time order tracking
- ✅ Admin dashboard for management
- ✅ Responsive design with CSS
- ✅ OTP verification for order pickup

**Perfect for:**
- College canteens
- Small restaurants
- Food courts
- Cafe management

---

*Generated for Presentation - Govindha Canteen Project*
