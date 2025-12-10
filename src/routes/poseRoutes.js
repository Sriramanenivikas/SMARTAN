const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const poseController = require('../controllers/poseController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
    filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`)
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/extract-pose', upload.single('image'), poseController.extractPose);
router.get('/keypoints', poseController.getAllKeypoints);
router.get('/keypoints/:id', poseController.getKeypointById);
router.put('/keypoints/:id', poseController.updateKeypoint);
router.delete('/keypoints/:id', poseController.deleteKeypoint);

module.exports = router;
