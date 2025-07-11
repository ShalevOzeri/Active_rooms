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


// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Active Rooms Detection API is running',
        timestamp: new Date().toISOString()
    });

});

// CREATE - Add new room
app.post('/api/rooms', async (req, res) => {
    try {
        const { id,description,area,x,y } = req.body;
        
        const [result] = await pool.execute(
            'INSERT INTO rooms (id,description,area,x,y) VALUES (?, ?, ?, ?, ?)',
            [id,description,area,x,y]

        );
        
        //Room created successfully
        res.status(201).json({
            success: true,
            message: 'Success',
            roomId: result.insertId
        });
        //Error creating room
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error',
            error: error.message
        });
    }
});



// READ - Get all rooms with their status
app.get('/api/rooms', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
            r.id, r.description, r.area, r.x, r.y
            FROM rooms r
            ORDER BY r.id
        `);
        
        res.json({
            success: true,
            data: rows
        });
        // Error fetching rooms
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error',
            error: error.message
        });
    }
});


// DELETE - Delete room
app.delete('/api/rooms/:id', async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM rooms WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Error'//Room not found
            });
        }
        // Room deleted successfully
        res.json({
            success: true,
            message: 'Success'
        });
        // Error deleting room
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error',
            error: error.message
        });
    }
});




// UPDATE - Update room information
app.put('/api/areas', async (req, res) => {
    try {
        const { id, name, description, path, restriction } = req.body;
        
        const [result] = await pool.execute(
            'UPDATE areas SET name = ?, description = ?, path = ?, restriction = ? WHERE id = ?',
            [name, description, path, restriction, id]
        );
        //area not found
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Error'
            });
        }
        //area updated successfully
        res.json({
            success: true,
            message: 'Success'
        });
        // Error updating area
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error',
            error: error.message
        });
    }
});





// Start server
app.listen(PORT, () => {
    console.log(`Active Rooms Detection Server running on port ${PORT}`);
    console.log(`Health Check: http://localhost:${PORT}/api/health`);
});
