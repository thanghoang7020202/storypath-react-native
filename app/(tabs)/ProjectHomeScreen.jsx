import { View, Text, Button, ScrollView, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getProject, getLocations, getProjects } from '../../components/api'; // Import API functions
import MapView, { Marker } from 'react-native-maps';
import { useGlobalSearchParams } from 'expo-router';

export default function ProjectHomeScreen({ route }) {
  const router = useRouter();
  const { id } = useGlobalSearchParams();
  const [project, setProject] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Homescreen');
  const [points, setPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [locationsVisited, setLocationsVisited] = useState([]);

  useEffect(() => {
    const fetchProjectAndLocations = async () => {
      try {
        const projectData = await getProjects();
        const locationsData = await getLocations();

        const filteredLocations = locationsData.filter(
          location => location.project_id === projectData.id
        );

        setProject(projectData);
        setLocations(filteredLocations);

        // Calculate total points
        const totalPoints = filteredLocations.reduce((acc, location) => acc + location.score_points, 0);
        setTotalPoints(totalPoints);
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };

    fetchProjectAndLocations();
  }, [id]);

  const handleLocationChange = (locationName) => {
    setSelectedLocation(locationName);

    if (locationName !== 'Homescreen') {
      const location = locations.find(loc => loc.location_name === locationName);
      const newLocationsVisited = new Set([...locationsVisited, location.location_name]);

      setPoints((prevPoints) =>
        locationsVisited.includes(location.location_name)
          ? prevPoints
          : prevPoints + location.score_points
      );
      setLocationsVisited(Array.from(newLocationsVisited));
    } else {
      setPoints(0);
      setLocationsVisited([]);
    }
  };

  const HomeScreen = () => {
    return (
      < ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
          {project.title}
        </Text>

        <Picker
          selectedValue={selectedLocation}
          onValueChange={(itemValue) => handleLocationChange(itemValue)}
          style={{ marginVertical: 20, height: 50, width: '100%' }}
        >
          <Picker.Item label="Homescreen" value="Homescreen" />
          {locations.map((location) => (
            <Picker.Item key={location.id} label={location.location_name} value={location.location_name} />
          ))}
        </Picker>

        {selectedLocation === 'Homescreen' ? (
          <View style={{ backgroundColor: '#8A2BE2', padding: 16, borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontSize: 18 }}>{project.title}</Text>
            {project.homescreen_display === 'Display initial clue' && (
              <Text style={{ color: '#fff' }}>Initial Clue: {project.initial_clue}</Text>
            )}
            {project.homescreen_display === 'Display all locations' && (
              <View>
                <Text style={{ color: '#fff', fontSize: 18 }}>Locations:</Text>
                {locations.map((location) => (
                  <Text key={location.id} style={{ color: '#fff' }}>{location.location_name}</Text>
                ))}
              </View>
            )}
          </View>
        ) : (
          <View>
            <Text style={{ fontSize: 18 }}>Location Clue: {locations.find(loc => loc.location_name === selectedLocation)?.clue}</Text>
            <Text style={{ fontSize: 18 }}>Location Content:</Text>
            <Text>{locations.find(loc => loc.location_name === selectedLocation)?.location_content}</Text>
          </View>
        )}

        {/* Mobile map view */}
        {selectedLocation === 'Homescreen' && (
          <MapView
            style={{ width: '100%', height: 300, marginTop: 20 }}
            initialRegion={{
              latitude: 51.505,
              longitude: -0.09,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {locations.map((location) => {
              const [latitude, longitude] = location.location_position.split(',').map(Number);
              return (
                <Marker
                  key={location.id}
                  coordinate={{ latitude, longitude }}
                  title={location.location_name}
                  description={location.clue}
                />
              );
            })}
          </MapView>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          <Button title={`Points: ${points} / ${totalPoints}`} onPress={() => {}} color="#8A2BE2" />
          <Button title={`Locations Visited: ${locationsVisited.length} / ${locations.length}`} onPress={() => {}} color="#8A2BE2" />
        </View>
    </ScrollView>
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      { project ? <HomeScreen /> : <Text>Loading...</Text> }
    </ScrollView>
  );
}
