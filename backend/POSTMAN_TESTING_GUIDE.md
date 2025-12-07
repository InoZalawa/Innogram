# Postman Testing Guide - Auth Microservice

## Base URL
```
http://localhost:3001
```

## Authentication Flow

1. **Register** → Get user account
2. **Login** → Get access token + refresh token
3. **Use Protected Endpoints** → Use access token in Authorization header
4. **Refresh Token** → Get new access token when it expires
5. **Logout** → Invalidate tokens

---

## 1. Health Check

**GET** `/`

**Headers:** None

**Expected Response:**
```json
{
  "success": true,
  "message": "Auth microservice is running",
  "timestamp": "2025-12-06T20:00:00.000Z"
}
```

---

## 2. Register User

**POST** `/internal/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test1234",
  "repeatPassword": "Test1234"
}
```

**Validation Rules:**
- Username: 3-30 characters, alphanumeric + underscores only
- Email: Valid email format
- Password: Min 8 chars, must have uppercase, lowercase, and number
- repeatPassword: Must match password

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

**Error Examples:**
- **400** - Validation failed (passwords don't match, weak password, etc.)
- **409** - User already exists
- **429** - Too many requests (rate limited)

---

## 3. List Users (Testing Only)

**GET** `/internal/auth/users`

**Headers:** None

**Purpose:** Open endpoint to quickly check current user count and list. Use only for local testing and remove/lock down before production.

**Success Response (200):**
```json
{
  "success": true,
  "message": "User list for verification",
  "count": 1,
  "users": [
    {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com"
    }
  ]
}
```

---

## 4. Login

**POST** `/internal/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "login": "testuser",
  "password": "Test1234"
}
```

**Note:** `login` can be either username OR email

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Examples:**
- **401** - Invalid credentials
- **429** - Too many requests (rate limited)

**Save the tokens!** You'll need them for protected endpoints.

---

## 5. Get Current User Info (Protected)

**GET** `/internal/auth/me`

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Example:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "email": "test@example.com"
  }
}
```

**Error Examples:**
- **401** - No token provided
- **403** - Invalid or expired token

---

## 6. Refresh Access Token

**POST** `/internal/auth/refresh`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Examples:**
- **400** - Refresh token not provided
- **401** - Invalid or expired refresh token

**Note:** Access tokens expire in 3 minutes, refresh tokens in 10 minutes (configurable via env vars)

---

## 7. Logout

**POST** `/internal/auth/logout`

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Error Examples:**
- **400** - Refresh token not provided
- **401** - Invalid access token
- **403** - Invalid or expired token

**Note:** After logout, both tokens are invalidated. You'll need to login again.

---

## Testing Scenarios

### Scenario 1: Complete Flow
1. ✅ Register a new user
2. ✅ Login with credentials
3. ✅ Get user info with access token
4. ✅ Wait 3+ minutes (or use refresh)
5. ✅ Refresh access token
6. ✅ Get user info with new token
7. ✅ Logout
8. ❌ Try to get user info (should fail - token revoked)

### Scenario 2: Error Cases
1. ❌ Register with weak password
2. ❌ Register with mismatched passwords
3. ❌ Register with existing email/username
4. ❌ Login with wrong password
5. ❌ Access protected endpoint without token
6. ❌ Access protected endpoint with expired token
7. ❌ Refresh with invalid token

### Scenario 3: Rate Limiting
1. Try to login 6+ times in 15 minutes
2. Should get 429 error on 6th attempt

---

## Postman Collection Setup

### Environment Variables (Optional but Recommended)

Create a Postman Environment with:
- `base_url`: `http://localhost:3001`
- `access_token`: (will be set automatically)
- `refresh_token`: (will be set automatically)

### Pre-request Scripts

For login endpoint, add this to automatically save tokens:

```javascript
// In Tests tab of Login request
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("access_token", jsonData.accessToken);
    pm.environment.set("refresh_token", jsonData.refreshToken);
}
```

### Authorization Setup

For protected endpoints, use:
- Type: Bearer Token
- Token: `{{access_token}}`

Or manually:
- Key: `Authorization`
- Value: `Bearer {{access_token}}`

---

## Quick Test Commands (cURL)

### Register
```bash
curl -X POST http://localhost:3001/internal/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test1234","repeatPassword":"Test1234"}'
```

### Login
```bash
curl -X POST http://localhost:3001/internal/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"testuser","password":"Test1234"}'
```

### Get User Info
```bash
curl -X GET http://localhost:3001/internal/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh Token
```bash
curl -X POST http://localhost:3001/internal/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

### List Users (Testing Only)
```bash
curl -X GET http://localhost:3001/internal/auth/users
```

### Logout
```bash
curl -X POST http://localhost:3001/internal/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

---

## Token Expiration Times

- **Access Token**: 3 minutes (180 seconds)
- **Refresh Token**: 10 minutes (600 seconds)

These can be configured via environment variables:
- `ACCESS_TOKEN_EXPIRY` (in seconds)
- `REFRESH_TOKEN_EXPIRY` (in seconds)

---

## Common Issues

1. **401 Unauthorized**: Token expired or invalid
   - Solution: Use refresh token endpoint to get new access token

2. **403 Forbidden**: Token blacklisted (after logout)
   - Solution: Login again to get new tokens

3. **429 Too Many Requests**: Rate limit exceeded
   - Solution: Wait 15 minutes or adjust rate limit settings

4. **400 Bad Request**: Validation failed
   - Check: Password strength, email format, username rules

5. **500 Internal Server Error**: Server issue
   - Check: Database connection, Redis connection, server logs
