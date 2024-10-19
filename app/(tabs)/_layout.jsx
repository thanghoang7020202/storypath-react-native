import { View, Text, Button } from 'react-native'
import React from 'react'
import { Tabs, router } from 'expo-router'
import { Feather } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';

export default function _layout() {
  return (
   <Tabs screenOptions={{headerLeft: () => <DrawerToggleButton tintColor='#000' />}}>
    <Tabs.Screen name='blog' options={{
      tabBarIcon: ({color}) => (
        <Feather name="list" size={24} color={color} />
      ),
      tabBarLabel: 'Blog',
      headerTitle: 'Blog'
    }} />
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
    
   </Tabs>
  )
}