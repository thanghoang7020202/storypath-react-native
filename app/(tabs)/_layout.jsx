import { View, Text, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Tabs, router } from 'expo-router'
import { Feather } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { ProjectIdProvider, useProjectId } from '.././projectIdContext'; // Use the context
import { UsernameProvider, useUsername } from '../usernameContext';

export default function _layout() {

  return (
    // Wrap the components with the context providers (ProjectIdProvider and UsernameProvider)
    <ProjectIdProvider>
      <UsernameProvider>
      
      {/* Tabs navigator */}
      <Tabs screenOptions={{headerLeft: () => <DrawerToggleButton tintColor='#000' />}}>

        {/* Home Screen */}
        <Tabs.Screen name='ProjectHomeScreen/[id]' options={{
          tabBarIcon: ({color}) => (
            <Feather name="home" size={24} color={color} />
          ),
          tabBarLabel: 'ProjectHomeScreen',
          headerTitle: 'ProjectHomeScreen'
        }} />
      
        {/* ShowMap Screen */}
        <Tabs.Screen name='ShowMap' options={{
          tabBarIcon: ({color}) => (
            <Feather name="map" size={24} color={color} />
          ),
          tabBarLabel: 'Map',
          headerTitle: 'Map'
        }} />

        {/* QRCodeScanner Screen */}
        <Tabs.Screen name='QRCodeScanner' options={{
          tabBarIcon: ({color}) => (
            <Feather name="camera" size={24} color={color} />
          ),
          tabBarLabel: 'QRCodeScanner',
          headerTitle: 'QRCodeScanner'
        }} />
      </Tabs>
      </UsernameProvider>
    </ProjectIdProvider>
  )
}