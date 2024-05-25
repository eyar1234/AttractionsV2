import React, { useState, useEffect } from "react";
import "./App.css";
import Card from "./components/card.component";
import { coordsToData } from "./hooks/requests";

function App() {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Index of the currently displayed object
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  // Function to fetch data
  const fetchData = async (latitude, longitude) => {
    try {
      const result = await coordsToData(latitude, longitude);
      setData(result);
      console.log(result);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  // Success callback for geolocation
  const success = async (position) => {
    const { latitude, longitude } = position.coords;
    setCoordinates({ latitude, longitude });
    await fetchData(latitude, longitude);
  };

  // Error callback for geolocation
  const error = (err) => {
    console.log(`Cannot get the coordinates: ${err.message}`);
  };

  // useEffect to get coordinates on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  // Function to handle button click
  const handleButtonClick = () => {
    const nextIndex = (currentIndex + 1) % data.length;
    setCurrentIndex(nextIndex);
  };

  return (
    <div className="html">
      <div className="body">
        {
          <>
            <Card data={data[currentIndex]} />
            <button type="button" onClick={handleButtonClick}>
              Next
            </button>
          </>
        }
      </div>
    </div>
  );
}

export default App;
