CREATE DATABASE mediapipe_db;

\c mediapipe_db

CREATE TABLE keypoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "imageId" VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    keypoints JSONB NOT NULL,
    "keypointCount" INTEGER NOT NULL DEFAULT 33,
    "processingTime" FLOAT,
    confidence FLOAT,
    metadata JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_keypoints_image_id ON keypoints("imageId");
CREATE INDEX idx_keypoints_created_at ON keypoints("createdAt");

INSERT INTO keypoints (id, "imageId", filename, keypoints, "keypointCount", "processingTime", confidence, metadata)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '507f1f77bcf86cd799439011',
    'sample.jpg',
    '[{"id":0,"name":"nose","x":0.52,"y":0.23,"z":-0.01,"visibility":0.99}]',
    33,
    245.67,
    0.87,
    '{"originalName":"test.jpg","mimeType":"image/jpeg"}'
);
