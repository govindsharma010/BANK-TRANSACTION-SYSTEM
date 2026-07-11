# Backend Fixes Summary

Short summary of critical and high-severity fixes applied to prepare the API for React frontend integration.

## Critical Fixes

| Fix | File | Description |
|-----|------|-------------|
| Login cookie typo | `src/controllers/auth.controller.js` | Changed `toke` → `token` so httpOnly cookie auth works on login |
| Logout clearCookie | `src/controllers/auth.controller.js` | Fixed `clearCookie("token", opts)` signature (removed invalid token arg) |

## High-Severity Fixes

| Fix | File | Description |
|-----|------|-------------|
| Register cookie maxAge | `src/controllers/auth.controller.js` | Added 3-day `maxAge` to match login cookie |
| asyncHandler on login/logout | `src/routes/auth.routes.js` | Prevents unhandled promise rejections |
| asyncHandler on balance route | `src/routes/account.routes.js` | Prevents unhandled promise rejections |
| Transfer session abort | `src/controllers/transaction.controller.js` | `abortTransaction()` + `endSession()` in catch block |
| Stale transaction status | `src/controllers/transaction.controller.js` | Returns `COMPLETED` transaction via `findOneAndUpdate` with `new: true` |
| Initial funds ReferenceError | `src/controllers/transaction.controller.js` | Removed undefined `fromAccount` validation; validate `toAccount` only |
| CORS dev defaults | `src/app.js` | Defaults to `localhost:5173` and `127.0.0.1:5173` when `FRONTEND_URLS` is unset |

## New Read-Only Endpoints (Frontend-Blocking)

| Endpoint | File | Description |
|----------|------|-------------|
| `GET /api/auth/me` | `src/controllers/auth.controller.js`, `src/routes/auth.routes.js` | Returns authenticated user profile for session restore |
| `GET /api/transactions` | `src/controllers/transaction.controller.js`, `src/routes/transaction.routes.js` | Returns transactions involving user's accounts, sorted by date desc |

## Preserved (Unchanged)

- Ledger balance calculation (`account.getBalance()` aggregation)
- 10-step transfer flow (validate → idempotency → status → balance → session transaction → debit/credit → complete)
- Transaction idempotency logic
- JWT auth middleware and blacklist on logout
- System user initial-funds route (logic preserved, validation fixed)

## Env Template

Added `src/.env.example` with required and recommended variables for local development.
