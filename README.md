# MediaPipe Backend System

Full-stack backend for extracting body keypoints from images using MediaPipe AI, with dual database storage, REST API, automated backups, and email notifications.

## Features

- ✅ MediaPipe Pose detection (33 body keypoints)
- ✅ PostgreSQL database for keypoints (SQL)
- ✅ MongoDB database for images (NoSQL)
- ✅ Complete CRUD REST API
- ✅ Automated daily backups with cron jobs (11:59 PM)
- ✅ Email notifications via SMTP
- ✅ Python + Node.js integration

## Tech Stack

- **Backend**: Node.js 16+, Express.js 5.x
- **Databases**: PostgreSQL 12+ (Sequelize), MongoDB 4.4+ (Mongoose)
- **AI/ML**: Python 3.8+, MediaPipe, OpenCV
- **Automation**: node-cron, archiver, Nodemailer

## Quick Start

**👉 See [HOW_TO_RUN.md](HOW_TO_RUN.md) for complete setup instructions**

```bash
# 1. Install dependencies
npm install
pip3 install mediapipe opencv-python numpy

# 2. Start databases
brew services start postgresql@14 mongodb-community@7.0
psql postgres -c "CREATE DATABASE mediapipe_db;"

# 3. Configure (optional - defaults work locally)
cp .env.example .env

# 4. Start server
npm start

# 5. Test
curl http://localhost:3000/health
```

## API Endpoints

### Pose & Keypoints
- `POST /api/extract-pose` - Upload image & extract keypoints (multipart/form-data)
- `GET /api/keypoints` - List all keypoints (paginated)
- `GET /api/keypoints/:id` - Get specific keypoint by ID
- `PUT /api/keypoints/:id` - Update keypoint metadata
- `DELETE /api/keypoints/:id` - Delete keypoint and associated image

### Images
- `GET /api/images` - List all images metadata (paginated)
- `GET /api/images/:id` - Get image metadata by ID
- `GET /api/images/:id/file` - Get image binary (inline)
- `GET /api/images/:id/download` - Download image file
- `PUT /api/images/:id` - Update image metadata
- `DELETE /api/images/:id` - Delete image

### Backup
- `POST /api/backup` - Create new backup ZIP
- `GET /api/backup` - List all backup files
- `GET /api/backup/:filename` - Download specific backup
- `DELETE /api/backup/:filename` - Delete backup file
- `POST /api/backup/test-email` - Test email configuration

### System
- `GET /health` - Server health check
- `GET /api` - API information

## Testing with Postman

1. Open Postman
2. Import collection: `postman/MediaPipe_Backend_API.postman_collection.json`
3. Import environment: `postman/MediaPipe_Backend_Local.postman_environment.json`
4. Select "MediaPipe Backend Local" environment
5. Run requests:
   - Health Check
   - Extract Pose (upload from `test_images/`)
   - Get All Keypoints
   - Get All Images
   - Create Backup
   - 
<img width="1280" height="832" alt="image" src="https://github.com/user-attachments/assets/2d15a859-4439-4098-83e8-9e8486e7443f" />

## Project Structure

```
mediapipe-backend/
├── src/                   # Application code
│   ├── app.js            # Entry point
│   ├── config/           # Database connections
│   ├── controllers/      # Request handlers
│   ├── models/           # Data models (Sequelize + Mongoose)
│   ├── routes/           # API routes
│   ├── services/         # Business logic (MediaPipe, Backup, Email)
│   └── utils/            # Cron jobs
├── python/               # MediaPipe pose extraction script
├── test_images/          # Sample images for testing
├── postman/              # Postman collection
├── sample_dumps/         # Sample database exports
├── .env.example          # Environment template
├── HOW_TO_RUN.md        # Setup guide
└── README.md            # This file
```

## Environment Variables

Create `.env` file (or use defaults):

```env
# Server
PORT=3000

# PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=mediapipe_db
PG_USER=postgres
PG_PASSWORD=

# MongoDB
MONGODB_URI=mongodb://localhost:27017/mediapipe_images

# Email (Ethereal for testing)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=demo@ethereal.email
SMTP_PASS=demo_password
EMAIL_FROM=backend@ethereal.email
EMAIL_TO=admin@test.com

# Backup
BACKUP_DIR=./backup
CRON_SCHEDULE=59 23 * * *
```

## Sample API Usage

### Extract Pose from Image
```bash
curl -X POST http://localhost:3000/api/extract-pose \
  -F "image=@test_images/yoga_pose.jpg"
```

### Get All Keypoints
```bash
curl http://localhost:3000/api/keypoints
```

### Get All Images
```bash
curl http://localhost:3000/api/images
```

### Create Backup
```bash
curl -X POST http://localhost:3000/api/backup
```

## Troubleshooting

**PostgreSQL not running:**
```bash
brew services restart postgresql@14
```

**MongoDB not running:**
```bash
brew services restart mongodb-community@7.0
```

**MediaPipe not found:**
```bash
pip3 install mediapipe opencv-python numpy
```

**Port 3000 in use:**
```bash
lsof -ti:3000 | xargs kill -9
```

## Cron Job

Automated daily backup runs at **11:59 PM** (configurable via `CRON_SCHEDULE` in `.env`).

**What it does:**
1. Exports PostgreSQL keypoints to JSON
2. Exports MongoDB images metadata to JSON
3. Exports image binary files
4. Creates ZIP file: `backup/YYYY-MM-DD-backup.zip`
5. Sends email notification with attachment
6. Cleans old backups (7-day retention)

## License

MIT

## Author

**Vikas Sriramaneni**
- Email: sriramanenivikas@gmail.com
- GitHub: [@Sriramanenivikas](https://github.com/Sriramanenivikas)

---

**For detailed setup and testing instructions, see [HOW_TO_RUN.md](HOW_TO_RUN.md)**
