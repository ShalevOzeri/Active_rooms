# Active Rooms Detection System - Server

## 📁 Server Structure

```
server/
├── server.js              # Main Express server
├── db.js                   # Database connection
├── check-final-setup.js    # Database setup verification
├── .env                    # Environment variables
├── package.json            # Server dependencies
├── package-lock.json       # Locked versions
└── *.sql                   # Database schema files
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure database:**
   - Update `.env` file with your database credentials
   - Import database schema from SQL files

3. **Run server:**
   ```bash
   # Development mode
   npm run dev

   # Production mode  
   npm start

   # Test database setup
   npm test
   ```

## 🔧 Environment Variables (.env)

```properties
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=active_rooms
DB_PORT=3306
PORT=3001
```

## 📡 API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - User authentication
- `GET /api/rooms` - Get all rooms
- `GET /api/sensors` - Get all sensors (authenticated)
- `POST /api/sensors` - Add sensor (admin only)
- `PUT /api/sensors/:id` - Update sensor (admin only)
- `DELETE /api/sensors/:id` - Delete sensor (admin only)
- `GET /api/areas` - Get all areas

## 🗄️ Database

MySQL database with tables:
- `users` - User accounts
- `rooms` - Room information  
- `sensors` - Sensor data
- `areas` - Area definitions
