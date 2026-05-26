# 🍔 Multivendor Food Ordering System

A comprehensive backend API for a multi-restaurant food delivery platform. This system allows customers to browse multiple restaurants, manage shopping carts, place orders, and tracks order status while enabling restaurant owners to manage their menus and orders.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Database Models](#-database-models)
- [Authentication](#-authentication)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔐 User Authentication & Management
- **User Registration** - Create new customer accounts with email verification
- **Email Verification** - OTP-based verification system with 5-minute expiration
- **Sign In/Sign Out** - Secure JWT-based authentication with 6-hour token expiration
- **Password Management**:
  - Change password (for authenticated users)
  - Forgot password with OTP verification
  - Secure password reset functionality
- **User Roles** - Three distinct user types:
  - `user` - Regular customers
  - `owner` - Restaurant owners/vendors
  - `admin` - System administrators

### 🏪 Multi-Vendor Restaurant Management
- **Restaurant Creation** - Admin can onboard new restaurants with owner assignment
- **Restaurant Profiles** - Store name, address, contact, description, cuisine types
- **Restaurant Operations**:
  - Update restaurant information (owners & admins only)
  - Deactivate/manage restaurant status
  - Browse all active restaurants
  - Automatic timestamps for tracking

### 🍽️ Menu & Product Management
- **Product Categories** - Starter, Main Course, Dessert, Beverage, Sides
- **Product Information** - Name, price, category, availability status
- **Restaurant-Specific Menus** - Each restaurant maintains its own menu
- **Inventory Management** - Track product availability

### 🛒 Shopping Cart
- **Cart Operations**:
  - Add/update items with quantity tracking
  - One cart per user, limited to one restaurant at a time
  - Automatic total price calculation
  - Minimum quantity validation (at least 1 item)
- **Cart Persistence** - Timestamped cart data

### 📦 Order Processing
- **Order Status Workflow**:
  - Pending Payment → Paid → Preparing → Delivered → Completed
  - Order cancellation support
- **Order Details**:
  - Track customer and restaurant association
  - Line items with quantities and purchase prices
  - Order total calculation
  - Automatic timestamps
- **Price Protection** - Captures price at purchase time (protects against menu price changes)

### 📧 Email Notifications
- Verification code delivery
- Password reset code sending
- Configurable email templates

---

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Node.js | - |
| **Language** | JavaScript | 100% |
| **Framework** | Express.js | 5.2.1 |
| **Database** | MongoDB | Latest |
| **ODM** | Mongoose | 9.6.2 |
| **Authentication** | JWT | 9.0.3 |
| **Password Hashing** | bcrypt | 6.0.0 |
| **Input Validation** | Joi | 18.2.1 |
| **Email Service** | Nodemailer | 8.0.7 |
| **Dev Tool** | Nodemon | 3.1.14 |
| **Environment** | dotenv | 17.4.2 |
| **Cookies** | cookie-parser | 1.4.7 |

---

## 📁 Project Structure

```
multivendor-food-ordering-system/
│
├── server.js                          # Main application entry point
├── package.json                       # Project dependencies
├── package-lock.json                  # Locked dependency versions
│
├── config/                            # Configuration files
│   ├── dbConnect.js                  # MongoDB connection setup
│   └── sendMail.js                   # Email service configuration
│
├── models/                            # Database schemas
│   ├── userModel.js                  # User (customer, owner, admin)
│   ├── restaurantModel.js            # Restaurant/Vendor
│   ├── menuModel.js                  # Menu items/Products
│   ├── orderModel.js                 # Orders
│   └── cartModel.js                  # Shopping cart
│
├── controllers/                       # Request handlers
│   ├── authController.js             # Sign up, sign in, verification
│   ├── restaurantController.js       # Restaurant CRUD operations
│   ├── menuController.js             # Menu/Product management
│   ├── orderController.js            # Order processing
│   ├── cartController.js             # Cart operations
│   └── adminController.js            # Admin functions
│
├── Routes/                            # API route definitions
│   ├── userRoutes.js                 # Authentication endpoints
│   ├── restaurantRoutes.js           # Restaurant endpoints
│   ├── menuRoutes.js                 # Menu endpoints
│   ├── orderRoutes.js                # Order endpoints
│   └── cartRoutes.js                 # Cart endpoints
│
├── services/                          # Business logic layer
│   └── authService.js                # Authentication logic
│
├── middlewares/                       # Express middlewares
│   └── errorHandler.js               # Global error handling
│
├── validators/                        # Input validation schemas
│   ├── authValidator.js              # Auth validation rules
│   └── adminValidator.js             # Admin validation rules
│
├── utils/                             # Utility functions
│   ├── createError.js                # Custom error handling
│   └── hashing.js                    # Password & OTP utilities
│
└── .gitignore                        # Git ignore rules
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local or cloud instance)
- **Nodemailer** compatible email service

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/Fondjo-Styve/Multivendor-food-ordering-system.git
cd Multivendor-food-ordering-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment configuration**
```bash
touch .env
```

---

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3500

# Database
MONGODB_URI=mongodb://localhost:27017/food-ordering-system
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-ordering-system

# JWT Authentication
TOKEN_SECRET=your_super_secret_jwt_key_here_change_in_production

# Email Service (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Email Configuration
EMAIL_FROM=noreply@foodorderingsystem.com

# Optional: Environment
NODE_ENV=development
```

### Email Setup Example (Gmail)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an "App Password" from Google Account Security settings
3. Use this app password as `SMTP_PASS`

---

## ▶️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start at **`http://localhost:3500`**

You should see:
```
server started in http://localhost:3500
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3500/api
```

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/send-otp` | Send verification OTP |
| POST | `/auth/verify-otp` | Verify email with OTP |
| POST | `/auth/signin` | Sign in to account |
| POST | `/auth/signout` | Sign out from account |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/verify-reset-code` | Verify reset code |
| POST | `/auth/reset-password` | Reset password |
| POST | `/auth/change-password` | Change current password |

### Restaurant Endpoints (`/api/restaurant`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/restaurant/create` | Create new restaurant (Admin) |
| PUT | `/restaurant/:id` | Update restaurant details |
| GET | `/restaurant` | Get all active restaurants |
| DELETE | `/restaurant/:id` | Deactivate restaurant |

### Menu Endpoints (`/api/menu`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/menu/add` | Add menu item |
| PUT | `/menu/:id` | Update menu item |
| GET | `/menu/:restaurantId` | Get restaurant menu |
| DELETE | `/menu/:id` | Delete menu item |

### Order Endpoints (`/api/order`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/order/create` | Create new order |
| GET | `/order/:id` | Get order details |
| PUT | `/order/:id` | Update order status |
| GET | `/order/user/:userId` | Get user's orders |

### Cart Endpoints (`/api/cart`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/cart/add` | Add item to cart |
| PUT | `/cart/update` | Update cart item quantity |
| GET | `/cart/:userId` | Get user's cart |
| DELETE | `/cart/remove/:itemId` | Remove item from cart |

---

## 💾 Database Models

### User Model
```javascript
{
  email: String (unique, required, lowercase),
  name: String (required),
  password: String (hashed, required),
  role: String (enum: 'user', 'owner', 'admin'),
  verified: Boolean (default: false),
  isActive: Boolean (default: true),
  emailVerificationCode: String,
  emailVerificationCodeExpiresAt: Date,
  forgotPasswordResetCode: String,
  forgotPasswordResetCodeExpiresAt: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Restaurant Model
```javascript
{
  name: String (required, lowercase),
  ownerName: String (required, lowercase),
  owner: ObjectId (reference to User),
  address: String (required),
  phoneNumber: String (required),
  description: String (required),
  cuisineType: [String] (required),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Menu/Product Model
```javascript
{
  restaurantId: ObjectId (reference to Restaurant, required),
  name: String (required, trimmed),
  price: Number (required, non-negative),
  category: String (enum: 'starter', 'main-course', 'dessert', 'beverage', 'sides'),
  isAvailable: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Cart Model
```javascript
{
  userId: ObjectId (reference to User, required, unique),
  restaurantId: ObjectId (reference to Restaurant, required),
  items: [
    {
      productId: ObjectId (reference to Product),
      quantity: Number (min: 1)
    }
  ],
  totalPrice: Number (default: 0),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Order Model
```javascript
{
  userId: ObjectId (reference to User, required),
  restaurantId: ObjectId (reference to Restaurant, required),
  items: [
    {
      productId: ObjectId (reference to Product),
      quantity: Number (min: 1),
      priceAtPurchase: Number
    }
  ],
  totalPrice: Number (required),
  status: String (enum: 'pending_payment', 'paid', 'preparing', 'deliverred', 'cancelled'),
  createdAt: Date (auto)
}
```

---

## 🔐 Authentication

### How It Works

1. **Registration**
   - User submits email, name, and password
   - Password is hashed using bcrypt (12 salt rounds)
   - User created with `verified: false`

2. **Email Verification**
   - Admin sends 6-digit OTP to user's email
   - OTP valid for 5 minutes
   - Hashed before storage for security
   - User becomes `verified: true` after successful OTP verification

3. **Sign In**
   - User submits email and password
   - Password compared with stored hash
   - JWT token generated (6-hour expiration)
   - Token stored in HTTPOnly cookie
   - Includes userId, role, email, and verification status

4. **Protected Routes**
   - JWT token required in request headers or cookies
   - User identity extracted from token
   - Role-based access control enforced

### Token Structure
```javascript
{
  userId: "user_mongo_id",
  role: "user|owner|admin",
  email: "user@example.com",
  verified: true
}
```

---

## 🔑 Key Security Features

✅ **Password Security**
- bcrypt hashing with 12 salt rounds
- Passwords never stored in plain text
- Password field excluded from default queries

✅ **Email Verification**
- OTP-based verification
- 5-minute code expiration
- Unverified users cannot sign in

✅ **JWT Authentication**
- Secure token-based authentication
- 6-hour token expiration
- HTTPOnly cookies prevent XSS attacks

✅ **Authorization**
- Role-based access control (RBAC)
- Users can only modify their own data
- Owners can only manage their restaurants
- Admins have elevated privileges

✅ **Input Validation**
- Joi schema validation on all inputs
- Type checking and format validation
- Custom error messages

✅ **Error Handling**
- Global error handler middleware
- Consistent error response format
- Sensitive info excluded from error messages

---

## 👥 User Roles & Permissions

### Customer (user)
- Sign up and verify email
- Browse restaurants and menus
- Add items to cart
- Place orders
- View order history
- Change password

### Restaurant Owner (owner)
- Create restaurant account
- Update restaurant information
- Add and manage menu items
- View orders for their restaurant
- Update order status
- Manage restaurant deactivation

### Administrator (admin)
- Create restaurants
- Assign restaurant owners
- Update any restaurant
- Deactivate restaurants
- System management

---

## 🧪 Testing the API

### Using Postman or cURL

1. **Sign Up**
```bash
curl -X POST http://localhost:3500/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secure_password_123"
  }'
```

2. **Send Verification OTP**
```bash
curl -X POST http://localhost:3500/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

3. **Verify OTP**
```bash
curl -X POST http://localhost:3500/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "verificationCode": "123456"
  }'
```

4. **Sign In**
```bash
curl -X POST http://localhost:3500/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure_password_123"
  }'
```

5. **Get All Restaurants**
```bash
curl -X GET http://localhost:3500/api/restaurant
```

---

## 📈 Project Status

### ✅ Completed Features
- User authentication system
- Email verification with OTP
- Restaurant management
- Menu/Product system
- Shopping cart functionality
- Order processing
- Password reset flows
- Role-based access control

### 🚧 In Development
- Enhanced admin dashboard
- Real-time order tracking
- Additional middleware implementations

### 📋 Planned Features
- Payment gateway integration (Stripe, PayPal)
- Real-time notifications (WebSockets)
- Restaurant ratings & reviews
- Delivery tracking
- Order history
- File uploads for restaurant images
- SMS notifications
- Analytics dashboard

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
   ```bash
   git clone https://github.com/Fondjo-Styve/Multivendor-food-ordering-system.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit your changes**
   ```bash
   git commit -m "Add: description of your changes"
   ```

4. **Push to the branch**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**
   - Describe your changes clearly
   - Reference any related issues

### Coding Standards
- Use meaningful variable names
- Add comments for complex logic
- Follow the existing code structure
- Test your changes before submitting

---

## 📝 License

This project is licensed under the ISC License - see the `package.json` file for details.

---

## 👨‍💻 Author

**Styve_FK** - [Fondjo-Styve](https://github.com/Fondjo-Styve)

---

## 📞 Support

For issues, questions, or suggestions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Provide error logs and steps to reproduce

---

## 🎯 Quick Start Checklist

- [ ] Clone the repository
- [ ] Install dependencies (`npm install`)
- [ ] Create `.env` file with required variables
- [ ] Connect MongoDB database
- [ ] Start the server (`npm run dev`)
- [ ] Test API endpoints using Postman/cURL
- [ ] Review database models
- [ ] Explore authentication flow

---

**Happy Coding! 🚀**

For more information and updates, visit the [GitHub Repository](https://github.com/Fondjo-Styve/Multivendor-food-ordering-system)
