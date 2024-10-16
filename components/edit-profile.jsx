import { View, Text, TextInput, Button, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import ImagePickerScreen from './imagePicker'; // Import ImagePicker component

export default function EditProfile({ username, onUsernameChange, onClose }) {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(null); // Selected profile image
  const [isPickerVisible, setPickerVisible] = useState(false); // Controls ImagePicker visibility
  const [name, setName] = useState(username || ''); // Username state (or default value)
  const [email, setEmail] = useState('john.doe@example.com'); // Default email state
  const [initialData, setInitialData] = useState({ name, email }); // Used to track unsaved changes
  const [isSubmitting, setIsSubmitting] = useState(false); // Save button state
  const [errorFields, setErrorFields] = useState([]); // Track invalid fields

  // Function to handle image selection from ImagePicker
  function handleImageChange(image) {
    setProfileImage(image); // Update profile image
  }

  // Toggle ImagePicker modal visibility
  function toggleImagePicker() {
    setPickerVisible(!isPickerVisible);
  }

  // Handle Save button action
  function handleSave() {
    const errors = [];
    if (!name) errors.push('name');
    if (!email) errors.push('email');

    setErrorFields(errors);

    if (errors.length > 0) {
      return; // Prevent saving if validation errors exist
    }

    // Simulate saving with loading state
    setIsSubmitting(true);
    setTimeout(() => {
      console.log('Profile saved:', { name, email, profileImage });
      setInitialData({ name, email }); // Update initial data
      onUsernameChange(name); // Update username in parent
      setIsSubmitting(false);
      onClose(); // Close modal after saving
    }, 1000);
  }

  // Check for unsaved changes
  function hasUnsavedChanges() {
    return name !== initialData.name || email !== initialData.email || profileImage;
  }

  // Handle Cancel button with unsaved changes confirmation
  function handleCancel() {
    if (hasUnsavedChanges()) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to discard them?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: onClose }, // Discard changes and close
        ]
      );
    } else {
      onClose(); // No unsaved changes, close immediately
    }
  }

  return (
    <View style={styles.container}>
      {/* Edit Profile Header */}
      <Text style={styles.headerText}>Edit Profile</Text>

      {/* Profile Image Section */}
      <TouchableOpacity style={styles.imageWrapper} onPress={toggleImagePicker}>
        {profileImage ? (
          <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
        ) : (
          <Image source={require('../assets/icons/cheese.png')} style={styles.profileImage} />
        )}
        <Text style={styles.tapText}>Tap to Change</Text>
      </TouchableOpacity>

      {/* Image Picker Modal */}
      <Modal visible={isPickerVisible} animationType="slide" onRequestClose={toggleImagePicker}>
        <ImagePickerScreen onImageSelect={handleImageChange} onClose={toggleImagePicker} />
      </Modal>

      {/* Edit Name Input */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={[styles.input, errorFields.includes('name') && styles.errorInput]}
        placeholder="Enter your name"
      />
      {errorFields.includes('name') && <Text style={styles.errorText}>Name is required.</Text>}

      {/* Edit Email Input */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={[styles.input, errorFields.includes('email') && styles.errorInput]}
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      {errorFields.includes('email') && <Text style={styles.errorText}>Email is required.</Text>}

      {/* Save Button */}
      <Button title={isSubmitting ? 'Saving...' : 'Save Profile'} onPress={handleSave} disabled={isSubmitting} style={styles.buttonWrapper} color="#ff6f61"/>

      {/* Cancel Button */}
      <View style={styles.buttonWrapper}>
        <Button onPress={handleCancel} title="Cancel" color="#ff6f61"/>
      </View>
    </View>
  );
}

// Stylesheet
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6f61',
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
    marginBottom: 20,
  },
  profileImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  tapText: {
    position: 'absolute',
    color: '#ff6f61',
    fontSize: 12,
    bottom: 5,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 12,
  },
  buttonWrapper: {
    width: '80%',
    marginTop: 30,
  },
};
