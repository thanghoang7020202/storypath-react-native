import { View, Text, Button, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import React, { useState } from 'react';
import { router } from "expo-router";

import { useUsername } from './usernameContext';  // Use the context
import Profile from './profile'; // Import the Profile component

export default function Index() {

  const [user, setUser] = useState('participant_username'); // Default username state
  const [isProfileVisible, setProfileVisible] = useState(false); // State to control modal visibility

  // Function to handle the username change
  function handleUsernameChange(username) {
    setUser(username);
  }

  function toggleProfile() {
    setProfileVisible(!isProfileVisible);
  }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Welcome to StoryPath</Text>
        <Text style={styles.subtitle}>Explore Unlimited Location-based Experiences</Text>
        <Text style={styles.description}>
          With StoryPath, you can discover and create amazing location-based adventures. From city
          tours to treasure hunts, the possibilities are endless!
        </Text>
        <TouchableOpacity style={styles.button} onPress={toggleProfile}>
          {/* <Profile style={styles.buttonText} updateUsername={handleUsernameChange} user={user} /> 
          click the button to go to the Profile screen with parameters same as above*/}
          <Modal style={styles.button} visible={isProfileVisible} animationType="slide" onRequestClose={toggleProfile}>
            <Profile updateUsername={handleUsernameChange} user={user} onCloseProfile={toggleProfile} />
          </Modal>
          <TouchableOpacity onPress={toggleProfile}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Explore Projects</Text>
        </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
  },
  infoContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  currentUser: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  description: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
