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

// === VALIDATION FUNCTIONS ===
const validateSensorData = (data, isUpdate = false) => {
    const errors = [];
    
    // ID validation (only if not update, or if specified)
    if (data.id !== undefined) {
        if (!data.id || typeof data.id !== 'string' || data.id.trim() === '') {
            errors.push('ID must be a non-empty string');
        } else if (data.id.length > 50) {
            errors.push('ID must be 50 characters or less');
        } else if (!/^[A-Za-z0-9_-]+$/.test(data.id)) {
            errors.push('ID can only contain letters, numbers, underscores, and hyphens');
        }
    } else if (!isUpdate) {
        errors.push('ID is required');
    }
    
    // X coordinate validation
    if (data.x !== undefined) {
        const x = parseInt(data.x);
        if (isNaN(x)) {
            errors.push('X coordinate must be a valid number');
        } else if (x < 0 || x > 800) {
            errors.push('X coordinate must be between 0 and 800');
        }
    } else if (!isUpdate) {
        errors.push('X coordinate is required');
    }
    
    // Y coordinate validation
    if (data.y !== undefined) {
        const y = parseInt(data.y);
        if (isNaN(y)) {
            errors.push('Y coordinate must be a valid number');
        } else if (y < 0 || y > 600) {
            errors.push('Y coordinate must be between 0 and 600');
        }
    } else if (!isUpdate) {
        errors.push('Y coordinate is required');
    }
    
    // Status validation
    if (data.status !== undefined && !['available', 'occupied', 'error', 'maintenance'].includes(data.status)) {
        errors.push('Status must be one of: available, occupied, error, maintenance');
    }
    
    // Room ID validation
    if (data.room_id !== undefined && data.room_id !== null && data.room_id !== '') {
        if (typeof data.room_id !== 'string' || data.room_id.length > 10) {
            errors.push('Room ID must be a string with 10 characters or less');
        }
    }
    
    return errors;
};

const validateUserData = (data) => {
    const errors = [];
    
    // Username validation
    if (!data.username || typeof data.username !== 'string' || data.username.trim() === '') {
        errors.push('Username is required and must be a non-empty string');
    } else if (data.username.length > 50) {
        errors.push('Username must be 50 characters or less');
    } else if (!/^[A-Za-z0-9_-]+$/.test(data.username)) {
        errors.push('Username can only contain letters, numbers, underscores, and hyphens');
    }
    
    // Password validation
    if (!data.password || typeof data.password !== 'string' || data.password.length < 3) {
        errors.push('Password must be at least 3 characters long');
    } else if (data.password.length > 255) {
        errors.push('Password must be 255 characters or less');
    }
    
    // Email validation
    if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.push('Email must be a valid email address');
        } else if (data.email.length > 100) {
            errors.push('Email must be 100 characters or less');
        }
    }
    
    // Phone validation
    if (data.phone) {
        if (typeof data.phone !== 'string' || data.phone.length > 20) {
            errors.push('Phone must be a string with 20 characters or less');
        } else if (!/^[0-9+\-\s()]+$/.test(data.phone)) {
            errors.push('Phone can only contain numbers, +, -, spaces, and parentheses');
        }
    }
    
    // Role validation
    if (data.role !== undefined && ![0, 1, '0', '1'].includes(data.role)) {
        errors.push('Role must be 0 (user) or 1 (admin)');
    }
    
    return errors;
};

const validateRoomData = (data) => {
    const errors = [];
    
    // ID validation
    if (!data.id || typeof data.id !== 'string' || data.id.trim() === '') {
        errors.push('Room ID is required and must be a non-empty string');
    } else if (data.id.length > 10) {
        errors.push('Room ID must be 10 characters or less');
    }
    
    // Description validation
    if (data.description && (typeof data.description !== 'string' || data.description.length > 255)) {
        errors.push('Description must be a string with 255 characters or less');
    }
    
    // Area validation
    if (data.area && (!Number.isInteger(parseInt(data.area)) || parseInt(data.area) < 1)) {
        errors.push('Area must be a valid positive integer (area ID)');
    }
    
    return errors;
};

// === AUTH API ===
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log(`🔐 Login attempt: username="${username}"`);

        // Validation
        const validationErrors = validateUserData({ username, password });
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        const [users] = await pool.execute(
            'SELECT id, username, email, phone, role FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        if (users.length === 0) {
            console.log(`❌ Invalid credentials for: ${username}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = users[0];
        console.log(`✅ Login successful for: ${user.username}`);
        
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
        console.error('❌ Login error:', error);
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

// Add Sensor (updated with validation)
app.post('/api/sensors', authenticateUser, requireAdmin, async (req, res) => {
    try {
        const { id, x, y, room_id, status = 'available' } = req.body;

        console.log('📝 Received sensor data:', { id, x, y, room_id, status });

        // Comprehensive validation (isUpdate = false)
        const validationErrors = validateSensorData({ id, x, y, room_id, status }, false);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // Convert to numbers (after validation)
        const xCoord = parseInt(x);
        const yCoord = parseInt(y);

        // Check if sensor already exists
        const [existingSensors] = await pool.execute(
            'SELECT id FROM sensors WHERE id = ?',
            [id]
        );

        if (existingSensors.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: `Sensor ${id} already exists` 
            });
        }

        // Check if room exists (if specified)
        if (room_id) {
            const [existingRooms] = await pool.execute(
                'SELECT id FROM rooms WHERE id = ?',
                [room_id]
            );

            if (existingRooms.length === 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Room ${room_id} does not exist` 
                });
            }
        }

        // Adding sensor
        await pool.execute(
            'INSERT INTO sensors (id, x, y, room_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
            [id, xCoord, yCoord, room_id || null, status]
        );

        console.log(`✅ Sensor added: ${id} at (${xCoord}, ${yCoord})`);
        
        res.status(201).json({ 
            success: true, 
            message: `Sensor ${id} added successfully`,
            data: { id, x: xCoord, y: yCoord, room_id, status }
        });

    } catch (error) {
        console.error('❌ Error adding sensor:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Database error: ' + error.message 
        });
    }
});

