# 🏠 Active Rooms Detection System
## Project Presentation - PowerPoint Style

---

## Slide 1: Title Slide
### 🏠 Active Rooms Detection System
**Real-time Room Occupancy Detection with Advanced Management Interface**

- **Project Type:** Full-Stack Web Application
- **Technologies:** React + Node.js + MySQL
- **Purpose:** Campus room monitoring and management
- **Developer:** ShalevOzeri

---

## Slide 2: Problem Statement
### 🎯 What Problem Does It Solve?

**Current Challenges:**
- ❌ Students waste time searching for available rooms
- ❌ Building managers lack real-time occupancy data
- ❌ Inefficient room utilization across campus
- ❌ Manual room status tracking is unreliable

**Our Solution:**
- ✅ Real-time room status monitoring
- ✅ Interactive campus maps with sensor locations
- ✅ Automated sensor management system
- ✅ Role-based access control

---

## Slide 3: System Architecture
### 🏗️ Three-Tier Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PRESENTATION  │    │    BUSINESS     │    │      DATA       │
│                 │    │                 │    │                 │
│   React Client  │────│  Express API    │────│  MySQL Database │
│   - Components  │    │  - Authentication│    │  - Users        │
│   - Services    │    │  - CRUD APIs    │    │  - Sensors      │
│   - UI/UX       │    │  - Validation   │    │  - Rooms/Areas  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Communication:** RESTful APIs with JWT Authentication

---

## Slide 4: Technology Stack
### 💻 Modern Web Technologies

**Frontend (Client)**
- **React 18.2.0** - Modern UI library with hooks
- **CSS3** - Advanced styling with animations
- **Axios** - HTTP client for API communication
- **Responsive Design** - Mobile-first approach

**Backend (Server)**
- **Node.js + Express** - Fast, scalable server
- **MySQL** - Relational database with relationships
- **JWT** - Secure authentication tokens
- **Multer** - File upload handling (maps)

**Development Tools**
- **Environment Variables** - Secure configuration
- **Database Validation** - Setup verification scripts
- **Hot Reload** - Development efficiency

---

## Slide 5: Key Features Overview
### ✨ What Can Users Do?

**📊 Real-time Monitoring**
- Live sensor status (Available/Occupied/Error)
- Color-coded statistics dashboard
- Area overview with room groupings

**🗺️ Interactive Maps**
- Campus map integration
- Real-time sensor indicators
- Multiple map views (HIT Campus, Zone 2, Building 568)

**👑 Admin Management**
- Add/Edit/Delete sensors
- Position validation on maps
- Room and area management

**🔒 Security & Access**
- User authentication system
- Role-based permissions (Admin/User)
- Protected API endpoints

---

## Slide 6: User Interface Highlights
### 🎨 User Experience Design

**Dashboard View**
- Real-time statistics cards
- Intuitive color coding:
  - 🟢 Available (Green)
  - 🔴 Occupied (Red)
  - ⚠️ Error (Yellow)

**Interactive Maps**
- Clickable sensor markers
- Map switching with smooth transitions
- Zoom and pan functionality

**Admin Panel**
- Sensor management grid
- Modal forms for add/edit operations
- Confirmation dialogs for deletions

**Responsive Design**
- Mobile-optimized layouts
- Tablet and desktop support
- Touch-friendly interactions

---

## Slide 7: Database Design
### 🗄️ Normalized Database Structure

**Core Tables:**
```sql
users          # Authentication & roles
├─ id, username, password, role

areas          # Campus zones/buildings  
├─ id, name, map_code, description

rooms          # Physical locations
├─ id, description, x, y, floor, map_code

sensors        # Monitoring devices
├─ id, room_id, x, y, status, map_code

zones          # Map configurations
├─ map_code, path, timestamps
```

**Key Relationships:**
- Users authenticate with role-based access
- Areas contain multiple rooms
- Rooms can have sensors
- Zones define map layouts

---

## Slide 8: API Architecture
### 🔗 RESTful API Design

**Public Endpoints**
```
GET  /api/health         # Server status
POST /api/auth/login     # User authentication
GET  /api/rooms          # Fetch all rooms
GET  /api/areas          # Fetch all areas
```

**Protected Endpoints** (Requires Authentication)
```
GET    /api/sensors      # Fetch sensors
POST   /api/sensors      # Add sensor (Admin only)
PUT    /api/sensors/:id  # Update sensor (Admin only)
DELETE /api/sensors/:id  # Delete sensor (Admin only)
```

**Security Features:**
- JWT token validation
- Role-based endpoint protection
- Input validation and sanitization

---

## Slide 9: Installation & Setup
### 🚀 Getting Started

**Prerequisites**
- Node.js 16+
- MySQL 8.0+
- npm/yarn

**Quick Setup**
```bash
# 1. Clone repository
git clone https://github.com/ShalevOzeri/Active_rooms.git

# 2. Install dependencies
cd server && npm install
cd ../client && npm install

# 3. Setup database
mysql -u root -p < server/active_rooms.sql

# 4. Configure environment
cp server/.env.example server/.env
# Edit .env with your database credentials

# 5. Start application
cd server && npm start
cd client && npm start
```

