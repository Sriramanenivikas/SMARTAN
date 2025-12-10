import sys
import json
import os
import time
import warnings

warnings.filterwarnings('ignore')
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import cv2
import mediapipe as mp
import numpy as np

mp_pose = mp.solutions.pose

LANDMARK_NAMES = [
    "nose", "left_eye_inner", "left_eye", "left_eye_outer",
    "right_eye_inner", "right_eye", "right_eye_outer",
    "left_ear", "right_ear", "mouth_left", "mouth_right",
    "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
    "left_wrist", "right_wrist", "left_pinky", "right_pinky",
    "left_index", "right_index", "left_thumb", "right_thumb",
    "left_hip", "right_hip", "left_knee", "right_knee",
    "left_ankle", "right_ankle", "left_heel", "right_heel",
    "left_foot_index", "right_foot_index"
]

def extract_keypoints(image_path):
    start_time = time.time()
    
    if not os.path.exists(image_path):
        return json.dumps({"success": False, "error": f"Image file not found: {image_path}"})
    
    image = cv2.imread(image_path)
    if image is None:
        return json.dumps({"success": False, "error": "Failed to read image file"})
    
    height, width, _ = image.shape
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    with mp_pose.Pose(
        static_image_mode=True,
        model_complexity=2,
        enable_segmentation=False,
        min_detection_confidence=0.5
    ) as pose:
        
        results = pose.process(image_rgb)
        
        if not results.pose_landmarks:
            return json.dumps({
                "success": False,
                "error": "No pose detected in the image",
                "processingTime": (time.time() - start_time) * 1000
            })
        
        keypoints = []
        total_visibility = 0
        
        for idx, landmark in enumerate(results.pose_landmarks.landmark):
            keypoint = {
                "id": idx,
                "name": LANDMARK_NAMES[idx] if idx < len(LANDMARK_NAMES) else f"landmark_{idx}",
                "x": round(landmark.x, 6),
                "y": round(landmark.y, 6),
                "z": round(landmark.z, 6),
                "visibility": round(landmark.visibility, 6),
                "pixel_x": int(landmark.x * width),
                "pixel_y": int(landmark.y * height)
            }
            keypoints.append(keypoint)
            total_visibility += landmark.visibility
        
        avg_confidence = total_visibility / len(keypoints) if keypoints else 0
        processing_time = (time.time() - start_time) * 1000
        
        return json.dumps({
            "success": True,
            "keypointCount": len(keypoints),
            "keypoints": keypoints,
            "imageWidth": width,
            "imageHeight": height,
            "averageConfidence": round(avg_confidence, 4),
            "processingTime": round(processing_time, 2)
        })

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "Usage: python extract_pose.py <image_path>"}))
        sys.exit(1)
    
    result = extract_keypoints(sys.argv[1])
    print(result)
