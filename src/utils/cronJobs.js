const cron = require('node-cron');
const backupService = require('../services/backupService');
const emailService = require('../services/emailService');
require('dotenv').config();

class CronJobs {
    constructor() {
        this.jobs = [];
    }

    init() {
        this.setupDailyBackup();
        console.log('Cron jobs initialized');
    }

    setupDailyBackup() {
        const schedule = process.env.CRON_SCHEDULE || '59 23 * * *';
        
        const job = cron.schedule(schedule, async () => {
            console.log('Daily backup started:', new Date().toISOString());

            try {
                const result = await backupService.createBackup();
                
                try {
                    await emailService.sendBackupEmail(result.path, result.date);
                    console.log('Backup email sent');
                } catch (emailError) {
                    console.error('Email failed:', emailError.message);
                }

                backupService.cleanOldBackups(7);
                console.log('Daily backup completed');

            } catch (error) {
                console.error('Backup failed:', error.message);
            }
        }, {
            scheduled: true,
            timezone: 'Asia/Kolkata'
        });

        this.jobs.push({ name: 'dailyBackup', job, schedule });
        console.log(`Daily backup scheduled: ${schedule}`);
    }

    stopAll() {
        this.jobs.forEach(({ name, job }) => {
            job.stop();
            console.log(`Stopped: ${name}`);
        });
    }
}

module.exports = new CronJobs();
