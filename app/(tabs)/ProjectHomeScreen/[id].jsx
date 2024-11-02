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

function StyledPickerItem({ label, value, selectedLocation, locationsVisited }) {
  let itemStyle = styles.unvisited; // Default for unvisited locations
  console.log('locationsVisitedStyledPickerItem:', locationsVisited);
  if (locationsVisited.includes(value)) {
    itemStyle = styles.visited; // Green for visited locations
  }
  if (value === selectedLocation) {
    itemStyle = { ...itemStyle, ...styles.selected }; // Add purple border for the current location
  }

  return (
    <Picker.Item label={label} value={value} style={itemStyle} />
  );
}

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
  const [viewInstructions, setViewInstructions] = useState(true);

  useEffect(() => {
    const welcomeMessage = async () => {
      Alert.alert(
        "✨ Welcome to Your Adventure! ✨",
        `Hello ${username}! 🎉🎉🎉
        \n---- Game Overview 🕹️ ----
        • Select a location from the dropdown below.
        • Follow clues to explore the area! 🗺️
        • Some locations may require:
            - A 🗺️ Physical Visit (marked with a map icon).
            - A 🔍 QR Code Scan (marked with a QR icon).
        • Your points and the number of visited locations update automatically!
  
        \n---- Earn Points 📈 ----
        • Certain locations offer points.
        • Earn by visiting and scanning QR codes.
  
        \n---- Discover Content 📜 ----
        • Once a location is visited, location content will be displayed.
  
        🌟 ENJOY YOUR JOURNEY! 🌟,`
      );
    };
    welcomeMessage();
  }, [username, viewInstructions]);
  


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
}, [id, isFocused, projectId, usernameFromRoute]);

  // using the useEffect hook to update thr points and locations visited count from trackings
  useEffect(() => {
    const updatePointsAndLocationsVisited = () => {
        try {
          let points = 0;
          const locationsVisited = new Set();
          userTrackings.forEach(tracking => {
            const location = locations.find((loc) => loc.id === tracking.location_id);
            if (location) {
                points += location.score_points;
                locationsVisited.add(location.location_name);
            }
          });
          // Options include: "Not Scored", "Number of Scanned QR Codes", "Number of Locations Entered"
          if (project && (project.participant_scoring === "Number of Locations Entered" || project.participant_scoring === "Number of Scanned QR Codes")) {
            setPoints(points);
          } else {
            setPoints("Not Scored");
          }
          setLocationsVisited(Array.from(locationsVisited));
        } catch (error) {
          console.warn('Error updating points and locations visited:', error);
        }
    };
    updatePointsAndLocationsVisited();
  }, [userTrackings, locations, isFocused, project]);


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
    }
  };

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
      // add style to the all the items in the picker
      itemStyle={{ fontSize: 18, color: 'blue', fontWeight: 'bold' }}
    >
      <Picker.Item label="Homescreen" value="Homescreen" style={styles.visited} />
      {locations.map((location) => (
        <StyledPickerItem
          key={location.id}
          // if location is visited then show the location name else "📍 Hidden location".
          label={
            locationsVisited.includes(location.location_name)
              ? `📍 ${location.location_name}`
              : "📍 Hidden location"
          }
          value={location.location_name}
          selectedLocation={selectedLocation}
          locationsVisited={locationsVisited}
        />
      ))}
    </Picker>

    {selectedLocation === 'Homescreen' ? (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.content}>{project.initial_clue}</Text>
      </View>
    ) : (
      <View style={styles.section}>
        {/* add icon to each title */}
        <Text style={styles.sectionTitle}>Location Clue 🕵️</Text>
        {/* put text in a gray box */}
        <Text style={styles.content}>{locations.find(loc => loc.location_name === selectedLocation)?.clue}</Text>

        <Text style={styles.sectionTitle}>Location Content 📜</Text>
        {
          // Display the location content in a WebView if content is available and that location is visited (in trackings)
          (locations.find(loc => loc.location_name === selectedLocation)?.location_content && locationsVisited.includes(selectedLocation)) ? (
            <WebView
              source={{ html: locations.find(loc => loc.location_name === selectedLocation)?.location_content }}
              style={styles.webview}
            />
          ) : (
            <Text>You have not visited this location yet... 🚶‍♂️</Text>
          )
        }
      </View>
    )}

    {/* Points and Locations Visited */}
    <View style={styles.footerContainer}>
      {/* if points is "Not Scored" then show "Not Scored" else show points/ totalPoints */}
      <Button title={`Points: ${points === "Not Scored" ? "Not Scored" : `${points} / ${totalPoints}`}`} onPress={() => {}} color="#8A2BE2" />
      <Button title={`Locations Visited: ${locationsVisited.length} / ${locations.length}`} onPress={() => {}} color="#8A2BE2" />
    </View>

    {/* View Instructions Button */}
    <View style={styles.viewInstructions}>
      <Button title="View Instructions" onPress={() => setViewInstructions(!viewInstructions)} color="#8A2BE2" />
    </View>

    {/* Back Button */}
    <View style={styles.backButton}>
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
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
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
    paddingHorizontal: 16, // Ensure text padding on both sides
    paddingVertical: 16, // Ensure text padding on top and bottom
    textAlign: 'left', // Align text to the left for readability
    width: '100%',            // Use full width of the container
    color: '#8A2BE2',
    
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
  // add content into a gray box
  content: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    marginVertical: 20,
    height: 50,
    width: '100%',
  },
  visited: {
    color: 'green',
    fontWeight: 'bold',
  },
  unvisited: {
    color: 'blue',
  },
  selected: {
    borderColor: '#8A2BE2',
    borderWidth: 2,
  },
  viewInstructions: {
    marginTop: 20,
  },
});
  