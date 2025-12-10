const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Keypoint = require('../models/Keypoint');
const Image = require('../models/Image');

class BackupService {
    constructor() {
        this.backupDir = process.env.BACKUP_DIR || './backup';
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }

    getDateString() {
        return new Date().toISOString().split('T')[0];
    }

    async exportPostgreSQLData() {
        const keypoints = await Keypoint.findAll();
        return JSON.stringify(keypoints, null, 2);
    }

    async exportMongoDBData() {
        const images = await Image.find({}).select('-imageData');
        return JSON.stringify(images, null, 2);
    }

    async exportMongoDBImages(tempDir) {
        const images = await Image.find({});
        const imagesDir = path.join(tempDir, 'images');
        fs.mkdirSync(imagesDir, { recursive: true });

        for (const image of images) {
            if (image.imageData) {
                fs.writeFileSync(path.join(imagesDir, image.filename), image.imageData);
            }
        }
        return images.length;
    }

    async createBackup() {
        const dateString = this.getDateString();
        const zipFilename = `${dateString}-backup.zip`;
        const zipPath = path.join(this.backupDir, zipFilename);
        const tempDir = path.join(this.backupDir, `temp-${dateString}`);

        try {
            fs.mkdirSync(tempDir, { recursive: true });

            const pgData = await this.exportPostgreSQLData();
            fs.writeFileSync(path.join(tempDir, 'postgresql_keypoints.json'), pgData);

            const mongoData = await this.exportMongoDBData();
            fs.writeFileSync(path.join(tempDir, 'mongodb_images_metadata.json'), mongoData);

            const imageCount = await this.exportMongoDBImages(tempDir);

            const backupInfo = {
                date: dateString,
                timestamp: new Date().toISOString(),
                postgresqlRecords: JSON.parse(pgData).length,
                mongodbRecords: JSON.parse(mongoData).length,
                imagesExported: imageCount
            };
            fs.writeFileSync(path.join(tempDir, 'backup_info.json'), JSON.stringify(backupInfo, null, 2));

            await this.createZipArchive(tempDir, zipPath);
            fs.rmSync(tempDir, { recursive: true, force: true });

            const stats = fs.statSync(zipPath);
            return {
                success: true,
                filename: zipFilename,
                path: zipPath,
                size: stats.size,
                date: dateString
            };
        } catch (error) {
            if (fs.existsSync(tempDir)) {
                fs.rmSync(tempDir, { recursive: true, force: true });
            }
            throw error;
        }
    }

    createZipArchive(sourceDir, outputPath) {
        return new Promise((resolve, reject) => {
            const output = fs.createWriteStream(outputPath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => resolve(archive.pointer()));
            archive.on('error', reject);

            archive.pipe(output);
            archive.directory(sourceDir, false);
            archive.finalize();
        });
    }

    listBackups() {
        return fs.readdirSync(this.backupDir)
            .filter(f => f.endsWith('-backup.zip'))
            .map(f => {
                const stats = fs.statSync(path.join(this.backupDir, f));
                return { filename: f, size: stats.size, created: stats.birthtime };
            })
            .sort((a, b) => b.created - a.created);
    }

    cleanOldBackups(keepDays = 7) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - keepDays);

        let deleted = 0;
        fs.readdirSync(this.backupDir)
            .filter(f => f.endsWith('-backup.zip'))
            .forEach(file => {
                const filePath = path.join(this.backupDir, file);
                if (fs.statSync(filePath).birthtime < cutoffDate) {
                    fs.unlinkSync(filePath);
                    deleted++;
                }
            });
        return deleted;
    }
}

module.exports = new BackupService();
