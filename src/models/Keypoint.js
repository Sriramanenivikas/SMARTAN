const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Keypoint = sequelize.define('Keypoint', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    imageId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false
    },
    keypoints: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    keypointCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 33
    },
    processingTime: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    confidence: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    metadata: {
        type: DataTypes.JSONB,
        allowNull: true
    }
}, {
    tableName: 'keypoints',
    timestamps: true,
    indexes: [{ fields: ['imageId'] }, { fields: ['createdAt'] }]
});

module.exports = Keypoint;
