import React, { useState } from 'react';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          url: e.target.result,
          name: file.name,
        };
        setImages([...images, imageData]);
        setSelectedImage(imageData);
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
              <img
                key={index}
                src={image.url}
                alt={image.name}
                className={selectedImage === image ? 'active' : ''}
                onClick={() => handleThumbnailClick(image)}
              />
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