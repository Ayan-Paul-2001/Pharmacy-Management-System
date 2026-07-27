# Mediflow API

NestJS + MongoDB backend for the pharmacy management platform.

## Run locally

1. Copy `.env.example` to `.env` and set `MONGODB_URI` and `JWT_SECRET`.
2. Start MongoDB.
3. Install and run:

```bash
npm install
npm run start:dev
```

The API runs at `http://localhost:4000/api`.

## Modules

- `auth` — Firebase Admin verification, FingerprintJS event verification, WebAuthn passkeys, and JWT sessions
- `users` — role-aware user records
- `medicines` — catalog, pricing, prescription flags, expiry
- `inventory` — stock movement history
- `sales` — POS invoices and payments
- `orders` — online order lifecycle
- `prescriptions` — upload/review workflow
- `customers` — profiles and loyalty data
- `suppliers` — supplier directory and balances
- `audit` — owner-only activity trail

All protected endpoints expect `Authorization: Bearer <token>`. Roles are `owner`, `employee`, and `customer`.

Authentication endpoints:

- `POST /api/auth/firebase/exchange` — exchange a verified Firebase ID token for a Mediflow JWT
- `POST /api/auth/fingerprint/verify` — verify a FingerprintJS Server API event
- `GET /api/auth/webauthn/register/options` — create passkey registration options
- `POST /api/auth/webauthn/register/verify` — store a verified passkey
- `POST /api/auth/webauthn/login/options` — create passkey login options
- `POST /api/auth/webauthn/login/verify` — verify a passkey and issue a Mediflow JWT
