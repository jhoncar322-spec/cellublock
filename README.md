# CelluBlock - Mobile Device Enrollment and Blocking Platform

A comprehensive MERN stack platform for enrolling and managing mobile devices using QR codes with an admin panel and blocking system via API.

## 🚀 Features

- **Device Enrollment**: Generate QR codes for quick device enrollment
- **Device Management**: View, block, unblock, and delete devices
- **Admin Dashboard**: Real-time statistics and recent activity monitoring
- **Audit Logs**: Complete activity tracking and audit trail
- **JWT Authentication**: Secure admin authentication system
- **RESTful API**: Complete API for device management and status checking

## 🛠️ Technology Stack

### Backend
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT for authentication
- QRCode library for QR generation
- bcryptjs for password hashing

### Frontend
- React + TypeScript + Vite
- Material-UI for UI components
- React Router for navigation
- Axios for API calls
- Recharts for data visualization

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/jhoncar322-spec/cellublock.git
cd cellublock
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cellublock
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Database Setup

Make sure MongoDB is running on your system. Then seed the initial admin:

```bash
cd backend
npm run seed:admin
```

Default admin credentials:
- Email: `admin@cellublock.com`
- Password: `admin123`

⚠️ **Important**: Change the password after first login!

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📁 Project Structure

```
cellublock/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth & error handling
│   │   ├── utils/           # Utilities (QR, tokens)
│   │   └── server.ts        # Express server
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service
│   │   ├── contexts/        # React contexts
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### Device Management
- `POST /api/devices/generate-qr` - Generate enrollment QR code
- `POST /api/devices/enroll` - Enroll a new device
- `GET /api/devices` - Get all devices (with filters)
- `GET /api/devices/:deviceId` - Get device details
- `POST /api/devices/:deviceId/block` - Block a device
- `POST /api/devices/:deviceId/unblock` - Unblock a device
- `GET /api/devices/:deviceId/status` - Check device status (with API key)
- `DELETE /api/devices/:deviceId` - Delete a device

### Admin & Logs
- `GET /api/admin/statistics` - Get dashboard statistics
- `GET /api/admin/logs` - Get audit logs

## 📱 Device Enrollment Flow

1. Admin generates a QR code from the "Enroll Device" page
2. Device scans the QR code
3. Device sends enrollment request with device info to `/api/devices/enroll`
4. System validates the token and creates the device record
5. Device receives a unique API key for status checks
6. Device can periodically check its status via `/api/devices/:deviceId/status`

## 🔐 Security Features

- JWT-based authentication
- bcrypt password hashing (10 salt rounds)
- One-time use enrollment tokens
- QR code expiration
- API key validation for device status checks
- CORS protection
- Environment variable configuration

## 📊 Dashboard Features

- Total devices count
- Active devices count
- Blocked devices count
- Recent activity log
- Device search and filtering
- Block/unblock capabilities
- Device deletion

## 🧪 Testing

To test the API endpoints, you can use tools like:
- Postman
- cURL
- Thunder Client (VS Code extension)

Example login request:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cellublock.com","password":"admin123"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Initial work - [jhoncar322-spec](https://github.com/jhoncar322-spec)

## 🙏 Acknowledgments

- Express.js framework
- React and Material-UI
- MongoDB and Mongoose
- QRCode library
- The open-source community
