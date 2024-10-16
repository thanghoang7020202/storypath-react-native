// Profile.jsx
import { View, Text, Button, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import ImagePickerScreen from '../components/imagePicker'; // Import the ImagePicker component
 
export default function Profile() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(null); // State to hold the selected profile image
  const [isPickerVisible, setPickerVisible] = useState(false); // State to control modal visibility

  // Function to handle the selected image from the ImagePicker
  function handleImageChange(image) {
    setProfileImage(image); // Update the profile image
  }

  // Function to open/close the image picker
  function toggleImagePicker() {
    setPickerVisible(!isPickerVisible);
  }

  function handleEditProfile() {
    router.push('/edit-profile');
  }


  return (
    <View style={styles.container}>
      {/* Profile Information */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Profile</Text>

      {/* Image Picker Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.imageWrapper} onPress={toggleImagePicker}>
          {/* Display the selected profile image or default image */}
          {profileImage ? (
            <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
          ) : (
            <Image source={require('../assets/icons/cheese.png')} style={styles.profileImage} />
          )}
          <Text style={styles.tapText}>Tap to Change</Text>
        </TouchableOpacity>
      </View>

      {/* Image Picker Modal */}
      <Modal visible={isPickerVisible} animationType="slide" onRequestClose={toggleImagePicker}>
        <ImagePickerScreen onImageSelect={handleImageChange} onClose={toggleImagePicker} />
      </Modal>

      {/* Other Profile Content */}
      <Text className="text-base mt-5">Name: John Doe</Text>
      <Text className="text-base mt-2">Email: john.doe@example.com</Text>

      {/* Edit Profile Button */}
      <View className="mt-5">
        <Button title="Edit Profile" onPress={() => router.push('/edit-profile')} />
      </View>

      {/* Go Back Button */}
      <View className="mt-3">
        <Button onPress={() => router.back()} title="Go Back" />
      </View>
    </View>
  );
}

// Stylesheet for the Profile Screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ff6f61',
    width: 120,
    height: 120,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tapText: {
    position: 'absolute',
    color: '#ff6f61',
    fontWeight: 'bold',
    textAlign: 'center',
    top: '50%',
  },
});
