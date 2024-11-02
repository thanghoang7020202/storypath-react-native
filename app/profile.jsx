import { View, Text, Button, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import ImagePickerScreen from '../components/imagePicker';      // Import the ImagePicker component
import EditProfile from '../components/edit-profile';           // Import the EditProfile component
import { useUsername, UsernameProvider } from './usernameContext'; // Use the context

export default function Profile() {
  const router = useRouter();                                   // Get the router object
  const [profileImage, setProfileImage] = useState(null);       // State to hold the selected profile image
  const { username, setUsername } = useUsername();              // Use the context
  const [isPickerVisible, setPickerVisible] = useState(false);  // State to control modal visibility
  const [isUserEditing, setUserEditing] = useState(false);      // State to control edit mode

  /**
   * Function to handle the selected image from the ImagePicker
   * @param {*} image The selected image
   */
  function handleImageChange(image) {
    setProfileImage(image); // Update the profile image
  }

  /**
   * Function to open/close the image picker
   * @returns {void}
   * */
  function toggleImagePicker() {
    setPickerVisible(!isPickerVisible);
  }

  /**
   * Function to handle the username change
   * @param {String} username The new username
   * */
  function handleUsernameChange(username) {
    setUsername(username);
  }

  /**
   * Function to toggle the user editing mode
   * @returns {void}
   * */
  function toggleUserEditing() {
    setUserEditing(!isUserEditing);
  }

  return (
    <View style={styles.container}>
      {/* Profile Information */}
      <Text style={styles.profileHeader}>Your Profile</Text>

      {/* Image Picker Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.imageWrapper} onPress={toggleImagePicker}>
          {/* Display the selected profile image or default image */}
          {profileImage ? (
            <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
          ) : (
            <Image source={require('../assets/icons/cheese.png')} style={styles.profileImage} />
          )}
          <Text style={styles.tapText}>Tap to add photo</Text>
        </TouchableOpacity>
      </View>

      {/* Image Picker Modal */}
      <Modal visible={isPickerVisible} animationType="slide" onRequestClose={toggleImagePicker}>
        <ImagePickerScreen onImageSelect={handleImageChange} onCloseImage={toggleImagePicker} />
      </Modal>

      {/* Other Profile Content */}
      <View style={styles.inputWrapper}>
        <TouchableOpacity onPress={toggleUserEditing}>
          {/* Display the profile username */}
          {username ? (
            <Text style={styles.inputText}>{username}</Text>
          ) : (
            <Text style={styles.inputText}>Add Username</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Edit Profile Modal */}
      <Modal visible={isUserEditing} animationType="slide" onRequestClose={toggleUserEditing}>
        <EditProfile username={username} onUsernameChange={handleUsernameChange} onCloseEditProfile={toggleUserEditing} />
      </Modal> 

      {/* Go Back Button - close the modal */}
      <View style={styles.buttonWrapper}>
        <Button title="Go Back" onPress={() => router.back()} color={'#8A2BE2'} />
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
  profileHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 20,
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
    borderColor: '#d3d3d3',
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    position: 'relative',
  },
  profileImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  tapText: {
    position: 'absolute',
    color: '#c3c3c3',
    fontSize: 12,
    bottom: 5,
    textAlign: 'center',
  },
  inputWrapper: {
    width: '80%',
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 20,
  },
  inputText: {
    fontSize: 16,
    color: '#8c8c8c',
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '80%',
    marginTop: 30,
  },
});
