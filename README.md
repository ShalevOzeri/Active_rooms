# 🏠 Active Rooms Detection System

A real-time room occupancy detection system with advanced management interface and modular architecture.

## 📁 Project Structure

```
active-rooms/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── components/        # Modular React components
│   │   │   ├── Auth/          # Login & authentication
│   │   │   ├── AreaOverview/  # Areas overview display
│   │   │   ├── Common/        # Shared UI components
│   │   │   ├── Layout/        # Header & layout components
│   │   │   ├── Map/           # Interactive map components
│   │   │   ├── Modals/        # Add/Edit sensor modals
│   │   │   ├── Rooms/         # Rooms management
│   │   │   ├── Sensors/       # Sensors display & management
│   │   │   └── Stats/         # Statistics cards
│   │   ├── services/          # API service layer
│   │   │   └── apiService.js  # Centralized API calls
│   │   ├── App.js             # Main application component
│   │   ├── App.css            # Global styles
│   │   └── index.css          # Base styles
│   ├── public/
│   │   ├── hit-campus-map.jpg # Campus map image
│   │   └── index.html         # Main HTML template
│   └── package.json           # Client dependencies
├── server/                    # Node.js/Express backend
│   ├── server.js              # Main server file
│   ├── db.js                  # Database connection
│   ├── check-final-setup.js   # Database validation tool
│   ├── .env                   # Environment variables
│   ├── *.sql                  # Database schema files
│   └── package.json           # Server dependencies
├── .gitignore                 # Git ignore rules
└── README.md                  # This documentation
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

### 2. Database Setup & Verification

1. **Create MySQL database:** `active_rooms`
2. **Import schema:** Run all `server/*.sql` files
3. **Update credentials:** Edit `server/.env` with your database details
4. **Verify setup:** 
   ```bash
   cd server
   npm test  # Runs database validation
   ```

### 3. Run the Application

**Start Server (Terminal 1):**
```bash
cd server
npm start    # Production mode
# or
npm run dev  # Development with nodemon
```

**Start Client (Terminal 2):**
```bash
cd client  
npm start    # React development server
```

## 🌐 Access Points

- **Frontend Application:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **Health Check:** http://localhost:3001/api/health
- **Database Validation:** `cd server && npm test`

## 👥 Demo Accounts

- **Administrator:** `admin` / `admin123`
  - Full CRUD operations on sensors
  - Access to all management features
- **Regular User:** `user` / `user123`
  - View-only access to sensor data
  - Real-time monitoring capabilities

## 🔧 Features

### 📊 **Monitoring & Analytics**
- Real-time sensor status monitoring (Available/Occupied/Error)
- Interactive statistics dashboard with color-coded cards
- Areas overview with comprehensive room grouping
- Sensors grid with instant status visualization

### 🗺️ **Interactive Campus Map**
- Campus map integration with sensor locations
- Real-time status indicators on map
- Toggleable map view with smooth transitions

### 👑 **Admin Management Panel**
- Add new sensors with position validation  
- Edit existing sensor details and locations
- Delete sensors with confirmation
- Room and area management

### 🎨 **User Experience**
- Fully responsive design (mobile/tablet/desktop)
- Clean modular component architecture  
- Enhanced CSS styling with gradients & animations
- Intuitive navigation and user feedback

### 🔒 **Security & Authentication**
- Secure user authentication system
- Role-based access control (Admin/User)
- Protected API endpoints
- Session management

## 💻 Technology Stack

**Frontend:**
- **React 18.2.0** with modern hooks & functional components
- **Modular Architecture** with specialized components
- **CSS3** with enhanced styling and animations
- **Centralized API Service** for server communication
- **Responsive Grid Layouts** with mobile-first design

**Backend:**
- **Node.js** with Express.js framework
- **MySQL** database with connection pooling
- **CORS** enabled for cross-origin requests
- **Environment-based** configuration (.env)
- **RESTful API** design with proper HTTP methods

**Development Tools:**
- **Database Validation** script for setup verification
- **Modular Project Structure** for easy maintenance
- **Git Integration** with proper .gitignore protection
- **Development Scripts** for both client and server

## 🔍 API Endpoints

### **Public Endpoints**
- `GET /api/rooms` - Fetch all rooms
- `GET /api/health` - Server health check

### **Authenticated Endpoints**  
- `GET /api/sensors` - Fetch all sensors
- `POST /api/sensors` - Add new sensor (Admin only)
- `PUT /api/sensors/:id` - Update sensor (Admin only)  
- `DELETE /api/sensors/:id` - Delete sensor (Admin only)

## 📋 Database Schema

### **Tables**
- **users** - Authentication and user roles
- **rooms** - Room information with area mapping
- **sensors** - Sensor data with room associations

### **Validation Tool**
Run `cd server && npm test` to verify:
- Database connectivity
- Table structure integrity  
- Sample data presence
- Relationship consistency

## 🎯 Future Enhancements

- [ ] WebSocket integration for real-time updates
- [ ] Advanced analytics and reporting
- [ ] Mobile app development  
- [ ] API rate limiting and caching
- [ ] Automated testing suite
- [ ] Docker containerization

---

**Built with modern web technologies
