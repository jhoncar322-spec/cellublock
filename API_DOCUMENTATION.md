# CelluBlock API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All endpoints that require authentication must include a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new admin account.

**Request Body:**
```json
{
  "email": "admin@cellublock.com",
  "password": "securePassword123",
  "name": "Admin Name",
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin registered successfully",
  "token": "jwt_token_here",
  "admin": {
    "id": "admin_id",
    "email": "admin@cellublock.com",
    "name": "Admin Name",
    "role": "admin"
  }
}
```

#### POST /auth/login
Login as an admin.

**Request Body:**
```json
{
  "email": "admin@cellublock.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "admin": {
    "id": "admin_id",
    "email": "admin@cellublock.com",
    "name": "Admin Name",
    "role": "admin"
  }
}
```

#### GET /auth/verify
Verify the current JWT token.

**Headers:**
- Authorization: Bearer <token>

**Response:**
```json
{
  "success": true,
  "admin": {
    "id": "admin_id",
    "email": "admin@cellublock.com",
    "name": "Admin Name",
    "role": "admin"
  }
}
```

### Device Enrollment

#### POST /devices/generate-qr
Generate a QR code for device enrollment.

**Headers:**
- Authorization: Bearer <token>

**Request Body:**
```json
{
  "expiresIn": "24h"
}
```

**Response:**
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,...",
  "enrollmentToken": "et_1234567890_abcdef123456",
  "expiresAt": "2026-02-14T10:00:00Z"
}
```

#### POST /devices/enroll
Enroll a new device using an enrollment token.

**Request Body:**
```json
{
  "enrollmentToken": "et_1234567890_abcdef123456",
  "deviceInfo": {
    "model": "iPhone 14 Pro",
    "brand": "Apple",
    "os": "iOS",
    "osVersion": "17.2",
    "imei": "123456789012345",
    "serialNumber": "SERIALXYZ123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "deviceId": "dev_1234567890_abc12345",
  "apiKey": "dk_1234567890_xyz98765",
  "message": "Device enrolled successfully"
}
```

### Device Management

#### GET /devices
Get all devices with optional filtering.

**Headers:**
- Authorization: Bearer <token>

**Query Parameters:**
- status: Filter by status (active/blocked)
- search: Search by device ID, brand, or model
- page: Page number (default: 1)
- limit: Results per page (default: 10)

**Response:**
```json
{
  "success": true,
  "devices": [
    {
      "id": "dev_1234567890_abc12345",
      "model": "iPhone 14 Pro",
      "brand": "Apple",
      "os": "iOS",
      "status": "active",
      "enrolledAt": "2026-02-13T10:00:00Z",
      "lastActivity": "2026-02-13T15:30:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10
  }
}
```

#### GET /devices/:deviceId
Get details of a specific device.

**Headers:**
- Authorization: Bearer <token>

**Response:**
```json
{
  "success": true,
  "device": {
    "id": "dev_1234567890_abc12345",
    "model": "iPhone 14 Pro",
    "brand": "Apple",
    "os": "iOS",
    "osVersion": "17.2",
    "status": "active",
    "enrolledAt": "2026-02-13T10:00:00Z",
    "lastActivity": "2026-02-13T15:30:00Z",
    "imei": "123456789012345",
    "serialNumber": "SERIALXYZ123",
    "blockHistory": []
  }
}
```

#### POST /devices/:deviceId/block
Block a device.

**Headers:**
- Authorization: Bearer <token>

**Request Body:**
```json
{
  "reason": "Device reported stolen"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device blocked successfully",
  "device": {
    "id": "dev_1234567890_abc12345",
    "status": "blocked",
    "blockedAt": "2026-02-13T16:00:00Z"
  }
}
```

#### POST /devices/:deviceId/unblock
Unblock a device.

**Headers:**
- Authorization: Bearer <token>

**Request Body:**
```json
{
  "reason": "Device recovered"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device unblocked successfully",
  "device": {
    "id": "dev_1234567890_abc12345",
    "status": "active",
    "unblockedAt": "2026-02-13T16:05:00Z"
  }
}
```

#### GET /devices/:deviceId/status
Check device status (requires device API key).

**Headers:**
- X-Device-API-Key: <device_api_key>

**Response:**
```json
{
  "success": true,
  "status": "blocked",
  "message": "Device is currently blocked",
  "blockedAt": "2026-02-13T16:00:00Z",
  "reason": "Device reported stolen"
}
```

#### DELETE /devices/:deviceId
Delete a device from the system.

**Headers:**
- Authorization: Bearer <token>

**Response:**
```json
{
  "success": true,
  "message": "Device deleted successfully"
}
```

### Admin & Statistics

#### GET /admin/statistics
Get dashboard statistics.

**Headers:**
- Authorization: Bearer <token>

**Response:**
```json
{
  "success": true,
  "statistics": {
    "totalDevices": 100,
    "activeDevices": 85,
    "blockedDevices": 15,
    "recentActivity": [
      {
        "action": "device_blocked",
        "timestamp": "2026-02-13T16:00:00Z",
        "adminEmail": "admin@cellublock.com",
        "deviceId": "dev_1234567890_abc12345"
      }
    ]
  }
}
```

#### GET /admin/logs
Get audit logs.

**Headers:**
- Authorization: Bearer <token>

**Query Parameters:**
- deviceId: Filter by device ID
- action: Filter by action type
- page: Page number (default: 1)
- limit: Results per page (default: 20)

**Response:**
```json
{
  "success": true,
  "logs": [
    {
      "id": "log_id",
      "action": "device_blocked",
      "deviceId": "dev_1234567890_abc12345",
      "adminId": "admin_id",
      "adminEmail": "admin@cellublock.com",
      "timestamp": "2026-02-13T16:00:00Z",
      "details": {
        "reason": "Device reported stolen"
      }
    }
  ],
  "pagination": {
    "total": 500,
    "page": 1,
    "pages": 25
  }
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

Currently, there is no rate limiting implemented. This should be added in production.

## CORS

The API accepts requests from the configured CORS_ORIGIN (default: http://localhost:5173).

## Security Notes

1. Always use HTTPS in production
2. Store JWT_SECRET securely
3. Implement rate limiting for production
4. Use strong passwords for admin accounts
5. Rotate API keys periodically
6. Monitor audit logs regularly
