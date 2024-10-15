import { View, Text, Button, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Profile Picture Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.imageWrapper}>
          <Image
            source={require('../assets/icons/cheese.png')}
            style={styles.profileImage}
          />
          <Text style={styles.tapText}>Tap to add photo</Text>
        </TouchableOpacity>
      </View>

      {/* Username Input */}
      <View style={styles.inputSection}>
        <TextInput
          style={styles.usernameInput}
          placeholder="participant_username"
          placeholderTextColor="#c4c4c4"
        />
      </View>

      {/* Go Back Button */}
      <Button onPress={() => router.back()} title="Go Back" />
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
  inputSection: {
    marginBottom: 20,
    width: '80%',
  },
  usernameInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ff6f61',
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 10,
  },
});