// Update Sensor (updated with validation)
app.put('/api/sensors/:id', authenticateUser, requireAdmin, async (req, res) => {
    try {
        const { x, y, status, room_id } = req.body;
        const sensorId = req.params.id;

        console.log(`📝 Updating sensor ${sensorId}:`, { x, y, status, room_id });

        // URL ID validation
        if (!sensorId || typeof sensorId !== 'string' || sensorId.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Sensor ID in URL is required'
            });
        }

        // Check that there is at least one field to update
        if (x === undefined && y === undefined && status === undefined && room_id === undefined) {
            return res.status(400).json({
                success: false,
                message: 'At least one field (x, y, status, room_id) must be provided for update'
            });
        }

        // Validation of updated data (only for sent fields)
        const updateData = {};
        if (x !== undefined) updateData.x = x;
        if (y !== undefined) updateData.y = y;
        if (status !== undefined) updateData.status = status;
        if (room_id !== undefined) updateData.room_id = room_id;

        // Call validation with isUpdate = true
        const validationErrors = validateSensorData(updateData, true);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // Check if sensor exists
        const [existingSensors] = await pool.execute(
            'SELECT id, x, y, status, room_id FROM sensors WHERE id = ?',
            [sensorId]
        );

        if (existingSensors.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Sensor ${sensorId} not found`
            });
        }

        const currentSensor = existingSensors[0];

        // Check if room exists (if specified)
        if (room_id !== undefined && room_id !== null && room_id !== '') {
            const [existingRooms] = await pool.execute(
                'SELECT id FROM rooms WHERE id = ?',
                [room_id]
            );

            if (existingRooms.length === 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Room ${room_id} does not exist` 
                });
            }
        }

        // Build query only with fields that need to be updated
        const updateFields = [];
        const updateValues = [];

        if (x !== undefined) {
            updateFields.push('x = ?');
            updateValues.push(parseInt(x));
        }
        if (y !== undefined) {
            updateFields.push('y = ?');
            updateValues.push(parseInt(y));
        }
        if (status !== undefined) {
            updateFields.push('status = ?');
            updateValues.push(status);
        }
        if (room_id !== undefined) {
            updateFields.push('room_id = ?');
            updateValues.push(room_id || null);
        }

        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(sensorId);

        // Update sensor
        const [result] = await pool.execute(
            `UPDATE sensors SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sensor not found'
            });
        }

        console.log(`✅ Sensor updated: ${sensorId}`);
        res.json({
            success: true,
            message: `Sensor ${sensorId} updated successfully`,
            updated: {
                ...currentSensor,
                ...(x !== undefined && { x: parseInt(x) }),
                ...(y !== undefined && { y: parseInt(y) }),
                ...(status !== undefined && { status }),
                ...(room_id !== undefined && { room_id })
            }
        });

    } catch (error) {
        console.error('❌ Error updating sensor:', error);
        res.status(500).json({
            success: false,
            message: 'Database error: ' + error.message
        });
    }
});

// Delete Sensor (updated with validation)
app.delete('/api/sensors/:id', authenticateUser, requireAdmin, async (req, res) => {
    try {
        const sensorId = req.params.id;
        
        console.log(`🗑️ Attempting to delete sensor: ${sensorId}`);
        
        // ID validation
        if (!sensorId || typeof sensorId !== 'string' || sensorId.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Sensor ID is required and must be a valid string'
            });
        }

        if (sensorId.length > 50) {
            return res.status(400).json({
                success: false,
                message: 'Sensor ID must be 50 characters or less'
            });
        }
        
        // Check if sensor exists
        const [existingSensors] = await pool.execute(
            'SELECT id FROM sensors WHERE id = ?',
            [sensorId]
        );

        if (existingSensors.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: `Sensor ${sensorId} not found` 
            });
        }

        // Delete sensor
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
            res.status(500).json({ 
                success: false, 
                message: 'Failed to delete sensor' 
            });
        }

    } catch (error) {
        console.error('❌ Error deleting sensor:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Database error: ' + error.message 
        });
    }
});

// === AREAS API ===
app.get('/api/areas', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM areas ORDER BY name');
        
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching areas',
            error: error.message
        });
    }
});

// === STATUS API ===
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        message: 'Server supports multiple concurrent connections with comprehensive validation',
        info: {
            activeConnections: 'Multiple clients can connect simultaneously',
            technology: 'Express.js with async/await',
            database: 'MySQL connection pool',
            validation: 'Comprehensive data validation enabled'
        },
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Active Rooms Detection Server running on port ${PORT}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
    console.log(`✅ Comprehensive validation enabled`);
});
