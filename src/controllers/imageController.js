const Image = require('../models/Image');

class ImageController {
    async getAllImages(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;

            const images = await Image.find({})
                .select('-imageData')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            const total = await Image.countDocuments();

            res.json({
                success: true,
                data: images,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getImageById(req, res) {
        try {
            const image = await Image.findById(req.params.id).select('-imageData');
            if (!image) {
                return res.status(404).json({ success: false, error: 'Image not found' });
            }
            res.json({ success: true, data: image });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getImageFile(req, res) {
        try {
            const image = await Image.findById(req.params.id);
            if (!image) {
                return res.status(404).json({ success: false, error: 'Image not found' });
            }
            res.set('Content-Type', image.mimeType);
            res.set('Content-Disposition', `inline; filename="${image.originalName}"`);
            res.send(image.imageData);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async downloadImage(req, res) {
        try {
            const image = await Image.findById(req.params.id);
            if (!image) {
                return res.status(404).json({ success: false, error: 'Image not found' });
            }
            res.set('Content-Type', image.mimeType);
            res.set('Content-Disposition', `attachment; filename="${image.originalName}"`);
            res.send(image.imageData);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateImage(req, res) {
        try {
            const { metadata } = req.body;
            const image = await Image.findByIdAndUpdate(
                req.params.id,
                { metadata },
                { new: true }
            ).select('-imageData');

            if (!image) {
                return res.status(404).json({ success: false, error: 'Image not found' });
            }
            res.json({ success: true, message: 'Image updated', data: image });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async deleteImage(req, res) {
        try {
            const image = await Image.findByIdAndDelete(req.params.id);
            if (!image) {
                return res.status(404).json({ success: false, error: 'Image not found' });
            }
            res.json({ success: true, message: 'Image deleted' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = new ImageController();
