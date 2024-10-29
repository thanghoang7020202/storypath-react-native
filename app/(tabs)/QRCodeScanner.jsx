import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useProjectId } from ".././projectIdContext";
import { useUsername } from "../usernameContext";
import { getTrackings, addTracking, getLocations } from "../../components/api";

export default function QRCodeScanner() {
  const isFocused = useIsFocused();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [fireworkVisible, setFireworkVisible] = useState(false);
  const [locations, setLocations] = useState([]);
  const [trackings, setTrackings] = useState([]);
  const fireworkRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const { projectId } = useProjectId();
  const { username } = useUsername();

  useEffect(() => {
    // Fetch locations and trackings when component mounts
    const fetchData = async () => {
      try {
        const locationData = await getLocations();
        const projectLocations = locationData.filter(location => location.project_id === projectId);
        setLocations(projectLocations);

        const trackingData = await getTrackings();
        const projectTrackings = trackingData.filter(tracking => tracking.project_id === projectId);
        setTrackings(projectTrackings);
      } catch (error) {
        console.error('Error fetching data in QRCodeScanner:', error);
      }
    };
    fetchData();
  }, [projectId, isFocused]);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData(data);

    // Check if the scanned data matches any location name and hasn't been tracked
    const matchingLocation = locations.find(location => location.location_name.trim() === data.trim());
    // check if matched location has location_trigger is ""Both Location Entry and QR Code Scan" or "QR Code Scan"
    if (matchingLocation.location_trigger !== "Both Location Entry and QR Code Scan" && matchingLocation.location_trigger !== "QR Code Scan") {
      Alert.alert('QR Code', 'This location requires a physical visit!', [
        { text: 'Try Again', onPress: () => setScanned(false) },
      ]);
      return;
    }

    const alreadyTracked = matchingLocation && trackings.some(tracking => tracking.location_id === matchingLocation.id && tracking.participant_username === username);

    if (matchingLocation && !alreadyTracked) {
      addTrackingEntry(matchingLocation);
      triggerFirework();
    } else {
      Alert.alert('QR Code', alreadyTracked ? 'Location already visited!' : 'Location not found!', [
        { text: 'Try Again', onPress: () => setScanned(false) },
      ]);
    }
  };

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

  const triggerFirework = () => {
    setFireworkVisible(true);
    setTimeout(() => setFireworkVisible(false), 3000);
  };

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
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {fireworkVisible && (
        <ConfettiCannon ref={fireworkRef} count={50} origin={{ x: -10, y: 0 }} />
      )}
      {scanned && (
        <Button title="Scan Again" onPress={() => setScanned(false)} color="#8A2BE2" />
      )}
    </View>
  );
}

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
