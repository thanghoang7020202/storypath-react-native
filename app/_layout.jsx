import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { profile } from './profile';

import { useUsername, UsernameProvider } from './usernameContext'; // Use the context

// Custom Drawer Content Component
const CustomDrawerContent = (props) => {
  const pathname = usePathname();

  // const [username, setUsername] = useState('participant_username');

  // function updateUsername(name) {
  //   setUsername(name);
  // }
  // Get the username and updateUsername function passed from Layout
  const { username } = props;

  useEffect(() => {
    console.log('Current Path', pathname);
  }, [pathname]);

  return (
    <DrawerContentScrollView {...props}>
      {/* User Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.currentUser}>Current User: {username}</Text>
      </View>

      {/* Drawer Items */}
      <DrawerItem
        icon={({ color, size }) => (
          <Feather name="home" size={size} color={pathname === '/' ? '#fff' : '#000'} />
        )}
        label={'Welcome'}
        labelStyle={[styles.navItemLabel, { color: pathname === '/' ? '#fff' : '#000' }]}
        style={{ backgroundColor: pathname === '/' ? '#f07a71' : '#fff' }}
        onPress={() => router.push('/')}
      />

      <DrawerItem
        icon={({ color, size }) => (
          <FontAwesome name="user" size={size} color={pathname === '/profile' ? '#fff' : '#000'} />
        )}
        label={'Profile'}
        labelStyle={[styles.navItemLabel, { color: pathname === '/profile' ? '#fff' : '#000' }]}
        style={{ backgroundColor: pathname === '/profile' ? '#f07a71' : '#fff' }}
        // move updateUsername to the profile component
        onPress={() => router.push('/profile')}
      />

      <DrawerItem
        icon={({ color, size }) => (
          <MaterialIcons name="work" size={size} color={pathname === '/projects' ? '#fff' : '#000'} />
        )}
        label={'Projects'}
        labelStyle={[styles.navItemLabel, { color: pathname === '/projects' ? '#fff' : '#000' }]}
        style={{ backgroundColor: pathname === '/projects' ? '#f07a71' : '#fff' }}
        onPress={() => router.push('/projects')}
      />

      <DrawerItem
        icon={({ color, size }) => (
          <Feather name="map" size={size} color={pathname === '/ShowMap' ? '#fff' : '#000'} />
        )}
        label={'ShowMap'}
        labelStyle={[styles.navItemLabel, { color: pathname === '/ShowMap' ? '#fff' : '#000' }]}
        style={{ backgroundColor: pathname === '/ShowMap' ? '#f07a71' : '#fff' }}
        onPress={() => router.push('/ShowMap')}
      />

      <DrawerItem
        icon={({ color, size }) => (
          <Feather name="info" size={size} color={pathname === '/about' ? '#fff' : '#000'} />
        )}
        label={'About'}
        labelStyle={[styles.navItemLabel, { color: pathname === '/about' ? '#fff' : '#000' }]}
        style={{ backgroundColor: pathname === '/about' ? '#f07a71' : '#fff' }}
        onPress={() => router.push('/about')}
      />
    </DrawerContentScrollView>
  );
};



// Main Layout with Drawer
export default function Layout() {
  const [username, setUsername] = useState('participant_username');

  // Function to update the username
  function updateUsername(newUsername) {
    setUsername(newUsername);
  }

  return (
    <UsernameProvider>
      <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} username={username} />}
      screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="index" options={{ headerShown: true, headerTitle: 'Home' }} />
      <Drawer.Screen name="about" options={{ headerShown: true, headerTitle: 'About' }} />
      <Drawer.Screen name="profile" options={{ headerShown: true, headerTitle: 'Profile' }} />
      <Drawer.Screen name="projects" options={{ headerShown: true, headerTitle: 'Projects' }} />
    </Drawer>
    </UsernameProvider>
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
    fontSize: 16,
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
