# CelluBlock Testing Guide

This guide provides manual testing instructions for the CelluBlock platform.

## Prerequisites

1. MongoDB should be running on `mongodb://localhost:27017`
2. Backend server running on port 5000
3. Frontend server running on port 5173

## Setup

### 1. Start MongoDB

```bash
# For Linux/Mac
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Seed the First Admin

```bash
cd backend
npm run seed:admin
```

This creates an admin with:
- Email: `admin@cellublock.com`
- Password: `admin123`

### 3. Start the Backend

```bash
cd backend
npm run dev
```

The server will start on http://localhost:5000

### 4. Start the Frontend

```bash
cd frontend
npm run dev
```

The app will open at http://localhost:5173

## Manual Testing Scenarios

### Scenario 1: Admin Login

1. Open http://localhost:5173
2. You should be redirected to the login page
3. Enter credentials:
   - Email: `admin@cellublock.com`
   - Password: `admin123`
4. Click "Login"
5. ✅ You should be redirected to the dashboard

### Scenario 2: View Dashboard Statistics

1. After logging in, you should see the Dashboard
2. ✅ Check that statistics cards show:
   - Total Devices: 0
   - Active Devices: 0
   - Blocked Devices: 0
3. ✅ Recent Activity section should be empty

### Scenario 3: Generate QR Code for Enrollment

1. Click on "Enroll Device" in the sidebar
2. Select QR code expiration (1 hour or 24 hours)
3. Click "Generate QR Code"
4. ✅ A QR code should appear
5. ✅ You should see an enrollment token below the QR code
6. ✅ Click on the token to copy it
7. ✅ Click "Download QR Code" to download the image

### Scenario 4: Enroll a Device via API

Using curl or Postman:

```bash
# Replace ENROLLMENT_TOKEN with the token from step 3
curl -X POST http://localhost:5000/api/devices/enroll \
  -H "Content-Type: application/json" \
  -d '{
    "enrollmentToken": "ENROLLMENT_TOKEN",
    "deviceInfo": {
      "model": "iPhone 14 Pro",
      "brand": "Apple",
      "os": "iOS",
      "osVersion": "17.2",
      "imei": "123456789012345",
      "serialNumber": "ABC123XYZ"
    }
  }'
```

✅ Expected Response:
```json
{
  "success": true,
  "deviceId": "dev_...",
  "apiKey": "dk_...",
  "message": "Device enrolled successfully"
}
```

**Important**: Save the `deviceId` and `apiKey` for later tests!

### Scenario 5: View Enrolled Devices

1. Go to the "Devices" page
2. ✅ You should see the device you just enrolled
3. ✅ Device status should be "ACTIVE"
4. ✅ All device information should be visible

### Scenario 6: View Device Details

1. On the Devices page, click the "eye" icon (View Details)
2. ✅ A dialog should appear with complete device information
3. ✅ Check that IMEI, Serial Number, and other details are correct

### Scenario 7: Block a Device

1. On the Devices page, click the "Block" icon (red block icon)
2. Enter a reason: "Testing block functionality"
3. Click "Confirm"
4. ✅ Device status should change to "BLOCKED"
5. ✅ The block icon should change to an unblock icon (green check)

### Scenario 8: Check Device Status via API

Using the `deviceId` and `apiKey` from Scenario 4:

```bash
curl -X GET http://localhost:5000/api/devices/DEVICE_ID/status \
  -H "X-Device-API-Key: YOUR_API_KEY"
```

✅ Expected Response:
```json
{
  "success": true,
  "status": "blocked",
  "message": "Device is currently blocked",
  "blockedAt": "2026-02-13T...",
  "reason": "Testing block functionality"
}
```

### Scenario 9: Unblock a Device

1. On the Devices page, click the "Unblock" icon (green check icon)
2. Enter a reason: "Testing complete"
3. Click "Confirm"
4. ✅ Device status should change to "ACTIVE"

### Scenario 10: View Audit Logs

1. Click on "Audit Logs" in the sidebar
2. ✅ You should see all actions performed:
   - admin_login
   - qr_generated
   - device_enrolled
   - device_blocked
   - device_unblocked
3. ✅ Each log entry should show:
   - Action name
   - Admin email
   - Device ID (if applicable)
   - Timestamp
   - Details

### Scenario 11: Search and Filter Devices

1. Go to the "Devices" page
2. In the search box, type part of the device model (e.g., "iPhone")
3. ✅ Devices should filter in real-time
4. Use the Status dropdown to filter by "Active" or "Blocked"
5. ✅ Only devices with the selected status should appear

### Scenario 12: Delete a Device

1. On the Devices page, click the "Delete" icon (trash icon)
2. Confirm deletion
3. ✅ Device should be removed from the list
4. ✅ Check Audit Logs - should see "device_deleted" entry

### Scenario 13: Logout

1. Click the "Logout" button in the top-right corner
2. ✅ You should be redirected to the login page
3. ✅ Try accessing /dashboard directly - should redirect to login

## API Testing with Postman/curl

### Get JWT Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cellublock.com",
    "password": "admin123"
  }'
```

Save the token from the response.

### Get All Devices

```bash
curl -X GET "http://localhost:5000/api/devices?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Device by ID

```bash
curl -X GET http://localhost:5000/api/devices/DEVICE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Block a Device

```bash
curl -X POST http://localhost:5000/api/devices/DEVICE_ID/block \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Device reported stolen"
  }'
```

### Get Statistics

```bash
curl -X GET http://localhost:5000/api/admin/statistics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Audit Logs

```bash
curl -X GET "http://localhost:5000/api/admin/logs?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Expected Results Summary

After completing all scenarios:

- ✅ Backend server running without errors
- ✅ Frontend accessible and responsive
- ✅ Admin login/logout working
- ✅ QR code generation working
- ✅ Device enrollment via API working
- ✅ Device listing and filtering working
- ✅ Device blocking/unblocking working
- ✅ Device status checking via API working
- ✅ Audit logs recording all actions
- ✅ All CRUD operations functional

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Check if port 5000 is available
- Verify .env file exists and has correct values

### Frontend won't connect to backend
- Check CORS settings in backend
- Verify VITE_API_URL in frontend .env
- Check if backend is running

### Can't login
- Verify admin was seeded: `npm run seed:admin`
- Check MongoDB connection
- Check JWT_SECRET is set in backend .env

### QR Code not generating
- Check if admin is authenticated
- Verify enrollment token creation in database
- Check backend logs for errors

## Database Inspection

To inspect the MongoDB database:

```bash
# Connect to MongoDB
mongosh

# Switch to cellublock database
use cellublock

# View all collections
show collections

# View admins
db.admins.find().pretty()

# View devices
db.devices.find().pretty()

# View enrollment tokens
db.enrollmenttokens.find().pretty()

# View audit logs
db.auditlogs.find().sort({timestamp: -1}).limit(10).pretty()
```

## Clean Up

To reset the database:

```bash
mongosh
use cellublock
db.dropDatabase()
```

Then re-run the seed script:
```bash
cd backend
npm run seed:admin
```
