const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    imageData: { type: Buffer, required: true },
    width: { type: Number },
    height: { type: Number },
    keypointId: { type: String },
    uploadedAt: { type: Date, default: Date.now },
    metadata: { type: mongoose.Schema.Types.Mixed }
}, {
    timestamps: true,
    collection: 'images'
});

imageSchema.index({ filename: 1 });
imageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Image', imageSchema);
