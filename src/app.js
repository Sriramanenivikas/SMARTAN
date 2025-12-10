const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectMongoDB, connectPostgreSQL } = require('./config/database');
const cronJobs = require('./utils/cronJobs');

const poseRoutes = require('./routes/poseRoutes');
const imageRoutes = require('./routes/imageRoutes');
const backupRoutes = require('./routes/backupRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', poseRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/backup', backupRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.get('/api', (req, res) => {
    res.json({
        name: 'MediaPipe Backend API',
        version: '1.0.0',
        endpoints: {
            pose: {
                'POST /api/extract-pose': 'Extract keypoints from image',
                'GET /api/keypoints': 'List all keypoints',
                'GET /api/keypoints/:id': 'Get keypoint by ID',
                'PUT /api/keypoints/:id': 'Update keypoint',
                'DELETE /api/keypoints/:id': 'Delete keypoint'
            },
            images: {
                'GET /api/images': 'List all images',
                'GET /api/images/:id': 'Get image info',
                'GET /api/images/:id/file': 'Get image binary',
                'DELETE /api/images/:id': 'Delete image'
            },
            backup: {
                'POST /api/backup': 'Create backup',
                'GET /api/backup': 'List backups',
                'GET /api/backup/:filename': 'Download backup',
                'DELETE /api/backup/:filename': 'Delete backup'
            }
        }
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint not found' });
});

const startServer = async () => {
    try {
        console.log('Connecting to databases...');
        await connectMongoDB();
        await connectPostgreSQL();
        
        cronJobs.init();
        
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start:', error);
        process.exit(1);
    }
};

process.on('SIGTERM', () => { cronJobs.stopAll(); process.exit(0); });
process.on('SIGINT', () => { cronJobs.stopAll(); process.exit(0); });

startServer();

module.exports = app;
