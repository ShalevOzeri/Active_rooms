# 🏠 Active Rooms Detection System
## מצגת פרוייקט - Project Presentation

---

## 📑 תוכן עניינים - Table of Contents

1. [סקירת הפרוייקט - Project Overview](#project-overview)
2. [ארכיטקטורה וטכנולוגיות - Architecture & Technologies](#architecture)
3. [תכונות מרכזיות - Key Features](#features)
4. [ממשק המשתמש - User Interface](#ui)
5. [מבנה המסד נתונים - Database Structure](#database)
6. [הדרכת התקנה - Installation Guide](#installation)
7. [שיפורים עתידיים - Future Enhancements](#future)

---

## 🎯 Project Overview <a id="project-overview"></a>

### מה זה מערכת Active Rooms?
**מערכת זיהוי תפוסת חדרים בזמן אמת עם ממשק ניהול מתקדם וארכיטקטורה מודולרית**

### מטרות הפרוייקט:
- 📊 **ניטור בזמן אמת** של סטטוס חדרים (פנוי/תפוס/שגיאה)
- 🗺️ **מפות אינטראקטיביות** של הקמפוס עם מיקומי חיישנים
- 👑 **ממשק ניהול** למנהלים להוספה, עריכה ומחיקה של חיישנים
- 🔒 **מערכת הרשאות** מבוססת תפקידים (מנהל/משתמש רגיל)
- 📱 **עיצוב רספונסיבי** לכל סוגי המכשירים

### קהל היעד:
- **מנהלי מבנים** - ניהול וניטור חיישנים
- **סטודנטים וצוות** - מציאת חדרים פנויים
- **מחלקת IT** - תחזוקה וניטור המערכת

---

## 🏗️ Architecture & Technologies <a id="architecture"></a>

### ארכיטקטורה כללית
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │────│  Express API    │────│  MySQL Database │
│   (Frontend)    │    │   (Backend)     │    │    (Storage)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🖥️ Frontend Technologies
- **React 18.2.0** - ספריית UI מודרנית עם hooks
- **Modular Components** - ארכיטקטורה מודולרית וניתנת לתחזוקה
- **CSS3** - עיצוב מתקדם עם אנימציות וגרדיאנטים
- **Axios** - תקשורת HTTP עם השרת
- **Responsive Design** - תמיכה בכל גדלי מסכים

### ⚙️ Backend Technologies
- **Node.js + Express** - שרת web מהיר וגמיש
- **MySQL** - מסד נתונים יחסי עם connection pooling
- **JWT Authentication** - אבטחת API endpoints
- **CORS** - תמיכה בבקשות cross-origin
- **Multer** - העלאת קבצים (מפות)

### 🛠️ Development Tools
- **Environment Variables** - הגדרות אבטחה מבוססות .env
- **Database Validation** - סקריפט בדיקת תקינות התקנה
- **Development Scripts** - כלי פיתוח עם hot reload
- **Modular Structure** - ארגון קוד נקי ומסודר

---

## ✨ Key Features <a id="features"></a>

### 📊 מערכת ניטור ואנליטיקה
- **ניטור בזמן אמת** של סטטוס חיישנים
- **לוח בקרה אינטראקטיבי** עם כרטיסי סטטיסטיקה צבעוניים
- **סקירת אזורים** עם קיבוץ חדרים מקיף
- **רשת חיישנים** עם הצגת סטטוס מיידית

### 🗺️ מפת קמפוס אינטראקטיבית
- **שילוב מפות קמפוס** עם מיקומי חיישנים
- **מחווני סטטוס בזמן אמת** על גבי המפה
- **מעבר בין מפות** עם אנימציות חלקות
- **זום ונווט** במפות עבור פרטים מדויקים

### 👑 פאנל ניהול למנהלים
- **הוספת חיישנים חדשים** עם ולידציית מיקום
- **עריכת פרטי חיישנים** קיימים
- **מחיקת חיישנים** עם אישור בטיחות
- **ניהול חדרים ואזורים** מקיף

### 🎨 חוויית משתמש מתקדמת
- **עיצוב רספונסיבי** מלא (נייד/טאבלט/דסקטופ)
- **ארכיטקטורת קומפוננטים** מודולרית ונקייה
- **סטיילינג CSS מתקדם** עם גרדיאנטים ואנימציות
- **ניווט אינטואיטיבי** ומשוב למשתמש

### 🔒 אבטחה והרשאות
- **מערכת אימות** מאובטחת
- **בקרת גישה מבוססת תפקידים** (Admin/User)
- **הגנה על API endpoints** מוגבלים
- **ניהול sessions** מתקדם

---

## 💻 User Interface <a id="ui"></a>

### 🏠 דף בית - Dashboard
- **כרטיסי סטטיסטיקה** עם נתונים בזמן אמת
- **צבעי סטטוס אינטואיטיביים**: 
  - 🟢 פנוי (Available)
  - 🔴 תפוס (Occupied) 
  - ⚠️ שגיאה (Error)

### 🗺️ תצוגת מפות
- **בחירת מפות** מרובות (HIT Campus, Zone 2, Building 568)
- **מיקום חיישנים** מדויק על המפות
- **אינטראקציה עם חיישנים** להצגת פרטים

### 📋 ניהול חיישנים (Admin)
- **טבלת חיישנים** עם מידע מפורט
- **כפתורי פעולה** לעריכה ומחיקה
- **טפסי הוספה/עריכה** עם ולידציה

### 🏢 ניהול אזורים וחדרים
- **הצגת אזורים** לפי בניינים
- **פירוט חדרים** עם מיקומים מדויקים
- **קישור לחיישנים** המתאימים

---

## 🗄️ Database Structure <a id="database"></a>

### מבנה הטבלאות

#### 👤 users - משתמשים
```sql
- id (varchar): מזהה ייחודי
- username (varchar): שם משתמש
- password (varchar): סיסמה
- email (varchar): כתובת מייל
- phone (varchar): טלפון
- role (tinyint): תפקיד (0=User, 1=Admin)
```

#### 🏢 areas - אזורים
```sql
- id (varchar): מזהה אזור
- name (varchar): שם האזור
- map_code (varchar): קוד המפה
- description (text): תיאור
- restriction (tinyint): הגבלות גישה
```

#### 🚪 rooms - חדרים
```sql
- id (varchar): מזהה חדר
- description (text): תיאור החדר
- x, y (int): קואורדינטות במפה
- floor (int): קומה
- room_name (int): מספר חדר
- map_code (varchar): קוד המפה
```

#### 📡 sensors - חיישנים
```sql
- id (varchar): מזהה חיישן
- room_id (varchar): מזהה החדר
- x, y (int): קואורדינטות במפה
- status (enum): סטטוס (available/occupied/error)
- map_code (varchar): קוד המפה
- created_at, updated_at (timestamp)
```

#### 🗺️ zones - מפות
```sql
- map_code (varchar): קוד המפה
- path (varchar): נתיב לקובץ המפה
- created_at, updated_at (timestamp)
```

### יחסים בין הטבלאות
```
users ←→ authentication
areas ←→ area_room ←→ rooms ←→ sensors
zones ←→ maps (by map_code)
```

---

## 🚀 Installation Guide <a id="installation"></a>

### דרישות מערכת
- **Node.js** 16+ 
- **MySQL** 8.0+
- **npm** או **yarn**

### שלב 1: הכנת הסביבה
```bash
# שכפול הפרוייקט
git clone https://github.com/ShalevOzeri/Active_rooms.git
cd Active_rooms
```

### שלב 2: התקנת התלויות

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

### שלב 3: הגדרת מסד הנתונים

1. **יצירת מסד נתונים MySQL:**
```sql
CREATE DATABASE active_rooms;
```

2. **ייבוא הסכמה:**
```bash
mysql -u username -p active_rooms < server/active_rooms.sql
```

3. **הגדרת קובץ .env:**
```properties
DB_HOST=localhost
DB_USER=your_username  
DB_PASSWORD=your_password
DB_NAME=active_rooms
DB_PORT=3306
PORT=3001
```

### שלב 4: בדיקת התקנה
```bash
cd server
npm test  # בדיקת חיבור למסד נתונים
```

### שלב 5: הפעלת המערכת

**השרת (Terminal 1):**
```bash
cd server
npm start    # production
npm run dev  # development
```

**הלקוח (Terminal 2):**
```bash
cd client
npm start
```

### 🌐 נקודות גישה
- **אפליקציית Web:** http://localhost:3000
- **API Server:** http://localhost:3001/api
- **בדיקת תקינות:** http://localhost:3001/api/health

### 👥 חשבונות הדגמה
- **מנהל:** `admin` / `admin123`
- **משתמש רגיל:** `user` / `user123`

---

## 🔗 API Endpoints

### Public Endpoints
```
GET  /api/health     # בדיקת תקינות השרת
POST /api/auth/login # התחברות למערכת
GET  /api/rooms      # קבלת כל החדרים
GET  /api/areas      # קבלת כל האזורים
```

### Protected Endpoints (דורש אימות)
```
GET    /api/sensors     # קבלת כל החיישנים
POST   /api/sensors     # הוספת חיישן (מנהל בלבד)
PUT    /api/sensors/:id # עדכון חיישן (מנהל בלבד)
DELETE /api/sensors/:id # מחיקת חיישן (מנהל בלבד)
```

---

## 🎯 Future Enhancements <a id="future"></a>

### 🔄 שיפורים טכניים
- [ ] **WebSocket Integration** - עדכונים בזמן אמת ללא רענון
- [ ] **Advanced Analytics** - דוחות מתקדמים וניתוחי נתונים
- [ ] **API Rate Limiting** - הגנה מפני שימוש יתר
- [ ] **Caching System** - שיפור ביצועים עם Redis

### 📱 הרחבות פלטפורמה
- [ ] **Mobile App** - אפליקציית נייד Native
- [ ] **PWA Support** - Progressive Web App
- [ ] **Desktop App** - אפליקציית דסקטופ עם Electron

### 🧪 איכות וביטחון
- [ ] **Automated Testing** - בדיקות אוטומטיות מקיפות
- [ ] **Docker Containerization** - פריסה עם Docker
- [ ] **CI/CD Pipeline** - pipeline אוטומטי לפריסה
- [ ] **Enhanced Security** - אבטחה מתקדמת יותר

### 📊 תכונות מתקדמות
- [ ] **Historical Data** - שמירת היסטוריית נתונים
- [ ] **Predictive Analytics** - ניבוי תפוסת חדרים
- [ ] **Notifications System** - התראות למשתמשים
- [ ] **Integration APIs** - שילוב עם מערכות חיצוניות

---

## 📈 סיכום הפרוייקט

### ✅ הישגים מרכזיים
- **מערכת פעילה ומתפקדת** לניטור חדרים בזמן אמת
- **ארכיטקטורה מודולרית** וניתנת להרחבה
- **ממשק משתמש אינטואיטיבי** ורספונסיבי
- **מערכת אבטחה מתקדמת** עם הרשאות מדורגות
- **תיעוד מקיף** להתקנה ותחזוקה

### 🎯 ערך עסקי
- **חיסכון בזמן** - מציאת חדרים פנויים ביעילות
- **ניצול משאבים** - אופטימיזציה של שימוש בחדרים  
- **שקיפות** - מידע נגיש בזמן אמת לכל המשתמשים
- **קלות ניהול** - כלי ניהול פשוטים למנהלים

### 🏆 טכנולוגיות מתקדמות
- **React Modern Patterns** - שימוש בטכנולוגיות עדכניות
- **RESTful API Design** - עיצוב API תקני ומקצועי
- **Database Optimization** - מבנה מסד נתונים אופטימלי
- **Responsive Design** - תמיכה בכל פלטפורמות

---

## 📞 יצירת קשר ותמיכה

**מפתח הפרוייקט:** ShalevOzeri  
**Repository:** https://github.com/ShalevOzeri/Active_rooms

### 📚 משאבים נוספים
- [README מפורט](README.md)
- [תיעוד השרת](server/README.md) 
- [דוגמאות API](server/README.md#api-endpoints)

---

**🏠 Active Rooms Detection System - Built with Modern Web Technologies**

*מערכת מתקדמת לניטור וניהול חדרים בזמן אמת*