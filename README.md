# MediaPipe Keypoint Extraction Backend

Backend system for extracting body keypoints from images using MediaPipe Pose detection.

## What it does

- Extracts 33 body keypoints from uploaded images using Google's MediaPipe
- Stores keypoints in PostgreSQL and images in MongoDB
- Provides REST API for all operations
- Runs automated daily backups at 11:59 PM
- Sends backup files via email

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Node.js, Express |
| SQL Database | PostgreSQL |
| NoSQL Database | MongoDB |
| Image Processing | Python, MediaPipe |
| Task Scheduler | node-cron |
| Email | Nodemailer |

## Quick Start

### Requirements

- Node.js 16+
- Python 3.8+
- PostgreSQL 12+
- MongoDB 4.4+

### Installation

```bash
git clone https://github.com/Sriramanenivikas/mediapipe-keypoint-backend.git
cd mediapipe-keypoint-backend

npm install

pip3 install mediapipe opencv-python numpy
```

### Database Setup

PostgreSQL:
```bash
psql -U postgres -c "CREATE DATABASE mediapipe_db;"
```

MongoDB:
```bash
mongod --dbpath ~/mongodb-data
```

### Configuration

Copy `.env.example` to `.env` and update values:

```
PORT=3000
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=mediapipe_db
PG_USER=postgres
PG_PASSWORD=
MONGODB_URI=mongodb://localhost:27017/mediapipe_images
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
EMAIL_TO=recipient@example.com
BACKUP_DIR=./backup
CRON_SCHEDULE=59 23 * * *
```

### Run

```bash
npm start
```

Server runs at http://localhost:3000

## API Reference

### Extract Pose

```
POST /api/extract-pose
Content-Type: multipart/form-data
Body: image (file)
```

Returns 33 keypoints with x, y, z coordinates and visibility scores.

### Keypoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/keypoints | List all keypoints |
| GET | /api/keypoints/:id | Get single keypoint |
| PUT | /api/keypoints/:id | Update metadata |
| DELETE | /api/keypoints/:id | Delete keypoint |

### Images

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/images | List all images |
| GET | /api/images/:id | Get image info |
| GET | /api/images/:id/file | Get image binary |
| DELETE | /api/images/:id | Delete image |

### Backup

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/backup | Create backup |
| GET | /api/backup | List backups |
| GET | /api/backup/:filename | Download backup |
| DELETE | /api/backup/:filename | Delete backup |

## Project Structure

```
├── src/
│   ├── app.js
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── python/
│   └── extract_pose.py
├── sample_dumps/
├── backup/
└── uploads/
```

## Cron Schedule

Daily backup runs at 11:59 PM. Change in `.env`:

```
CRON_SCHEDULE=59 23 * * *
```

Format: `minute hour day month weekday`

## Sample Data

PostgreSQL dump and MongoDB export available in `sample_dumps/` folder.

## Author

Vikas Sriramaneni  
sriramanenivikas@gmail.com

## License

MIT
