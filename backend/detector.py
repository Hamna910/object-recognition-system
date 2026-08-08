from ultralytics import YOLO

# Model ek dafa load hoga
model = YOLO("yolov8n.pt")

print("YOLO Model Loaded Successfully!")


def detect_objects(image_path):

    results = model(image_path)

    detected_objects = []

    for result in results:
        for box in result.boxes:

            class_id = int(box.cls[0])
            class_name = model.names[class_id]

            confidence = float(box.conf[0])

            detected_objects.append({
                "object": class_name,
                "confidence": round(confidence, 2)
            })

    return detected_objects