# 🏠 Active Rooms Detection System

A real-time room occupancy detection system with an advanced management interface.

## 📁 Project Structure

```
active-rooms/
├── client/          # React frontend application
│   ├── src/         # Source code
│   ├── public/      # Static files
│   └── package.json # Client dependencies
├── server/          # Node.js/Express backend
│   ├── server.js    # Main server file
│   ├── db.js        # Database connection
│   ├── .env         # Environment variables
│   └── package.json # Server dependencies
└── README.md        # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### 2. Database Setup

1. Create MySQL database: `active_rooms`
2. Import schema from `server/*.sql` files
3. Update `server/.env` with your database credentials

### 3. Run the Application

**Start Server (Terminal 1):**
```bash
cd server
npm run dev  # Development mode with nodemon
```

**Start Client (Terminal 2):**
```bash
cd client  
npm start    # React development server
```

## 🌐 Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **Health Check:** http://localhost:3001/api/health

## 👥 Demo Accounts

- **Admin:** `admin` / `admin123`
- **User:** `user` / `user123`

## 🔧 Features

- 📊 Real-time sensor monitoring
- 🗺️ Interactive campus map
- 👑 Admin panel for sensor management
- 📱 Responsive design
- 🔒 User authentication
- 📡 RESTful API

## 💻 Technology Stack

**Frontend:**
- React 19.1.1
- Modern hooks & functional components
- CSS3 styling

**Backend:**
- Node.js with Express
- MySQL database
- JWT-free session management
- CORS enabled

## 🏗️ Recent Updates

- ✅ Complete component modularization
- ✅ Clean project structure
- ✅ Separated client/server folders
- ✅ Comprehensive validation
- ✅ Modern React patterns
