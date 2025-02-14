from deepface import DeepFace
import cv2
import os
from collections import Counter

def analyze_video(video_path):
    # Open the video file
    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    emotions = []  # List to store detected emotions

    if not cap.isOpened():
        print("Error: Cannot open the video file.")
        return

    while True:
        # Read frames from the video
        ret, frame = cap.read()

        # If no frame is returned, video has ended
        if not ret:
            break

        frame_count += 1

        # Save the frame temporarily to analyze
        frame_path = f"frame_{frame_count}.jpg"
        cv2.imwrite(frame_path, frame)

        try:
            # Analyze the frame for emotions (with enforce_detection=False)
            result = DeepFace.analyze(img_path=frame_path, actions=['emotion'], enforce_detection=False)

            # If multiple faces are detected, result will be a list
            if isinstance(result, list):
                # Get the first face's emotion result
                dominant_emotion = result[0]['dominant_emotion']
            else:
                # Single face detected
                dominant_emotion = result['dominant_emotion']

            # Append the detected emotion to the emotions list
            emotions.append(dominant_emotion)

        except Exception as e:
            print(f"Error analyzing frame {frame_count}: {str(e)}")

        # Clean up by removing the temporary frame file
        os.remove(frame_path)

    # Release the video capture object
    cap.release()
    cv2.destroyAllWindows()

    # Count the occurrences of each emotion
    emotion_counts = Counter(emotions)

    # Get the most common emotion
    final_emotion = emotion_counts.most_common(1)[0]  # Most frequent emotion

    # Print the final emotion and its count
    print(f"Final Dominant Emotion: {final_emotion[0]} (Detected {final_emotion[1]} times)")

# Path to your video file
video_path = "D:/Face Videos/3.mp4"

# Run the video analysis
analyze_video(video_path)
