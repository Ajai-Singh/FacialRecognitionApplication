import React, { useState, useEffect } from 'react';
import './App.css';
import * as faceapi from 'face-api.js';

function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [processingImages, setProcessingImages] = useState([]);

  useEffect(() => {
    const annotateImageWithFaces = async () => {
      if (selectedImage) {
        // Load face-api.js models
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');

        // Detect faces in the selected image
        const imageElement = document.createElement('img');
        imageElement.src = selectedImage.url;
        await imageElement.decode();

        // Use face-api.js to detect faces
        const detections = await faceapi.detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();

        // Annotate the sidebar thumbnail
        const numFaces = detections.length;
        setImages((prevImages) =>
          prevImages.map((image) =>
            //if num faces length - 1 display String 'face' else display String faces 
            image === selectedImage ? { ...image, annotation: `${numFaces} ${numFaces === 1 ? 'face' : 'faces'}` } : image
          )
        );

        // Display the full-sized image with bounding boxes around detected faces
        const canvas = faceapi.createCanvasFromMedia(imageElement);
        faceapi.draw.drawDetections(canvas, detections);
        document.querySelector('.main-area').innerHTML = '';
        document.querySelector('.main-area').appendChild(canvas);
      }
    };

    if (selectedImage && processingImages.includes(selectedImage)) {
      annotateImageWithFaces();
      // start processing time
      setTimeout(() => {
        // Update processingImages to remove the processed image
        setProcessingImages((currentProcessingImages) =>
          currentProcessingImages.filter((image) => image !== selectedImage)
        );
      }, 3000);
    }
  }, [selectedImage, processingImages]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          url: e.target.result,
          name: file.name,
        };

        // Add the image to processingImages
        setProcessingImages((currentProcessingImages) => [...currentProcessingImages, imageData]);

        // Set the selected image
        setSelectedImage(imageData);

        // Add the image to the images state
        setImages([...images, imageData]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="app">
      <header>
        <h1>Facial Recognition Application</h1>
      </header>
      <div className="container">
        <div className="sidebar">
          <button className="upload-btn-wrapper">
            <span>+</span>
            <input type="file" name="file" id="upload" onChange={handleImageUpload} />
          </button>
          <div className="thumbnails">
            {images.map((image, index) => (
              <div key={index} className="thumbnail-container">
                <img
                  src={image.url}
                  alt={image.name}
                  className={selectedImage === image ? 'active' : ''}
                  onClick={() => handleThumbnailClick(image)}
                />
                {processingImages.includes(image) && <div className="processing-text">Processing...</div>}
                {image.annotation && <div className="annotation">{image.annotation}</div>}
              </div>
            ))}
          </div>
        </div>
        <div className="main-area"></div>
      </div>
    </div>
  );
}

export default App;
