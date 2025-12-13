# How to Run - MediaPipe Backend System

## Prerequisites

Install these first:
```bash
# macOS
brew install postgresql@14 mongodb-community@7.0 node python3

# Python packages
pip3 install mediapipe opencv-python numpy
```

## Quick Start (5 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Databases
```bash
# Start PostgreSQL
brew services start postgresql@14

# Start MongoDB
brew services start mongodb-community@7.0

# Create PostgreSQL database
psql postgres -c "CREATE DATABASE mediapipe_db;"
```

### 3. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Update .env if needed (defaults work for local setup)
```

### 4. Start Server
```bash
npm start
```

**Expected output:**
```
Connecting to databases...
MongoDB connected
PostgreSQL connected
Daily backup scheduled: 59 23 * * *
Cron jobs initialized
Server running at http://localhost:3000
```

### 5. Test API
```bash
# Health check
curl http://localhost:3000/health

# Upload image and extract pose
curl -X POST http://localhost:3000/api/extract-pose \
  -F "image=@test_images/yoga_pose.jpg"

# Get all keypoints
curl http://localhost:3000/api/keypoints

# Get all images
curl http://localhost:3000/api/images

# Create backup
curl -X POST http://localhost:3000/api/backup
```

## Populate Sample Data (Optional)

To add sample data for testing:
```bash
node scripts/populate_sample_data.js
```

This will create 4 sample records with keypoints and images from `test_images/`.

## Using Postman

1. Open Postman
2. Import: `postman/MediaPipe_Backend_API.postman_collection.json`
3. Import: `postman/MediaPipe_Backend_Local.postman_environment.json`
4. Select environment: "MediaPipe Backend Local"
5. Run requests in order:
   - Health Check
   - Extract Pose (upload from test_images/)
   - Get All Keypoints
   - Get All Images
   - Create Backup

## API Endpoints

### Main Endpoints
- `POST /api/extract-pose` - Upload image & extract keypoints
- `GET /api/keypoints` - List all keypoints
- `GET /api/keypoints/:id` - Get specific keypoint
- `GET /api/images` - List all images
- `GET /api/images/:id` - Get image info
- `POST /api/backup` - Create backup
- `GET /health` - Health check

## Troubleshooting

### PostgreSQL not running
```bash
brew services restart postgresql@14
```

### MongoDB not running
```bash
brew services restart mongodb-community@7.0
```

### MediaPipe not found
```bash
pip3 install mediapipe opencv-python numpy
```

### Port 3000 in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## Project Features

✅ MediaPipe pose detection (33 keypoints)
✅ PostgreSQL for keypoints (SQL)
✅ MongoDB for images (NoSQL)
✅ Full CRUD REST API
✅ Daily automated backups (11:59 PM)
✅ Email notifications
✅ Complete Postman collection

## Tech Stack

- **Backend**: Node.js + Express.js
- **SQL DB**: PostgreSQL + Sequelize
- **NoSQL DB**: MongoDB + Mongoose
- **AI/ML**: Python + MediaPipe
- **Cron**: node-cron
- **Email**: Nodemailer

## Directory Structure

```
mediapipe-backend/
├── src/                    # Application code
│   ├── app.js             # Entry point
│   ├── config/            # Database connections
│   ├── controllers/       # Request handlers
│   ├── models/            # Data schemas
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── utils/             # Cron jobs
├── python/                # MediaPipe script
├── test_images/           # Sample images
├── postman/               # API collection
├── sample_dumps/          # Database exports
└── HOW_TO_RUN.md         # This file
```

## Support

For detailed API documentation, see: `README.md`

---

**Ready to test!** 🚀
