import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../App.css";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const MapView = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [mapStyle, setMapStyle] = useState("Street");
  const [loading, setLoading] = useState(true);
  const geoWatchRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      geoWatchRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed } = position.coords;
          const newPoint = [latitude, longitude];
          setCurrentPosition(newPoint);

          const speedInKmh = speed ? (speed * 3.6).toFixed(2) : 0;
          setCurrentSpeed(speedInKmh);

          setRoutePath((prevPath) => {
            if (prevPath.length > 0) {
              const [lastLat, lastLon] = prevPath[prevPath.length - 1];
              const distanceSegment = calculateDistance(lastLat, lastLon, latitude, longitude);
              setTotalDistance((prevDistance) => prevDistance + distanceSegment);
            }
            return [...prevPath, newPoint];
          });

          setLoading(false);
        },
        (error) => {
          console.error("Location error:", error);
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    }

    return () => {
      navigator.geolocation.clearWatch(geoWatchRef.current);
    };
  }, []);

  // Toggle dark mode on the body element
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const tileLayerURL = {
    Street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    Satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    Grayscale: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    Dark: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
  };
  

  const tileAttribution = {
    Street: '&copy; Thakur college of engineering & technology',
    Satellite: '&copy; Thakur college of engineering & technology',
    Grayscale: '&copy; Thakur college of engineering & technology',
    Dark: '&copy; Thakur college of engineering & technology',
  };

  const customIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="app">
      <div className="info-box">
        <h2>📍 Find your location</h2>
        {loading ? (
          <p>Loading location...</p>
        ) : (
          <>
            <p><strong>Latitude:</strong> {currentPosition ? currentPosition[0] : "-"}</p>
            <p><strong>Longitude:</strong> {currentPosition ? currentPosition[1] : "-"}</p>
            <p><strong>Speed:</strong> {currentSpeed} km/h</p>
            <p><strong>Total Distance:</strong> {totalDistance.toFixed(2)} meters</p>
          </>
        )}

        <div className="controls">
          <select
            className="btn"
            value={mapStyle}
            onChange={(e) => setMapStyle(e.target.value)}
          >
            <option value="Street">Street View</option>
            <option value="Satellite">Satellite View</option>
            <option value="Grayscale">Grayscale View</option>
            <option value="Dark">Dark Mode View</option>
          </select>

          <button className="btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>

      {currentPosition ? (
        <MapContainer
          center={currentPosition}
          zoom={16}
          style={{ height: "500px", width: "100%", borderRadius: "12px" }}
        >
          <TileLayer
            url={tileLayerURL[mapStyle]}
            attribution={tileAttribution[mapStyle]}
          />
          <Marker position={currentPosition} icon={customIcon} />
          <Polyline positions={routePath} color="blue" />
        </MapContainer>
      ) : (
        <p>Locating your position...</p>
      )}
    </div>
  );
};

export default MapView;
