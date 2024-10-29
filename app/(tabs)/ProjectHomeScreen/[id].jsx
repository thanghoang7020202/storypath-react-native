import { View, Text, Button,  StyleSheet, ScrollView, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { getProject, getLocations, getProjects, getTrackings, addTracking } from '../../../components/api';
import MapView, { Marker } from 'react-native-maps';
import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import { useUsername } from '../../usernameContext';
import { useProjectId } from '../../projectIdContext';

export default function ProjectHomeScreen({ route }) {
  const isFocused = useIsFocused();
  const router = useRouter();
  const { id, username: usernameFromRoute } = useLocalSearchParams();            // projectId, update when in focus

  const { username, setUsername } = useUsername();  // Use the context (setUsername is not used in this component)
  const { projectId, setProjectId } = useProjectId(); // Use the context
  
  const [project, setProject] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Homescreen');
  const [points, setPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [locationsVisited, setLocationsVisited] = useState([]);
  const [userTrackings, setUserTrackings] = useState([]);

  useEffect(() => {
    const wellcomeMessage = async () => {
      Alert.alert(
        "🎉✨ Welcome, Superstar! ✨🎉", 
        `Hey ${username}!\n\nLove to see you here! Let's get started! 🚀🚀🚀`
      );
    }
    wellcomeMessage();
  }, [username]);

  /**
     * Fetch the project and locations when the component mounts.
     */
  useEffect(() => {
    const fetchProjectAndLocations = async () => {
      try {
        setUsername(usernameFromRoute);
        console.log('projectHomeScreen id:', id);
        const projectData = await getProject(id);
        const locationsData = await getLocations();
        const trackingsData = await getTrackings();
        
        // Filter locations by project id
        const filteredLocationsData = locationsData.filter((location) => location.project_id === projectData[0].id);
        // Filter trackings by project id and username
        const filteredTrackingsData = trackingsData.filter((tracking) => tracking.project_id === projectData[0].id && tracking.participant_username === username);
        setProject(projectData[0]); // Assuming projectData is an array
        setProjectId(projectData[0].id);
        setLocations(filteredLocationsData);
        setUserTrackings(filteredTrackingsData);

        // Calculate total points
        let totalPoints = 0;
        filteredLocationsData.forEach(location => {
            totalPoints += location.score_points;
        });
        setTotalPoints(totalPoints);
      } catch (error) {
        console.warn('Error fetching project and locations at projectHomeScreen:', error);
      }
    };
    fetchProjectAndLocations();
}, [id, isFocused]);

  // using the useEffect hook to update thr points and locations visited count from trackings
  useEffect(() => {
    const updatePointsAndLocationsVisited = () => {
        let points = 0;
        const locationsVisited = new Set();
        userTrackings.forEach(tracking => {
            const location = locations.find((loc) => loc.id === tracking.location_id);
            points += location.score_points;
            locationsVisited.add(location.location_name);
        });
        setPoints(points);
        setLocationsVisited(Array.from(locationsVisited));
    };
    updatePointsAndLocationsVisited();
  }, [userTrackings, locations, isFocused]);


  /**
     * Handle the location change event.
     * @param {Object} event - The event object
     * @returns {void}
     * */
  const handleLocationChange = (event) => {
    const newLocation = event;
    setSelectedLocation(newLocation);

    // Update score and locations visited count
    if (newLocation !== 'Homescreen') {
        const location = locations.find((loc) => loc.location_name === newLocation);
        const newLocationsVisited = new Set([...locationsVisited, location.location_name]);
        const pointCompute = () => {
            // if the location has not been visited before, add the points
            if (!locationsVisited.includes(location.location_name)) {
                return points + location.score_points;
            }
            return points;
        };
        // alert if the selected location is already visited
        if (locationsVisited.includes(location.location_name)) {
            Alert.alert(
                'Location Already Visited',
                'You have already visited this location. Please select another location.',
                [{ text: 'OK' }]
            );
        }
        setPoints(pointCompute());
        setLocationsVisited(Array.from(newLocationsVisited));
    } else {
        //setPoints(0);
        //setLocationsVisited([]);
    }
  };

  // /**
  //  * Fit the map bounds to the markers.
  //  * @param {Object} locations - The locations array
  //  * @returns {null} - Returns null
  //  */
  // const FitMapBounds = ({ locations }) => {
  //   const map = useMap(); // Get the map instance

  //   useEffect(() => {
  //       if (locations.length > 0) {
  //           const bounds = locations.map(location => {
  //               const [latitude, longitude] = location.location_position.slice(1, -1).split(',').map(coord => parseFloat(coord.trim()));
  //               return [latitude, longitude];
  //           });
  //           map.fitBounds(bounds); // Automatically fit bounds to markers
  //       }
  //   }, [locations, map]);

  //   return null;
  // };

  if (!project || locations.length === 0) {
    return <Text>No location found. Keep loading...</Text>;
}


  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
    {/* Title with background */}
    <View style={styles.titleContainer}>
      <Text style={styles.titleText}>{project.title}</Text>
    </View>

    <Picker
      selectedValue={selectedLocation}
      onValueChange={handleLocationChange}
      style={styles.picker}
    >
      <Picker.Item label="Homescreen" value="Homescreen" />
      {locations.map((location) => (
        <Picker.Item key={location.id} label={location.location_name} value={location.location_name} />
      ))}
    </Picker>

    {selectedLocation === 'Homescreen' ? (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text>{project.initial_clue}</Text>
      </View>
    ) : (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location Clue</Text>
        <Text>{locations.find(loc => loc.location_name === selectedLocation)?.clue}</Text>

        <Text style={styles.sectionTitle}>Location Content</Text>
        {
          (locations.find(loc => loc.location_name === selectedLocation)?.location_content) ? (
            <WebView
              source={{ html: locations.find(loc => loc.location_name === selectedLocation)?.location_content }}
              style={styles.webview}
            />
          ) : (
            <Text>No content available for this location</Text>
          )
        }
        {/* <WebView
          source={{ html: locations.find(loc => loc.location_name === selectedLocation)?.location_content }}
          style={styles.webview}
        /> */}
      </View>
    )}

    {/* Points and Locations Visited */}
    <View style={styles.footerContainer}>
      <Button title={`Points: ${points} / ${totalPoints}`} onPress={() => {}} color="#8A2BE2" />
      <Button title={`Locations Visited: ${locationsVisited.length} / ${locations.length}`} onPress={() => {}} color="#8A2BE2" />
    </View>

    <View style={styles.backButton}>
    {/* Back Button */}
    <Button title="Go Back" onPress={() => router.push('/projects')} color="#8A2BE2" />
    </View>
  </ScrollView>
);
  };

  const styles = StyleSheet.create({
    titleContainer: {
      backgroundColor: '#8A2BE2',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 16,
    },
    titleText: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    picker: {
      marginVertical: 20,
      height: 50,
      width: '100%',
    },
    section: {
      backgroundColor: '#f9f9f9',
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    webview: {
      height: 200,
      borderRadius: 8,
    },
    footerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    backButton: {
      marginVertical: 20,
      flex: 1,
    },
  });