const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');

router.post('/', backupController.createBackup);
router.get('/', backupController.listBackups);
router.get('/:filename', backupController.downloadBackup);
router.delete('/:filename', backupController.deleteBackup);
router.post('/clean', backupController.cleanOldBackups);
router.post('/test-email', backupController.testEmail);

module.exports = router;
