import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function QRCodeScanner() {
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [fireworkVisible, setFireworkVisible] = useState(false);
  const fireworkRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.container}><Text>Requesting permissions...</Text></View>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionMessage}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" color="#8A2BE2" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
    setFireworkVisible(false);  // Reset firework visibility before showing it again

    // Alert the scanned data with 2 buttons: Continue and Try Again
    Alert.alert(
      'Scanned Data',
      data,
      [
        {
          text: 'Continue',
          onPress: () => {
            console.log('Continue Pressed');
            triggerFirework();
          },
        },
        {
          text: 'Try Again',
          onPress: () => setScanned(false),
        },
      ],
      { cancelable: false }
    );
  };

  const triggerFirework = () => {
    setFireworkVisible(true);
    setTimeout(() => {
      setFireworkVisible(false); // Hide the firework after it finishes
    }, 3000); // Adjust the duration to match the firework animation length
    Alert.alert(
      'Congratulations!',
      'You have successfully find one of our favorite locations!',
      [
        {
          text: 'Continue',
          onPress: () => {
            console.log('Continue Pressed');
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        type='front'
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      {scanned && (
        <View style={styles.scanResultContainer}>
          <Text style={styles.scanResultText}>Scanned Data: {scannedData}</Text>
          <Button title="Scan Again" onPress={() => setScanned(false)} color="#8A2BE2" />
        </View>
      )}

      {fireworkVisible && (
        <ConfettiCannon
          ref={fireworkRef}
          count={50}
          origin={{ x: -10, y: 0 }}
          explosionSpeed={350}
          fallSpeed={2500}
          fadeOut
        />
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
});