**Access Points:**
- Frontend: http://localhost:3000
- API: http://localhost:3001/api

---

## Slide 10: Demo Accounts
### 👥 Testing the System

**Administrator Account**
- **Username:** `admin`
- **Password:** `admin123`
- **Permissions:** Full CRUD operations, sensor management

**Regular User Account**
- **Username:** `user` 
- **Password:** `user123`
- **Permissions:** View-only access, real-time monitoring

**Features to Test:**
- Login/logout functionality
- Real-time sensor status updates
- Interactive map navigation
- Admin sensor management (admin only)
- Responsive design on different devices

---

## Slide 11: Current Statistics
### 📊 Project Scale & Data

**Database Content:**
- **4 User Accounts** (Admin + Users)
- **11 Areas** across campus buildings
- **26 Rooms** with detailed locations
- **26 Sensors** with real-time status
- **3 Campus Maps** (HIT Campus, Zone 2, Building 568)

**Code Statistics:**
- **Frontend:** 20+ React components
- **Backend:** RESTful API with 8+ endpoints
- **Database:** 6 normalized tables with relationships
- **Documentation:** Comprehensive README files

**Real-time Data:**
- Sensors with live status updates
- Interactive map markers
- Color-coded statistics dashboard

---

## Slide 12: Benefits & Value
### 💡 Why This System Matters

**For Students & Staff:**
- ⏱️ **Time Saving** - Quickly find available rooms
- 📱 **Accessibility** - Works on any device
- 🎯 **Accuracy** - Real-time, reliable data

**For Building Management:**
- 📈 **Resource Optimization** - Better room utilization
- 👁️ **Visibility** - Complete campus overview
- 🔧 **Easy Management** - Simple admin tools

**For IT Department:**
- 🛠️ **Maintainable Code** - Modular architecture
- 🔒 **Secure** - Authentication & authorization
- 📊 **Scalable** - Easy to add more sensors/buildings

**Technical Benefits:**
- Modern, future-proof technology stack
- RESTful API for potential integrations
- Responsive design for all devices

---

## Slide 13: Future Roadmap
### 🔮 Planned Enhancements

**Phase 1: Real-time Improvements**
- [ ] WebSocket integration for live updates
- [ ] Push notifications for room availability
- [ ] Advanced analytics and reporting

**Phase 2: Platform Expansion**
- [ ] Mobile app development (iOS/Android)
- [ ] Desktop application with Electron
- [ ] Progressive Web App (PWA) support

**Phase 3: Advanced Features**
- [ ] Predictive analytics for room usage
- [ ] Integration with calendar systems
- [ ] Historical data analysis and trends
- [ ] Automated room booking system

**Phase 4: DevOps & Scale**
- [ ] Docker containerization
- [ ] CI/CD pipeline implementation
- [ ] Automated testing suite
- [ ] Performance monitoring

---

## Slide 14: Technical Achievements
### 🏆 What Makes This Project Special

**Code Quality:**
- **Modular Architecture** - Easy to maintain and extend
- **Modern React Patterns** - Functional components with hooks
- **Clean API Design** - RESTful principles
- **Database Optimization** - Normalized schema with proper relationships

**User Experience:**
- **Responsive Design** - Works on mobile, tablet, desktop
- **Intuitive Interface** - Easy to learn and use
- **Real-time Updates** - Live sensor status display
- **Visual Feedback** - Color-coded status indicators

**Security & Reliability:**
- **Role-based Access Control** - Secure user management
- **Input Validation** - Protection against malicious data
- **Error Handling** - Graceful error management
- **Database Integrity** - Foreign key constraints

---

## Slide 15: Project Summary
### 🎯 Key Takeaways

**Project Scope:**
- Full-stack web application for campus room monitoring
- Real-time sensor data with interactive visualization
- Complete admin management system
- Mobile-responsive design

**Technical Excellence:**
- Modern technology stack (React, Node.js, MySQL)
- Professional-grade architecture and code organization
- Comprehensive documentation and setup guides
- Security-first approach with authentication

**Business Value:**
- Solves real campus space management problems
- Improves resource utilization efficiency
- Provides valuable insights through data visualization
- Scalable solution for growing campus needs

**Ready for Production:**
- Complete installation instructions
- Database validation tools
- Demo accounts for testing
- Comprehensive error handling

---

## Slide 16: Thank You & Questions
### 🙏 Contact Information

**Project Repository:**
📁 https://github.com/ShalevOzeri/Active_rooms

**Developer:**
👨‍💻 ShalevOzeri

**Documentation:**
📖 Complete README files included
📋 API documentation available
🔧 Setup validation tools provided

**Questions & Discussion:**
- Architecture and technology choices
- Implementation challenges and solutions
- Future enhancement possibilities
- Deployment and scaling considerations

---

**🏠 Active Rooms Detection System**
*Built with Modern Web Technologies for Real Campus Solutions*