const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

router.get('/', imageController.getAllImages);
router.get('/:id', imageController.getImageById);
router.get('/:id/file', imageController.getImageFile);
router.get('/:id/download', imageController.downloadImage);
router.put('/:id', imageController.updateImage);
router.delete('/:id', imageController.deleteImage);

module.exports = router;
