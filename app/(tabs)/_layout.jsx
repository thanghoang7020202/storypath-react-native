import { View, Text, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Tabs, router } from 'expo-router'
import { Feather } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { ProjectIdProvider, useProjectId } from '.././projectIdContext'; // Use the context

export default function _layout() {

  return (
    <ProjectIdProvider>
      <Tabs screenOptions={{headerLeft: () => <DrawerToggleButton tintColor='#000' />}}>
        <Tabs.Screen name='ProjectHomeScreen/[id]' options={{ 
          tabBarIcon: ({color}) => (
            <Feather name="home" size={24} color={color} />
          ),
          tabBarLabel: 'ProjectHomeScreen',
          headerTitle: 'ProjectHomeScreen'
        }} />
      

        <Tabs.Screen name='ShowMap' options={{
          tabBarIcon: ({color}) => (
            <Feather name="map" size={24} color={color} />
          ),
          tabBarLabel: 'Map',
          headerTitle: 'Map'
        }} />

        <Tabs.Screen name='QRCodeScanner' options={{
          tabBarIcon: ({color}) => (
            <Feather name="camera" size={24} color={color} />
          ),
          tabBarLabel: 'QRCodeScanner',
          headerTitle: 'QRCodeScanner'
        }} />
      </Tabs>
    </ProjectIdProvider>
  )
}