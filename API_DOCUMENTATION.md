# Bank Transaction System - API Documentation

## Overview

This document provides comprehensive API documentation for the Bank Transaction System. The API is built with Express.js and provides RESTful endpoints for user authentication, account management, and transaction processing.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Authentication Endpoints](#authentication-endpoints)
5. [Account Endpoints](#account-endpoints)
6. [Transaction Endpoints](#transaction-endpoints)
7. [Status Codes](#status-codes)
8. [Examples](#examples)

---

## Getting Started

### Base URL

```
http://localhost:3000/api
```

### Content Type

All requests and responses use JSON format. Include the following header in all requests:

```
Content-Type: application/json
```

### Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication

### JWT Token

The API uses JSON Web Tokens (JWT) for authentication. Upon successful login or registration, you'll receive a JWT token that must be included in subsequent requests to protected endpoints.

**Token Format**: `Bearer <token>`

**Token Expiry**: 7 days (configurable in `.env`)

### Token Storage

Store the JWT token in:
- Local Storage (for web applications)
- Session Storage (for web applications)
- Secure cookies (recommended)
- Memory (for mobile applications)

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Error details"
}
```

### Common Errors

| Error | Status Code | Description |
|-------|-------------|-------------|
| Validation Error | 400 | Missing or invalid request data |
| Unauthorized | 401 | Missing or invalid JWT token |
| Forbidden | 403 | User doesn't have permission |
| Not Found | 404 | Resource not found |
| Server Error | 500 | Internal server error |

---

## Authentication Endpoints

### 1. Register User

Register a new user account in the system.

**Endpoint**: `POST /auth/register`

**Method**: POST

**Authentication**: Not required

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | User's email address (must be unique) |
| password | string | Yes | Password (minimum 8 characters recommended) |
| firstName | string | Yes | User's first name |
| lastName | string | Yes | User's last name |

**Success Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "user_id_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Email already registered",
  "error": "Email must be unique"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

---

### 2. Login

Authenticate user and receive JWT token.

**Endpoint**: `POST /auth/login`

**Method**: POST

**Authentication**: Not required

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | Registered email address |
| password | string | Yes | Account password |

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "user_id_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Invalid email or password",
  "error": "Authentication failed"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

---

### 3. Logout

Logout the current user and invalidate the session.

**Endpoint**: `POST /auth/logout`

**Method**: POST

**Authentication**: Required (JWT token)

**Request Headers**:
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Unauthorized - Invalid or missing token",
  "error": "Authentication failed"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json"
```

---

## Account Endpoints

### 1. Create Account

Create a new bank account for the authenticated user.

**Endpoint**: `POST /accounts/`

**Method**: POST

**Authentication**: Required (JWT token)

**Request Headers**:
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "accountType": "savings",
  "currency": "USD",
  "initialBalance": 1000
}
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| accountType | string | Yes | Type of account (savings, checking, investment) |
| currency | string | Yes | Currency code (USD, EUR, GBP, etc.) |
| initialBalance | number | No | Initial balance (default: 0) |

**Success Response** (201):
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "accountId": "account_id_456",
    "userId": "user_id_123",
    "accountType": "savings",
    "balance": 1000,
    "currency": "USD",
    "accountStatus": "active",
    "createdAt": "2024-01-15T10:35:00Z"
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Invalid account type",
  "error": "Account type must be one of: savings, checking, investment"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/accounts/ \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "accountType": "savings",
    "currency": "USD",
    "initialBalance": 5000
  }'
```

---

### 2. Get All User Accounts

Retrieve all accounts belonging to the authenticated user.

**Endpoint**: `GET /accounts/`

**Method**: GET

**Authentication**: Required (JWT token)

**Request Headers**:
```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Records per page (default: 10) |

**Success Response** (200):
```json
{
  "success": true,
  "message": "Accounts retrieved successfully",
  "data": [
    {
      "accountId": "account_id_456",
      "userId": "user_id_123",
      "accountType": "savings",
      "balance": 5000,
      "currency": "USD",
      "accountStatus": "active",
      "createdAt": "2024-01-15T10:35:00Z"
    },
    {
      "accountId": "account_id_789",
      "userId": "user_id_123",
      "accountType": "checking",
      "balance": 2500,
      "currency": "USD",
      "accountStatus": "active",
      "createdAt": "2024-01-16T10:35:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Unauthorized - Invalid or missing token",
  "error": "Authentication failed"
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:3000/api/accounts/ \
  -H "Authorization: Bearer your_jwt_token"
```

---

### 3. Get Account Balance

Retrieve the current balance of a specific account.

**Endpoint**: `GET /accounts/balance/:accountId`

**Method**: GET

**Authentication**: Required (JWT token)

**Request Headers**:
```
Authorization: Bearer <your_jwt_token>
```

**URL Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| accountId | string | Yes | The account ID to retrieve balance for |

**Success Response** (200):
```json
{
  "success": true,
  "message": "Account balance retrieved successfully",
  "data": {
    "accountId": "account_id_456",
    "accountType": "savings",
    "balance": 5000,
    "currency": "USD",
    "lastUpdated": "2024-01-15T14:50:00Z"
  }
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Account not found",
  "error": "The specified account ID does not exist"
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:3000/api/accounts/balance/account_id_456 \
  -H "Authorization: Bearer your_jwt_token"
```

---

## Transaction Endpoints

### 1. Create Transaction

Create a new transaction between accounts or to external entities.

**Endpoint**: `POST /transactions/`

**Method**: POST

**Authentication**: Required (JWT token)

**Request Headers**:
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "fromAccountId": "account_id_456",
  "toAccountId": "account_id_789",
  "amount": 500,
  "description": "Payment for services",
  "transactionType": "transfer"
}
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| fromAccountId | string | Yes | Source account ID |
| toAccountId | string | Yes | Destination account ID |
| amount | number | Yes | Transaction amount (must be positive) |
| description | string | No | Transaction description |
| transactionType | string | Yes | Type: transfer, payment, deposit, withdrawal |

**Success Response** (201):
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "transactionId": "txn_id_999",
    "fromAccountId": "account_id_456",
    "toAccountId": "account_id_789",
    "amount": 500,
    "currency": "USD",
    "transactionType": "transfer",
    "description": "Payment for services",
    "status": "completed",
    "timestamp": "2024-01-15T15:00:00Z",
    "referenceNumber": "TXN-20240115-001"
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Insufficient balance",
  "error": "Account does not have sufficient funds for this transaction"
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Account not found",
  "error": "One or both accounts do not exist"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/transactions/ \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "fromAccountId": "account_id_456",
    "toAccountId": "account_id_789",
    "amount": 500,
    "description": "Payment for services",
    "transactionType": "transfer"
  }'
