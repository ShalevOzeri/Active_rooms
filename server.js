import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { pool, testConnection } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test database connection on startup
testConnection();

// Simple authentication middleware
const authenticateUser = async (req, res, next) => {
    const { username, password } = req.headers;
    
    if (!username || !password) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    try {
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        req.user = users[0];
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: 'Authentication error' });
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
};

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Active Rooms Detection API is running',
        timestamp: new Date().toISOString()
    });
});

// === AUTH API ===
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        const [users] = await pool.execute(
            'SELECT id, username, email, phone, role FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = users[0];
        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role === 1 ? 'admin' : 'user'
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// === ROOMS API ===
app.get('/api/rooms', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT r.*, a.name as area_name 
            FROM rooms r 
            LEFT JOIN areas a ON r.area = a.id 
            ORDER BY CAST(r.id AS UNSIGNED)
        `);
        
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching rooms',
            error: error.message
        });
    }
});

// === SENSORS API ===
app.get('/api/sensors', authenticateUser, async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT s.*, r.description as room_description, a.name as area_name
            FROM sensors s 
            LEFT JOIN rooms r ON s.room_id = r.id 
            LEFT JOIN areas a ON r.area = a.id
            ORDER BY s.id
        `);
        
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching sensors',
            error: error.message
        });
    }
});

// Add Sensor (החלף את הפונקציה הקיימת)
app.post('/api/sensors', authenticateUser, requireAdmin, async (req, res) => {
    try {
        const { id, x, y, room_id, status = 'available' } = req.body;

        // בדיקת נתונים חובה
        if (!id || x === undefined || y === undefined || !status) {
            return res.json({ 
                success: false, 
                message: 'Missing required fields: id, x, y, status' 
            });
        }

        // המרה למספרים ובדיקת תקינות
        const xCoord = parseInt(x);
        const yCoord = parseInt(y);
        
        if (isNaN(xCoord) || isNaN(yCoord)) {
            return res.json({ 
                success: false, 
                message: 'X and Y coordinates must be valid numbers' 
            });
        }

        if (xCoord < 0 || xCoord > 800 || yCoord < 0 || yCoord > 600) {
            return res.json({ 
                success: false, 
                message: 'Coordinates out of range (X: 0-800, Y: 0-600)' 
            });
        }

        // בדיקה אם החיישן כבר קיים
        const [existingSensors] = await pool.execute(
            'SELECT id FROM sensors WHERE id = ?',
            [id]
        );

        if (existingSensors.length > 0) {
            return res.json({ 
                success: false, 
                message: `Sensor ${id} already exists` 
            });
        }

        // הוספת החיישן
        await pool.execute(
            'INSERT INTO sensors (id, x, y, room_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
            [id, xCoord, yCoord, room_id || null, status]
        );

        console.log(`✅ Sensor added: ${id} at (${xCoord}, ${yCoord})`);
        
        res.json({ 
            success: true, 
            message: `Sensor ${id} added successfully`,
            data: { id, x: xCoord, y: yCoord, room_id, status }
        });

    } catch (error) {
        console.error('❌ Error adding sensor:', error);
        res.json({ 
            success: false, 
            message: 'Database error: ' + error.message 
        });
    }
});

// Update Sensor
app.put('/api/sensors/:id', authenticateUser, requireAdmin, async (req, res) => {
    try {
        const { x, y, status, room_id } = req.body;
        const sensorId = req.params.id;

        const [result] = await pool.execute(
            'UPDATE sensors SET x = ?, y = ?, status = ?, room_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [x, y, status, room_id || null, sensorId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sensor not found'
            });
        }

        res.json({
            success: true,
            message: 'Sensor updated successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating sensor',
            error: error.message
        });
    }
});

// Delete Sensor (החדש והמתוקן)
app.delete('/api/sensors/:id', authenticateUser, requireAdmin, async (req, res) => {
    try {
        const sensorId = req.params.id;
        
        console.log(`🗑️ Attempting to delete sensor: ${sensorId}`);
        
        // בדיקה אם החיישן קיים
        const [existingSensors] = await pool.execute(
            'SELECT id FROM sensors WHERE id = ?',
            [sensorId]
        );

        if (existingSensors.length === 0) {
            return res.json({ 
                success: false, 
                message: `Sensor ${sensorId} not found` 
            });
        }

        // מחיקת החיישן
        const [result] = await pool.execute(
            'DELETE FROM sensors WHERE id = ?',
            [sensorId]
        );

        if (result.affectedRows > 0) {
            console.log(`✅ Sensor deleted: ${sensorId}`);
            res.json({ 
                success: true, 
                message: `Sensor ${sensorId} deleted successfully` 
            });
        } else {
            res.json({ 
                success: false, 
                message: 'Failed to delete sensor' 
            });
        }

    } catch (error) {
        console.error('❌ Error deleting sensor:', error);
        res.json({ 
            success: false, 
            message: 'Database error: ' + error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Active Rooms Detection Server running on port ${PORT}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
});
