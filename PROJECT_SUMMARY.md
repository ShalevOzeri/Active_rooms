# 🏠 Active Rooms Detection System - Project Summary

## קיצור פרוייקט - Project Summary

### מה זה הפרוייקט? - What is this project?
מערכת זיהוי תפוסת חדרים בזמן אמת עם ממשק ניהול מתקדם וארכיטקטורה מודולרית.

A real-time room occupancy detection system with advanced management interface and modular architecture.

---

## 🎯 המטרה העיקרית - Main Purpose
לספק פתרון מקיף לניטור וניהול תפוסת חדרים בקמפוס באמצעות חיישנים חכמים ומערכת ניהול מתקדמת.

To provide a comprehensive solution for monitoring and managing room occupancy on campus using smart sensors and an advanced management system.

---

## 🛠️ טכנולוגיות מרכזיות - Key Technologies

### Frontend (לקוח)
- **React 18.2.0** - ספריית UI מודרנית
- **CSS3** - עיצוב מתקדם עם אנימציות
- **Responsive Design** - תמיכה בכל המכשירים

### Backend (שרת)  
- **Node.js + Express** - שרת web מהיר
- **MySQL** - מסד נתונים יחסי
- **JWT Authentication** - אימות מאובטח

### ארכיטקטורה - Architecture
```
React Client ←→ Express API ←→ MySQL Database
```

---

## ✨ תכונות מרכזיות - Key Features

### 📊 ניטור בזמן אמת - Real-time Monitoring
- סטטוס חיישנים חי (פנוי/תפוס/שגיאה)
- לוח בקרה אינטראקטיבי
- כרטיסי סטטיסטיקה צבעוניים

### 🗺️ מפות אינטראקטיביות - Interactive Maps
- שילוב מפות קמפוס
- מחוני סטטוס בזמן אמת
- מעבר בין מפות מרובות

### 👑 ניהול מנהלים - Admin Management
- הוספה/עריכה/מחיקה של חיישנים
- ולידציית מיקום במפות
- ניהול חדרים ואזורים

### 🔒 אבטחה - Security
- מערכת אימות משתמשים
- הרשאות מבוססות תפקידים
- הגנה על API endpoints

---

## 📊 נתונים סטטיסטיים - Project Statistics

| רכיב - Component | כמות - Count |
|------------------|---------------|
| משתמשים - Users | 4 |
| אזורים - Areas | 11 |
| חדרים - Rooms | 26 |
| חיישנים - Sensors | 26 |
| מפות - Maps | 3 |
| קומפוננטים - Components | 20+ |

---

## 🚀 התקנה מהירה - Quick Installation

```bash
# 1. שכפול הפרוייקט - Clone project
git clone https://github.com/ShalevOzeri/Active_rooms.git

# 2. התקנת תלויות - Install dependencies  
cd server && npm install
cd ../client && npm install

# 3. הגדרת מסד נתונים - Setup database
mysql -u root -p < server/active_rooms.sql

# 4. הפעלה - Run application
cd server && npm start
cd ../client && npm start
```

**גישה - Access:** http://localhost:3000

---

## 👥 חשבונות לבדיקה - Demo Accounts

### מנהל - Administrator
- **שם משתמש - Username:** `admin`
- **סיסמה - Password:** `admin123`
- **הרשאות - Permissions:** ניהול מלא של חיישנים

### משתמש רגיל - Regular User  
- **שם משתמש - Username:** `user`
- **סיסמה - Password:** `user123`
- **הרשאות - Permissions:** צפייה בלבד

---

## 💡 יתרונות המערכת - System Benefits

### לסטודנטים וצוות - For Students & Staff
✅ חיסכון בזמן - מציאת חדרים פנויים במהירות  
✅ נגישות - עובד על כל מכשיר  
✅ דיוק - נתונים מהימנים בזמן אמת  

### לניהול המבנה - For Building Management
✅ אופטימיזציה - ניצול טוב יותר של החדרים  
✅ שקיפות - סקירה מלאה של הקמפוס  
✅ קלות ניהול - כלים פשוטים למנהלים  

### למחלקת IT - For IT Department
✅ קוד ניתן לתחזוקה - ארכיטקטורה מודולרית  
✅ אבטחה - אימות והרשאות  
✅ מדרגיות - קל להוסיף חיישנים נוספים  

---

## 🔮 תוכניות עתיד - Future Plans

### שלב 1 - Phase 1: זמן אמת מתקדם
- שילוב WebSocket לעדכונים מיידיים
- התראות push למשתמשים
- אנליטיקה מתקדמת

### שלב 2 - Phase 2: הרחבת פלטפורמות
- פיתוח אפליקציית נייד
- אפליקציית דסקטופ
- תמיכה ב-PWA

### שלב 3 - Phase 3: תכונות מתקדמות
- אנליטיקה חזויה
- שילוב עם לוח שנה
- מערכת הזמנות אוטומטית

---

## 📞 יצירת קשר - Contact Information

**מפתח הפרוייקט - Developer:** ShalevOzeri  
**קישור לפרוייקט - Repository:** https://github.com/ShalevOzeri/Active_rooms  

**תיעוד נוסף - Additional Documentation:**
- [README מפורט - Detailed README](README.md)
- [תיעוד השרת - Server Documentation](server/README.md)
- [מצגת מלאה - Full Presentation](PRESENTATION.md)
- [מצגת HTML - HTML Presentation](presentation.html)

---

## 🏆 סיכום - Summary

פרוייקט **Active Rooms Detection System** הוא מערכת מתקדמת ומתפקדת לניטור חדרים בזמן אמת, הבנויה עם טכנולוגיות מודרניות וארכיטקטורה מקצועית. המערכת מספקת פתרון מקיף לבעיות ניהול מקום בקמפוס ומשפרת את חוויית המשתמש באמצעות ממשק אינטואיטיבי ונתונים מדויקים.

The **Active Rooms Detection System** project is an advanced and functional system for real-time room monitoring, built with modern technologies and professional architecture. The system provides a comprehensive solution to campus space management problems and improves user experience through an intuitive interface and accurate data.

---

**🏠 Active Rooms Detection System - מערכת זיהוי חדרים פעילים**  
*Built with Modern Web Technologies - בנוי עם טכנולוגיות ווב מתקדמות*