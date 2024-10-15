import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import React from "react";
import { router } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to StoryPath</Text>
      <Text style={styles.subtitle}>Explore Unlimited Location-based Experiences</Text>
      <Text style={styles.description}>
        With StoryPath, you can discover and create amazing location-based adventures. From city
        tours to treasure hunts, the possibilities are endless!
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Create Profile</Text>
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
    color: '#f07a71',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#f07a71',
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
