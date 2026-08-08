import { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (file) => {
    if (file) {
      setImage(file);
      setResult([]);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      alert("Please select an image first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/detect",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Detection failed");
      }

      const data = await response.json();

      /*
        This handles both:
        1. Already grouped results
        2. Individual YOLO detections
      */

      if (
        Array.isArray(data) &&
        data.length > 0 &&
        data[0].count !== undefined
      ) {
        setResult(data);
      } else if (Array.isArray(data)) {
        const grouped = {};

        data.forEach((item) => {
          const objectName = item.object;
          const confidence = Number(item.confidence);

          if (!grouped[objectName]) {
            grouped[objectName] = {
              object: objectName,
              count: 0,
              confidence: confidence,
            };
          }

          grouped[objectName].count += 1;

          if (confidence > grouped[objectName].confidence) {
            grouped[objectName].confidence = confidence;
          }
        });

        setResult(Object.values(grouped));
      } else {
        setResult([]);
      }

    } catch (error) {
      console.log(error);
      alert("Backend connection error");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (objectName) => {
    const name = objectName.toLowerCase();

    if (name === "car") return "🚗";
    if (name === "person") return "👤";
    if (name === "bus") return "🚌";
    if (name === "truck") return "🚚";
    if (name === "bicycle") return "🚲";
    if (name === "motorcycle") return "🏍️";
    if (name === "traffic light") return "🚦";
    if (name === "dog") return "🐕";
    if (name === "cat") return "🐈";

    return "🔹";
  };

  return (
    <div className="app">

      {/* ================= HEADER ================= */}

      <header className="header">

        <div>
          <h1>👁️ Vision AI</h1>

          <p>
            AI-Powered Object Detection System
          </p>
        </div>

        <div className="status">
          🟢 Model Online
        </div>

      </header>


      {/* ================= DASHBOARD ================= */}

      <div className="dashboard">


        {/* ================= UPLOAD CARD ================= */}

        <div className="card upload-card">

          <h2>Upload Image</h2>

          <div className="ai-upload-panel">

            <div className="ai-upload-icon">
              ⌖
            </div>


            {!image ? (

              <>
                <h3>AI IMAGE ANALYZER</h3>

                <p>
                  Select an image to analyze
                </p>

                <p className="upload-description">
                  Detect objects with intelligent vision
                </p>


                <label className="select-image-btn">

                  Select Image

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      handleImageChange(
                        e.target.files[0]
                      )
                    }
                  />

                </label>


                <span className="format-text">
                  JPG • PNG • JPEG supported
                </span>
              </>

            ) : (

              <>
                <div className="success-icon">
                  ✓
                </div>

                <h3>IMAGE READY</h3>

                <p className="selected-file">
                  {image.name}
                </p>

                <p className="ready-message">
                  Ready for AI Detection
                </p>


                <label className="change-image-btn">

                  ↻ Change Image

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      handleImageChange(
                        e.target.files[0]
                      )
                    }
                  />

                </label>
              </>

            )}

          </div>


          {/* ================= PREVIEW ================= */}

          {image && (
            <img
              src={URL.createObjectURL(image)}
              className="preview"
              alt="Selected preview"
            />
          )}


          {/* ================= DETECT BUTTON ================= */}

          <button
            className="detect-btn"
            onClick={uploadImage}
            disabled={loading}
          >

            {loading
              ? "🔍 Analyzing..."
              : "✨ Detect Objects"
            }

          </button>

        </div>


        {/* ================= RESULT CARD ================= */}

        <div className="card">

          <h2>Detection Result</h2>


          {result.length === 0 ? (

            <p className="empty">
              No objects detected yet
            </p>

          ) : (

            result.map((item, index) => (

              <div
                className="result"
                key={index}
              >

                <div className="result-left">

                  <span className="object-icon">
                    {getIcon(item.object)}
                  </span>

                  <div>

                    <b>
                      {item.object}
                    </b>

                    <p>
                      {item.count} detected
                    </p>

                  </div>

                </div>


                <div className="confidence">

                  Highest confidence:{" "}

                  {Number(item.confidence).toFixed(2)}

                </div>

              </div>

            ))

          )}

        </div>

      </div>


      {/* ================= FOOTER ================= */}

      <footer>
        Powered by YOLOv8 | React | AI Vision System
      </footer>

    </div>
  );
}

export default App;