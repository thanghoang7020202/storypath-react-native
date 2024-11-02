import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useProjectId } from ".././projectIdContext";
import { useUsername } from "../usernameContext";
import { getTrackings, addTracking, getLocations, getProjects } from "../../components/api";

export default function QRCodeScanner() {
  const isFocused = useIsFocused();                               // Get the focused state
  const [scanned, setScanned] = useState(false);                  // State to hold the scanned state
  const [scannedData, setScannedData] = useState('');             // State to hold the scanned data
  const [fireworkVisible, setFireworkVisible] = useState(false);  // State to hold the firework visibility
  const [locations, setLocations] = useState([]);                 // State to hold the locations
  const [trackings, setTrackings] = useState([]);                 // State to hold the trackings
  const fireworkRef = useRef(null);                               // Ref to the ConfettiCannon component
  const [permission, requestPermission] = useCameraPermissions(); // Get the camera permissions
  const { projectId } = useProjectId();                           // Get the project ID
  const [project, setProject] = useState(null);                   // State to hold the project
  const { username } = useUsername();                             // Get the username

  /**
   * Function to handle the scanned barcode
   */
  useEffect(() => {
    // Fetch locations and trackings when component mounts
    const fetchData = async () => {
      try {
        // Fetch locations
        const locationData = await getLocations();
        const projectLocations = locationData.filter(location => location.project_id === projectId);
        setLocations(projectLocations);
        
        // Fetch project
        const projectData = await getProjects();
        const project = projectData.find(project => project.id === projectId);
        setProject(project);

        // Fetch trackings
        const trackingData = await getTrackings();
        const projectTrackings = trackingData.filter(tracking => tracking.project_id === projectId);
        setTrackings(projectTrackings);

      } catch (error) {
        console.error('Error fetching data in QRCodeScanner:', error);
      }
    };
    fetchData();
  }, [projectId, isFocused]);

  /**
   * Function to handle the scanned barcode
   * @param {Object} event The barcode scan event
   * */
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData(data);

    // Check if the scanned data matches any location name and hasn't been tracked
    const matchingLocation = locations.find(location => location.location_name.trim() === data.trim());
    
    // UNCOMMNENT THE LINE BELOW to test location_trigger, otherwise project.participant_scoring will be used
    //if (matchingLocation.location_trigger !== "Both Location Entry and QR Code Scan" && matchingLocation.location_trigger !== "QR Code Scan") {
    if (project.participant_scoring === "Number of Locations Entered") {
      Alert.alert('QR Code', 'This location requires a physical visit!', [
        { text: 'Try Again', onPress: () => setScanned(false) },
      ]);
      return;
    }

    // Check if the location has already been tracked by the user
    const alreadyTracked = matchingLocation && trackings.some(tracking => tracking.location_id === matchingLocation.id && tracking.participant_username === username);

    // Add tracking entry if location found and not already tracked
    if (matchingLocation && !alreadyTracked) {
      addTrackingEntry(matchingLocation);
      triggerFirework();
    } else {
      // Display alert if location not found or already tracked
      Alert.alert('QR Code', alreadyTracked ? 'Location already visited!' : 'Location not found!', [
        { text: 'Try Again', onPress: () => setScanned(false) },
      ]);
    }
  };

  /**
   * Function to add a tracking entry
   * @param {Object} location The location to add the tracking entry for
   * */
  const addTrackingEntry = async (location) => {
    const newTracking = {
      project_id: projectId,
      location_id: location.id,
      points: location.score_points,
      username: "s4759487",
      participant_username: username,
    };
    try {
      await addTracking(newTracking);
      setTrackings(prev => [...prev, newTracking]);
      Alert.alert('Location Visited', 'Tracking updated successfully!', [{ text: 'OK' }]);
    } catch (error) {
      console.error('Error adding tracking entry:', error);
    }
  };

  /**
   * Function to trigger the firework animation
   * */
  const triggerFirework = () => {
    setFireworkVisible(true);
    setTimeout(() => setFireworkVisible(false), 3000);
  };

  // Display the camera view
  if (!permission) return <Text>Requesting camera permissions...</Text>;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionMessage}>Camera permissions are required to scan QR codes.</Text>
        <Button onPress={requestPermission} title="Grant permission" color="#8A2BE2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Display the camera view */}
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      {/* firework animation if scan is successful */}
      {fireworkVisible && (
        <ConfettiCannon ref={fireworkRef} count={50} origin={{ x: -10, y: 0 }} />
      )}
      
      {/* Display the scan result */}
      {scanned && (
        <Button title="Scan Again" onPress={() => setScanned(false)} color="#8A2BE2" />
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scanResultContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f5f5f5',
    padding: 20,
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  scanResultText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionMessage: {
    marginBottom: 20,
    textAlign: 'center', // Keeps the text centered
    width: '100%',       // Ensures the text spans the full width of the container
    flexWrap: 'wrap',    // Enables wrapping to a new line
    alignSelf: 'center', // Ensures that the element is centered inside any flex container
  },

});
