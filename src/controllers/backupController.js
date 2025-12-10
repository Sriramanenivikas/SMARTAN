const backupService = require('../services/backupService');
const emailService = require('../services/emailService');
const path = require('path');
const fs = require('fs');

class BackupController {
    async createBackup(req, res) {
        try {
            const result = await backupService.createBackup();

            if (req.body.sendEmail) {
                try {
                    await emailService.sendBackupEmail(result.path, result.date);
                    result.emailSent = true;
                } catch (emailError) {
                    result.emailSent = false;
                    result.emailError = emailError.message;
                }
            }

            res.json({ success: true, message: 'Backup created', data: result });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async listBackups(req, res) {
        try {
            const backups = backupService.listBackups();
            res.json({ success: true, data: backups, count: backups.length });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async downloadBackup(req, res) {
        try {
            const { filename } = req.params;
            const backupDir = process.env.BACKUP_DIR || './backup';
            const filePath = path.join(backupDir, filename);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ success: false, error: 'Backup not found' });
            }
            res.download(filePath, filename);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async deleteBackup(req, res) {
        try {
            const { filename } = req.params;
            const backupDir = process.env.BACKUP_DIR || './backup';
            const filePath = path.join(backupDir, filename);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ success: false, error: 'Backup not found' });
            }
            fs.unlinkSync(filePath);
            res.json({ success: true, message: 'Backup deleted' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async cleanOldBackups(req, res) {
        try {
            const { keepDays = 7 } = req.body;
            const deleted = backupService.cleanOldBackups(keepDays);
            res.json({ success: true, message: `Deleted ${deleted} old backup(s)`, deletedCount: deleted });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async testEmail(req, res) {
        try {
            await emailService.sendTestEmail();
            res.json({ success: true, message: 'Test email sent' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = new BackupController();
