import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [processingImages, setProcessingImages] = useState([]);

  useEffect(() => {
    // Simulating face recognition processing
    const simulateFaceRecognition = async () => {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Update processingImages to remove the processed image
      setProcessingImages(currentProcessingImages =>
        currentProcessingImages.filter(image => image !== selectedImage)
      );
    };

    if (selectedImage && processingImages.includes(selectedImage)) {
      simulateFaceRecognition();
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
        setProcessingImages(currentProcessingImages => [...currentProcessingImages, imageData]);

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
              </div>
            ))}
          </div>
        </div>
        <div className="main-area">
          {selectedImage && <img src={selectedImage.url} alt={selectedImage.name} />}
        </div>
      </div>
    </div>
  );
}

export default App;
