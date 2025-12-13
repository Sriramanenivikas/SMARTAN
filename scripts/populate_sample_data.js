const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Image = require('../src/models/Image');
const Keypoint = require('../src/models/Keypoint');

const sequelize = new Sequelize(
    process.env.PG_DATABASE,
    process.env.PG_USER,
    process.env.PG_PASSWORD,
    {
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        dialect: 'postgres',
        logging: false
    }
);

const sampleKeypoints = [
    { id: 0, name: "nose", x: 0.520123, y: 0.234567, z: -0.012345, visibility: 0.998765, pixel_x: 499, pixel_y: 253 },
    { id: 1, name: "left_eye_inner", x: 0.532456, y: 0.219876, z: -0.015678, visibility: 0.997234, pixel_x: 511, pixel_y: 237 },
    { id: 2, name: "left_eye", x: 0.538901, y: 0.220345, z: -0.016234, visibility: 0.996543, pixel_x: 517, pixel_y: 238 },
    { id: 11, name: "left_shoulder", x: 0.598234, y: 0.387654, z: -0.034567, visibility: 0.989876, pixel_x: 574, pixel_y: 418 },
    { id: 12, name: "right_shoulder", x: 0.442876, y: 0.391234, z: -0.035678, visibility: 0.988765, pixel_x: 425, pixel_y: 422 },
    { id: 23, name: "left_hip", x: 0.587345, y: 0.623456, z: -0.045678, visibility: 0.985432, pixel_x: 563, pixel_y: 673 },
    { id: 24, name: "right_hip", x: 0.453678, y: 0.627890, z: -0.046789, visibility: 0.984321, pixel_x: 435, pixel_y: 678 }
];

async function populateData() {
    try {
        console.log('Connecting to databases...');
        await mongoose.connect(process.env.MONGODB_URI);
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        
        console.log('Connected successfully\n');

        await Image.deleteMany({});
        await Keypoint.destroy({ where: {} });
        console.log('Cleared existing data\n');

        const testImagesDir = path.join(__dirname, '../test_images');
        const imageFiles = fs.readdirSync(testImagesDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));

        console.log(`Found ${imageFiles.length} test images\n`);

        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            const filePath = path.join(testImagesDir, file);
            const imageBuffer = fs.readFileSync(filePath);
            const stats = fs.statSync(filePath);

            console.log(`Processing: ${file}`);

            const imageDoc = new Image({
                filename: file,
                originalName: file,
                mimeType: 'image/jpeg',
                size: stats.size,
                imageData: imageBuffer,
                width: 960,
                height: 1080
            });
            await imageDoc.save();

            const keypointDoc = await Keypoint.create({
                imageId: imageDoc._id.toString(),
                filename: file,
                keypoints: sampleKeypoints,
                keypointCount: 33,
                processingTime: 245.67 + (i * 10),
                confidence: 0.87 + (i * 0.02),
                metadata: {
                    originalName: file,
                    mimeType: 'image/jpeg',
                    imageWidth: 960,
                    imageHeight: 1080,
                    description: `Sample pose from ${file}`
                }
            });

            imageDoc.keypointId = keypointDoc.id;
            await imageDoc.save();

            console.log(`✓ Created keypoint ID: ${keypointDoc.id}`);
            console.log(`✓ Created image ID: ${imageDoc._id}\n`);
        }

        console.log('Sample data populated successfully!');
        console.log(`Total records created: ${imageFiles.length}\n`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

populateData();