```

---

### 2. Create Initial Funds Transaction

System endpoint to initialize an account with funds (admin/system only).

**Endpoint**: `POST /transactions/system/initial-funds`

**Method**: POST

**Authentication**: Required (System user JWT token)

**Request Headers**:
```
Authorization: Bearer <system_jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "accountId": "account_id_456",
  "amount": 10000,
  "description": "Initial funding - system"
}
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| accountId | string | Yes | Account ID to fund |
| amount | number | Yes | Amount to deposit |
| description | string | No | Transaction description |

**Success Response** (201):
```json
{
  "success": true,
  "message": "Initial funds transaction created successfully",
  "data": {
    "transactionId": "txn_id_system_001",
    "accountId": "account_id_456",
    "amount": 10000,
    "currency": "USD",
    "transactionType": "initial-funds",
    "description": "Initial funding - system",
    "status": "completed",
    "timestamp": "2024-01-15T09:00:00Z",
    "referenceNumber": "SYS-INIT-20240115-001"
  }
}
```

**Error Response** (403):
```json
{
  "success": false,
  "message": "Forbidden - Only system users can perform this action",
  "error": "Permission denied"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/transactions/system/initial-funds \
  -H "Authorization: Bearer system_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "account_id_456",
    "amount": 50000,
    "description": "Initial funding"
  }'
```

---

## Status Codes

### Success Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource successfully created |
| 202 | Accepted - Request accepted for processing |

### Client Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |

### Server Error Codes

| Code | Description |
|------|-------------|
| 500 | Internal Server Error - Server error |
| 502 | Bad Gateway - Gateway error |
| 503 | Service Unavailable - Service temporarily unavailable |

---

## Examples

### Complete User Flow

#### Step 1: Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123",
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

Response includes JWT token.

#### Step 2: Create an Account

```bash
curl -X POST http://localhost:3000/api/accounts/ \
  -H "Authorization: Bearer <token_from_step1>" \
  -H "Content-Type: application/json" \
  -d '{
    "accountType": "savings",
    "currency": "USD",
    "initialBalance": 5000
  }'
```

#### Step 3: Check Account Balance

```bash
curl -X GET http://localhost:3000/api/accounts/balance/account_id_from_step2 \
  -H "Authorization: Bearer <token_from_step1>"
```

#### Step 4: Create a Transaction

```bash
curl -X POST http://localhost:3000/api/transactions/ \
  -H "Authorization: Bearer <token_from_step1>" \
  -H "Content-Type: application/json" \
  -d '{
    "fromAccountId": "account_id_from_step2",
    "toAccountId": "destination_account_id",
    "amount": 1000,
    "description": "Monthly savings",
    "transactionType": "transfer"
  }'
```

#### Step 5: Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <token_from_step1>"
```

---

## Rate Limiting

Currently, no rate limiting is implemented. This is recommended for production environments.

## Versioning

Current API Version: `v1` (Base URL: `/api/v1`)

## Support

For issues or questions regarding the API, please create an issue on the [GitHub repository](https://github.com/govindsharma010/BANK-TRANSACTION-SYSTEM/issues).

---

**Last Updated**: June 14, 2026
**API Version**: 1.0.0
