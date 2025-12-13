-- MediaPipe Backend PostgreSQL Schema and Sample Data
-- Database: mediapipe_db

-- Create database (run as superuser)
CREATE DATABASE mediapipe_db;

\c mediapipe_db

-- Create keypoints table
CREATE TABLE IF NOT EXISTS keypoints (
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_keypoints_image_id ON keypoints("imageId");
CREATE INDEX IF NOT EXISTS idx_keypoints_created_at ON keypoints("createdAt");
CREATE INDEX IF NOT EXISTS idx_keypoints_confidence ON keypoints(confidence);

-- Sample data insert (abbreviated keypoints for readability)
INSERT INTO keypoints (
    id, 
    "imageId", 
    filename, 
    keypoints, 
    "keypointCount", 
    "processingTime", 
    confidence, 
    metadata
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '507f1f77bcf86cd799439011',
    'sample-yoga-pose.jpg',
    '[
        {"id": 0, "name": "nose", "x": 0.520, "y": 0.230, "z": -0.010, "visibility": 0.99, "pixel_x": 499, "pixel_y": 248},
        {"id": 1, "name": "left_eye_inner", "x": 0.510, "y": 0.220, "z": -0.012, "visibility": 0.99, "pixel_x": 489, "pixel_y": 237},
        {"id": 2, "name": "left_eye", "x": 0.505, "y": 0.218, "z": -0.013, "visibility": 0.99, "pixel_x": 484, "pixel_y": 235},
        {"id": 3, "name": "left_eye_outer", "x": 0.500, "y": 0.216, "z": -0.014, "visibility": 0.99, "pixel_x": 479, "pixel_y": 233},
        {"id": 4, "name": "right_eye_inner", "x": 0.530, "y": 0.220, "z": -0.012, "visibility": 0.99, "pixel_x": 508, "pixel_y": 237},
        {"id": 5, "name": "right_eye", "x": 0.535, "y": 0.218, "z": -0.013, "visibility": 0.99, "pixel_x": 513, "pixel_y": 235},
        {"id": 6, "name": "right_eye_outer", "x": 0.540, "y": 0.216, "z": -0.014, "visibility": 0.99, "pixel_x": 518, "pixel_y": 233},
        {"id": 7, "name": "left_ear", "x": 0.490, "y": 0.225, "z": -0.008, "visibility": 0.98, "pixel_x": 470, "pixel_y": 243},
        {"id": 8, "name": "right_ear", "x": 0.550, "y": 0.225, "z": -0.008, "visibility": 0.98, "pixel_x": 528, "pixel_y": 243},
        {"id": 9, "name": "mouth_left", "x": 0.510, "y": 0.250, "z": -0.005, "visibility": 0.99, "pixel_x": 489, "pixel_y": 270},
        {"id": 10, "name": "mouth_right", "x": 0.530, "y": 0.250, "z": -0.005, "visibility": 0.99, "pixel_x": 508, "pixel_y": 270},
        {"id": 11, "name": "left_shoulder", "x": 0.400, "y": 0.350, "z": 0.010, "visibility": 0.95, "pixel_x": 384, "pixel_y": 378},
        {"id": 12, "name": "right_shoulder", "x": 0.600, "y": 0.350, "z": 0.010, "visibility": 0.95, "pixel_x": 576, "pixel_y": 378},
        {"id": 13, "name": "left_elbow", "x": 0.350, "y": 0.450, "z": 0.020, "visibility": 0.90, "pixel_x": 336, "pixel_y": 486},
        {"id": 14, "name": "right_elbow", "x": 0.650, "y": 0.450, "z": 0.020, "visibility": 0.90, "pixel_x": 624, "pixel_y": 486},
        {"id": 15, "name": "left_wrist", "x": 0.300, "y": 0.550, "z": 0.030, "visibility": 0.85, "pixel_x": 288, "pixel_y": 594},
        {"id": 16, "name": "right_wrist", "x": 0.700, "y": 0.550, "z": 0.030, "visibility": 0.85, "pixel_x": 672, "pixel_y": 594},
        {"id": 17, "name": "left_pinky", "x": 0.290, "y": 0.560, "z": 0.035, "visibility": 0.80, "pixel_x": 278, "pixel_y": 605},
        {"id": 18, "name": "right_pinky", "x": 0.710, "y": 0.560, "z": 0.035, "visibility": 0.80, "pixel_x": 682, "pixel_y": 605},
        {"id": 19, "name": "left_index", "x": 0.295, "y": 0.565, "z": 0.033, "visibility": 0.82, "pixel_x": 283, "pixel_y": 610},
        {"id": 20, "name": "right_index", "x": 0.705, "y": 0.565, "z": 0.033, "visibility": 0.82, "pixel_x": 677, "pixel_y": 610},
        {"id": 21, "name": "left_thumb", "x": 0.310, "y": 0.555, "z": 0.028, "visibility": 0.83, "pixel_x": 298, "pixel_y": 599},
        {"id": 22, "name": "right_thumb", "x": 0.690, "y": 0.555, "z": 0.028, "visibility": 0.83, "pixel_x": 662, "pixel_y": 599},
        {"id": 23, "name": "left_hip", "x": 0.450, "y": 0.600, "z": 0.005, "visibility": 0.93, "pixel_x": 432, "pixel_y": 648},
        {"id": 24, "name": "right_hip", "x": 0.550, "y": 0.600, "z": 0.005, "visibility": 0.93, "pixel_x": 528, "pixel_y": 648},
        {"id": 25, "name": "left_knee", "x": 0.430, "y": 0.750, "z": 0.010, "visibility": 0.88, "pixel_x": 413, "pixel_y": 810},
        {"id": 26, "name": "right_knee", "x": 0.570, "y": 0.750, "z": 0.010, "visibility": 0.88, "pixel_x": 547, "pixel_y": 810},
        {"id": 27, "name": "left_ankle", "x": 0.420, "y": 0.900, "z": 0.015, "visibility": 0.75, "pixel_x": 403, "pixel_y": 972},
        {"id": 28, "name": "right_ankle", "x": 0.580, "y": 0.900, "z": 0.015, "visibility": 0.75, "pixel_x": 557, "pixel_y": 972},
        {"id": 29, "name": "left_heel", "x": 0.415, "y": 0.910, "z": 0.020, "visibility": 0.70, "pixel_x": 398, "pixel_y": 983},
        {"id": 30, "name": "right_heel", "x": 0.585, "y": 0.910, "z": 0.020, "visibility": 0.70, "pixel_x": 562, "pixel_y": 983},
        {"id": 31, "name": "left_foot_index", "x": 0.410, "y": 0.920, "z": 0.018, "visibility": 0.72, "pixel_x": 394, "pixel_y": 994},
        {"id": 32, "name": "right_foot_index", "x": 0.590, "y": 0.920, "z": 0.018, "visibility": 0.72, "pixel_x": 566, "pixel_y": 994}
    ]',
    33,
    245.67,
    0.87,
    '{"originalName": "yoga_pose.jpg", "mimeType": "image/jpeg", "imageWidth": 640, "imageHeight": 427, "label": "Yoga Pose", "category": "fitness"}'
);

-- Verify insert
SELECT id, filename, "keypointCount", confidence, "createdAt" FROM keypoints;
