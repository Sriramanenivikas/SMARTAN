const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendBackupEmail(zipFilePath, date) {
        const filename = path.basename(zipFilePath);
        
        if (!fs.existsSync(zipFilePath)) {
            throw new Error(`ZIP file not found: ${zipFilePath}`);
        }

        const fileStats = fs.statSync(zipFilePath);
        const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO,
            subject: `Daily DB Backup - ${date}`,
            html: `
                <h2>Daily Database Backup</h2>
                <p>Backup completed successfully.</p>
                <ul>
                    <li>Date: ${date}</li>
                    <li>File: ${filename}</li>
                    <li>Size: ${fileSizeMB} MB</li>
                </ul>
            `,
            attachments: [{ filename, path: zipFilePath }]
        };

        const info = await this.transporter.sendMail(mailOptions);
        console.log(`Backup email sent: ${info.messageId}`);
        return info;
    }

    async sendTestEmail() {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO,
            subject: 'MediaPipe Backend - Email Test',
            html: '<p>Email configuration is working.</p>'
        };
        return await this.transporter.sendMail(mailOptions);
    }
}

module.exports = new EmailService();
