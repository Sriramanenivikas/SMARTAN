const Keypoint = require('../models/Keypoint');
const Image = require('../models/Image');
const mediapipeService = require('../services/mediapipeService');
const fs = require('fs');

class PoseController {
    async extractPose(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, error: 'No image file uploaded' });
            }

            const imagePath = req.file.path;
            const filename = req.file.filename;

            const keypointResult = await mediapipeService.extractKeypoints(imagePath);

            if (!keypointResult.success) {
                fs.unlinkSync(imagePath);
                return res.status(400).json(keypointResult);
            }

            const imageBuffer = fs.readFileSync(imagePath);

            const imageDoc = new Image({
                filename,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
                imageData: imageBuffer,
                width: keypointResult.imageWidth,
                height: keypointResult.imageHeight
            });
            await imageDoc.save();

            const keypointDoc = await Keypoint.create({
                imageId: imageDoc._id.toString(),
                filename,
                keypoints: keypointResult.keypoints,
                keypointCount: keypointResult.keypointCount,
                processingTime: keypointResult.processingTime,
                confidence: keypointResult.averageConfidence,
                metadata: {
                    originalName: req.file.originalname,
                    mimeType: req.file.mimetype,
                    imageWidth: keypointResult.imageWidth,
                    imageHeight: keypointResult.imageHeight
                }
            });

            imageDoc.keypointId = keypointDoc.id;
            await imageDoc.save();

            fs.unlinkSync(imagePath);

            res.status(201).json({
                success: true,
                message: 'Pose extracted and stored successfully',
                data: {
                    keypointId: keypointDoc.id,
                    imageId: imageDoc._id,
                    filename,
                    keypointCount: keypointResult.keypointCount,
                    confidence: keypointResult.averageConfidence,
                    processingTime: keypointResult.processingTime,
                    keypoints: keypointResult.keypoints
                }
            });

        } catch (error) {
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getAllKeypoints(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const { count, rows } = await Keypoint.findAndCountAll({
                limit: parseInt(limit),
                offset,
                order: [['createdAt', 'DESC']]
            });

            res.json({
                success: true,
                data: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getKeypointById(req, res) {
        try {
            const keypoint = await Keypoint.findByPk(req.params.id);
            if (!keypoint) {
                return res.status(404).json({ success: false, error: 'Keypoint not found' });
            }
            res.json({ success: true, data: keypoint });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateKeypoint(req, res) {
        try {
            const keypoint = await Keypoint.findByPk(req.params.id);
            if (!keypoint) {
                return res.status(404).json({ success: false, error: 'Keypoint not found' });
            }

            const { metadata } = req.body;
            if (metadata) {
                keypoint.metadata = { ...keypoint.metadata, ...metadata };
            }
            await keypoint.save();

            res.json({ success: true, message: 'Keypoint updated', data: keypoint });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async deleteKeypoint(req, res) {
        try {
            const keypoint = await Keypoint.findByPk(req.params.id);
            if (!keypoint) {
                return res.status(404).json({ success: false, error: 'Keypoint not found' });
            }

            if (keypoint.imageId) {
                await Image.findByIdAndDelete(keypoint.imageId);
            }
            await keypoint.destroy();

            res.json({ success: true, message: 'Keypoint and image deleted' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = new PoseController();
