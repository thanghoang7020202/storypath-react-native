import { View, Text, Button, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from "expo-router";
import { useUsername, UsernameProvider } from './usernameContext';  // Use the context
import Profile from './profile';                                    // Import the Profile component

export default function Index() {

  const router = useRouter();                                     // Get the router object
  const { username, setUsername } = useUsername();                // Use the context
  const [isProfileVisible, setProfileVisible] = useState(false);  // State to control modal visibility

  /**
   * Function to handle the username change
   * @param {String} username The new username
   */
  function handleUsernameChange(username) {
    setUsername(username); // Update the username
  }

  /**
   * Function to toggle the profile modal visibility
   * @returns {void}
   * */
  function toggleProfile() {
    setProfileVisible(!isProfileVisible);
  }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>🌟Welcome to StoryPath 🌟</Text>
        <Text style={styles.subtitle}>Explore Unlimited Location-based Experiences</Text>
        <Text style={styles.description}>
          With StoryPath, you can discover and create amazing location-based adventures. From city
          tours to treasure hunts, the possibilities are endless!
        </Text>

        {/* Profile Button */}
        <TouchableOpacity style={styles.button} onPress={ () => router.push( { pathname: '/profile'} ) }>
          <Text style={styles.buttonText}>{username ? 'View Profile' : 'Create Profile'}</Text>
        </TouchableOpacity>

        {/* Explore Projects Button */}
        <TouchableOpacity style={styles.button} onPress={() => router.push('/projects')}>
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
    textAlign: 'center', // Keeps the text centered
    width: '100%',       // Ensures the text spans the full width of the container
    flexWrap: 'wrap',    // Enables wrapping to a new line
    alignSelf: 'center', // Ensures that the element is centered inside any flex container
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
