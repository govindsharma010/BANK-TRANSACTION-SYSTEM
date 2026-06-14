# Bank Transaction System

A robust Node.js backend application for managing banking transactions, user accounts, and financial operations. This system provides secure authentication, account management, and transaction processing capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Security](#security)
- [Contributing](#contributing)

## ✨ Features

- **User Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Secure logout functionality
  - Password encryption with bcryptjs

- **Account Management**
  - Create and manage multiple accounts
  - View account balances
  - Retrieve user accounts with pagination

- **Transaction Processing**
  - Create and track transactions
  - System-level initial funds transactions
  - Transaction history and records
  - Support for multiple transaction types

- **Security**
  - Password hashing and encryption
  - JWT token-based authentication
  - Protected API endpoints
  - Middleware-based authorization
  - Cookie-based session management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB (Mongoose v9.6.3)
- **Authentication**: JWT (jsonwebtoken v9.0.3)
- **Password Encryption**: bcryptjs v3.0.3
- **Email Service**: Nodemailer v8.0.10
- **Environment Management**: dotenv v17.4.2
- **Cookie Handling**: cookie-parser v1.4.7
- **Development Tool**: Nodemon (for hot-reload)

## 📦 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance (local or cloud)
- Environment variables configured

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/govindsharma010/BANK-TRANSACTION-SYSTEM.git
   cd BANK-TRANSACTION-SYSTEM
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file in src/ directory
   cp .env.example src/.env
   ```

## ⚙️ Configuration

Create a `.env` file in the `src/` directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/bank-transaction-system
DB_NAME=bank-transaction-system

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# API Configuration
API_URL=http://localhost:3000
```

## ▶️ Running the Application

### Development Mode (with hot-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000/`

## 📁 Project Structure

```
BANK-TRANSACTION-SYSTEM/
├── src/
│   ├── config/              # Database configuration
│   │   └── db.js
│   ├── controllers/         # Business logic controllers
│   │   ├── auth.controller.js
│   │   ├── account.controller.js
│   │   └── transaction.controller.js
│   ├── middleware/          # Express middleware
│   │   └── auth.middleware.js
│   ├── models/              # MongoDB models
│   │   ├── User.js
│   │   ├── Account.js
│   │   └── Transaction.js
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   ├── account.routes.js
│   │   └── transaction.routes.js
│   ├── services/            # Business services
│   ├── .env                 # Environment variables
│   └── app.js               # Express app setup
├── server.js                # Server entry point
├── package.json             # Dependencies
└── README.md                # Documentation
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
- **Endpoint**: `POST /api/auth/register`
- **Description**: Create a new user account
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Response**: User object with JWT token

#### Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticate user and receive JWT token
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Response**: JWT token and user information

#### Logout
- **Endpoint**: `POST /api/auth/logout`
- **Description**: Logout user and invalidate session
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message

### Account Endpoints

#### Create Account
- **Endpoint**: `POST /api/accounts/`
- **Description**: Create a new bank account
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "accountType": "savings",
    "currency": "USD",
    "initialBalance": 1000
  }
  ```
- **Response**: Account object with account details

#### Get All User Accounts
- **Endpoint**: `GET /api/accounts/`
- **Description**: Retrieve all accounts of the logged-in user
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of user accounts

#### Get Account Balance
- **Endpoint**: `GET /api/accounts/balance/:accountId`
- **Description**: Get the current balance of a specific account
- **Headers**: `Authorization: Bearer <token>`
- **Parameters**: `accountId` (Account ID)
- **Response**:
  ```json
  {
    "accountId": "string",
    "balance": 5000,
    "currency": "USD",
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
  ```

### Transaction Endpoints

#### Create Transaction
- **Endpoint**: `POST /api/transactions/`
- **Description**: Create a new transaction
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "fromAccountId": "account_id",
    "toAccountId": "account_id",
    "amount": 500,
    "description": "Payment for services",
    "transactionType": "transfer"
  }
  ```
- **Response**: Transaction object with confirmation details

#### Create Initial Funds
- **Endpoint**: `POST /api/transactions/system/initial-funds`
- **Description**: System endpoint to initialize account with funds
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "accountId": "account_id",
    "amount": 10000,
    "description": "Initial funding"
  }
  ```
- **Response**: Transaction confirmation

## 🗄️ Database Models

### User Model
- Email (unique)
- Password (hashed)
- First Name
- Last Name
- Created At
- Updated At

### Account Model
- User ID (reference)
- Account Type
- Balance
- Currency
- Account Status
- Created At
- Updated At

### Transaction Model
- From Account ID
- To Account ID
- Amount
- Transaction Type
- Description
- Status
- Created At
- Updated At

## 🔒 Security

- **Password Security**: All passwords are hashed using bcryptjs with salt rounds
- **JWT Authentication**: Stateless token-based authentication
- **Protected Routes**: Middleware-based authorization checks
- **Environment Variables**: Sensitive data stored in `.env` file
- **Cookie Security**: Secure cookie parsing with cookie-parser

## 📝 Available Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👤 Author

**Govind Sharma**
- GitHub: [@govindsharma010](https://github.com/govindsharma010)

## 📞 Support

For support, please open an issue on the [GitHub repository](https://github.com/govindsharma010/BANK-TRANSACTION-SYSTEM/issues).

---

**Last Updated**: June 14, 2026
