from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from detector import detect_objects
import os

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Object Recognition API is Running!"}


@app.post("/detect")
async def detect(image: UploadFile = File(...)):

    print("Detect API Called!")

    try:
        upload_folder = "/tmp"
        os.makedirs(upload_folder, exist_ok=True)

        image_path = os.path.join(upload_folder, "upload.jpg")

        image_data = await image.read()

        with open(image_path, "wb") as f:
            f.write(image_data)

        print("Image Saved:", image_path)

        print("Starting YOLO Detection...")

        result = detect_objects(image_path)

        print("Detection Completed!")
        print(result)

        return result

    except Exception as e:
        print("ERROR:", e)

        return {
            "error": str(e)
        }