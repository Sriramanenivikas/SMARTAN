# Postman Troubleshooting Guide

## How to Import Collection

1. Open Postman Desktop or Web
2. Click **Import** button (top left)
3. Drag & drop `postman/MediaPipe_Backend_API.postman_collection.json`
4. Click **Import**

## Before Testing

### 1. Start the Server
```bash
cd "mediapipe-backend"
node src/app.js
```

Server should show:
```
Server running at http://localhost:3000
```

### 2. Verify Server is Running
Open browser: http://localhost:3000/health

Should return:
```json
{"status":"OK","timestamp":"...","uptime":...}
```

## Using the Collection

### 1. Check Base URL Variable
- Click on collection name
- Go to **Variables** tab
- Ensure `base_url` = `http://localhost:3000`

### 2. Run Simple Test
- Click "Health Check" request
- Click **Send** button
- Check response body
- Check **Test Results** tab (should show green ✅)

### 3. Run All Tests
- Right-click collection name
- Select **Run collection**
- Click **Run MediaPipe Keypoint Backend API**
- View test results

## Common Issues

### Issue 1: Connection Refused
**Error:** `Could not get any response`
**Solution:** Start the server with `node src/app.js`

### Issue 2: 404 Not Found
**Error:** Status 404
**Solution:** Check base_url variable is set to `http://localhost:3000`

### Issue 3: Tests Not Showing
**Problem:** No test results tab
**Solution:** 
- Tests are in the collection
- Click **Test Results** tab after sending request
- Should show ✅ for passing tests

### Issue 4: Variables Not Working
**Error:** `{{keypoint_id}}` shows as literal text
**Solution:**
- First run "Extract Pose from Image" request
- This will auto-save keypoint_id and image_id
- Then other requests will use these variables

### Issue 5: Extract Pose Fails
**Error:** Missing file
**Solution:**
- In "Extract Pose from Image" request
- Go to **Body** tab
- Under `image` field, click **Select Files**
- Choose a person image (JPEG/PNG)
- Click **Send**

## Test Endpoints Manually

```bash
# Health Check
curl http://localhost:3000/health

# API Info
curl http://localhost:3000/api

# Get All Keypoints
curl http://localhost:3000/api/keypoints

# Get All Images
curl http://localhost:3000/api/images

# List Backups
curl http://localhost:3000/api/backup
```

## Expected Test Results

Each request should show:
- ✅ Status code is XXX
- ✅ Response structure tests
- ✅ Data validation tests

Example for Health Check:
- ✅ Status code is 200
- ✅ Response has correct structure
- ✅ Server status is OK

## Still Having Issues?

1. Check PostgreSQL is running: `pg_isready`
2. Check MongoDB is running: `mongosh --eval "db.version()"`
3. Check .env file exists and has correct values
4. Check server logs for errors
5. Try running: `npm install` to reinstall dependencies

## Need Help?

Check server is responding:
```bash
curl -v http://localhost:3000/health
```

Check if port 3000 is in use:
```bash
lsof -i :3000
```
