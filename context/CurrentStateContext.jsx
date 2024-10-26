import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BASE_URL, GOOGLE_MAPS_API_KEY } from "../config";
import { useSocketContext } from "./SocketContext";

export const CurrentStateContext = createContext();

export const CurrentStateProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [searching, setSearching] = useState(false);
  const { socket } = useSocketContext(); // Assuming socket is already handled in SocketContext

  // Function to fetch location name
  const getLocationName = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      if (response.data.results.length > 0) {
        const address = response.data.results[0].formatted_address;
        setLocationName(address);
      } else {
        setLocationName("Unknown Location");
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
      setLocationName("Error fetching location");
    }
  };

  // Function to get online drivers from the server
  const getDrivers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getonlinedrivers`);
      setDrivers(response.data);
    } catch (error) {
      console.log("Error getting drivers:", error);
    }
  };

  // Initialize socket for real-time driver updates
  useEffect(() => {
    const initializeSocket = () => {
      socket.on("driver-location-changed", (driver) => {
        const { _id, location } = driver;
        if (location && location.coordinates) {
          setDrivers((prevDrivers) => {
            const existingDriverIndex = prevDrivers.findIndex(
              (d) => d.id === _id
            );
            if (existingDriverIndex !== -1) {
              const updatedDrivers = [...prevDrivers];
              updatedDrivers[existingDriverIndex].location.coordinates =
                location.coordinates;
              return updatedDrivers;
            }
            return [...prevDrivers, { id: _id, location }];
          });
        }
      });
    };

    initializeSocket();

    return () => {
      socket.off("driver-location-changed");
    };
  }, [socket]);

  // Watch for current location changes
  useEffect(() => {
    if (currentLocation) {
      const { latitude, longitude } = currentLocation;
      getLocationName(latitude, longitude);
    }
  }, [currentLocation]);

  // Trigger search mode
  const findDriver = () => {
    setSearching(true);
  };

  return (
    <CurrentStateContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        locationName,
        drivers,
        setDrivers,
        searching,
        setSearching,
        findDriver,
        getDrivers,
      }}
    >
      {children}
    </CurrentStateContext.Provider>
  );
};
