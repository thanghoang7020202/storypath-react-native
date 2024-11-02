import { View, Text, TextInput, Button, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import ImagePickerScreen from './imagePicker'; // Import ImagePicker component
import { getTracking, getTrackings, getProjects, getLocations } from './api'; // Import API functions

export default function EditProfile({ username, onUsernameChange, onCloseEditProfile }) {
  const [name, setName] = useState(username || '');                 // Username state (or default value)
  const [email, setEmail] = useState('john.doe@example.com');       // Default email state
  const [initialData, setInitialData] = useState({ name, email });  // Used to track unsaved changes
  const [isSubmitting, setIsSubmitting] = useState(false);          // Save button state
  const [errorFields, setErrorFields] = useState([]);               // Track invalid fields

  /**
   * Function to fetch tracking data for the current user
   */
  const fetchTracking = async () => {
    try {
      let data = await getTrackings();        // Fetch all tracking data
      let projectList = await getProjects();  // Fetch all projects
      let locationList = await getLocations();// Fetch all locations

      data = data.filter((tracking) => tracking.participant_username === name);
      
      console.log('Tracking data:', data, name);

      if (data.length > 0) {
        projectList = projectList.filter((project) => project.id === data[0].project_id);
        locationList = locationList.filter((location) => location.id === data[0].location_id);
        
        // Display a welcome message with the user's previous tracking data
        Alert.alert(
          `Welcome back, ${name}! 🎉`,
          `Your previous tracking data has been restored!\n\n` +
          `• **Previous Project**: ${projectList[0].title} 📂\n` +
          `• **Last Location**: ${locationList[0].location_name} 📍\n` +
          `• **Points Earned**: ${data[0].points} 🌟\n\n` +
          `Enjoy your journey and keep exploring! 🚀`
        );
      } else {

        // Display a welcome message for new users
        Alert.alert(
          `Welcome to StoryPath, ${name}! 🎉`,
          `Your profile has been successfully created! 📝\n\n` +
          `🌍 **Explore**: Discover unlimited location-based experiences—from city tours to treasure hunts! The possibilities are endless!\n\n` +
          `⚠️ **Note**: This username will only be saved if you participate in a project.\n\n` +
          `Enjoy your journey! 🚀`
        );
        
      }
    } catch (error) {
      console.error('Error fetching tracking:', error);
    }
  };

  /**
   * Function to handle the save button
   * */
  function handleSave() {
    const errors = [];
    if (!name) errors.push('name');
    if (!email) errors.push('email');

    setErrorFields(errors);

    if (errors.length > 0) {
      return; // Prevent saving if validation errors exist
    }

    fetchTracking();

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

  /**
   * Function to check if there are unsaved changes
   * @returns {Boolean} True if there are unsaved changes, false otherwise
   * */
  function hasUnsavedChanges() {
    return name !== initialData.name || email !== initialData.email;
  }

  /**
   * Function to handle the cancel button
   * */
  function handleCancel() {

    // if there are unsaved changes, prompt the user to confirm
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
        <Button title={isSubmitting ? 'Saving...' : 'Save Profile'} onPress={handleSave} disabled={isSubmitting} color="#8A2BE2"/>
      </View>

      {/* Cancel Button */}
      <View  style={styles.buttonWrapper}>
        <Button onPress={handleCancel} title={hasUnsavedChanges() ? 'Cancel' : 'Close'} style={styles.buttonWrapper} color="#8A2BE2"/>
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
    color: '#8A2BE2',
    marginBottom: 20,
  },
  tapText: {
    position: 'absolute',
    color: '#8A2BE2',
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
