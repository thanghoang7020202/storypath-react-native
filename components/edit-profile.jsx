import { View, Text, TextInput, Button, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import React, { useState } from 'react';
import ImagePickerScreen from './imagePicker'; // Import ImagePicker component
//import { getTrackings, addTracking, updateTracking, deleteTracking } from './api'; // Import API functions

export default function EditProfile({ username, onUsernameChange, onCloseEditProfile }) {
  const [name, setName] = useState(username || ''); // Username state (or default value)
  const [email, setEmail] = useState('john.doe@example.com'); // Default email state
  const [initialData, setInitialData] = useState({ name, email }); // Used to track unsaved changes
  const [isSubmitting, setIsSubmitting] = useState(false); // Save button state
  const [errorFields, setErrorFields] = useState([]); // Track invalid fields

  // Handle Save button action
  function handleSave() {
    const errors = [];
    if (!name) errors.push('name');
    if (!email) errors.push('email');

    setErrorFields(errors);

    if (errors.length > 0) {
      return; // Prevent saving if validation errors exist
    }
    
    // if the username is in tracking, use the username from tracking
    // getTrackings().then((trackings) => {
    //   const tracking = trackings.find((tracking) => tracking.participant_username === name);
    //   if (tracking) {
    //     console.log('Participant found in tracking:', tracking);
    //   } else {
    //     // add a new tracking entry
    //     addTracking({ participant_username: name }).then(() => {
    //       console.log('New tracking entry added for:', name);
    //     });
    //   }
    // });

    // Simulate saving with loading state
    setIsSubmitting(true);
    setTimeout(() => {
      console.log('Profile saved:', { name, email });
      setInitialData({ name, email }); // Update initial data
      onUsernameChange(name); // Update username in parent
      setIsSubmitting(false);
      onCloseEditProfile();
      // go back to the profile page after saving;
    }, 1000);
  }

  // Check for unsaved changes
  function hasUnsavedChanges() {
    return name !== initialData.name || email !== initialData.email;
  }

  // Handle Cancel button with unsaved changes confirmation
  function handleCancel() {
    if (hasUnsavedChanges()) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to discard them?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: onCloseEditProfile }, // Discard changes and close
        ]
      );
    } else {
      onCloseEditProfile(); // No unsaved changes, close immediately
    }
  }

  return (
    <View style={styles.container}>
      {/* Edit Profile Header */}
      <Text style={styles.headerText}>Edit Profile</Text>

      {/* Edit Name Input */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={[styles.input, errorFields.includes('name') && styles.errorInput]}
        placeholder="Enter your username"
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
      <View style={styles.buttonWrapper}>
        <Button title={isSubmitting ? 'Saving...' : 'Save Profile'} onPress={handleSave} disabled={isSubmitting} color="#ff6f61"/>
      </View>

      {/* Cancel Button */}
      <View  style={styles.buttonWrapper}>
        <Button onPress={handleCancel} title={hasUnsavedChanges() ? 'Cancel' : 'Close'} style={styles.buttonWrapper} color="#ff6f61"/>
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
