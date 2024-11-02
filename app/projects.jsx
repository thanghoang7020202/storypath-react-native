import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Button } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useGlobalSearchParams, useLocalSearchParams, useRouter } from 'expo-router';
import { getProjects, deleteProject, getProjectParticipantCounts, addTracking, getTrackings } from "../components/api";
import { useUsername } from './usernameContext';

export default function ProjectList() {

  const isFocused = useIsFocused();                                             // Get the focused state          
  const router = useRouter();                                                   // Get the router object                     
  const { username, setUsername } = useUsername();                              // Use the context
  const { id } = useLocalSearchParams();                                        // Get the local search params
  const [projectList, setProjectList] = useState([]);                           // State to hold the project list
  const [projectParticipantCounts, setProjectParticipantCounts] = useState([]); // State to hold the project participant counts
  const navigation = useNavigation();                                           // Get the navigation object

  /**
   * Function to fetch the projects and project participant counts
   * @param {String} username The new username
   * */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        let data = await getProjects();                     // Fetch the projects
        const count = await getProjectParticipantCounts();  // Fetch the project participant counts
        setProjectList(data);
        setProjectParticipantCounts(count);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [id, isFocused]);

  /**
   * Function to handle the project selection
   * @param {Object} project The selected project
   * */
  const renderProjectItem = ({ item }) => (
    // Display the project item
    <TouchableOpacity
    style={styles.projectItem}
    onPress={() => {
      router.push({ pathname: `./ProjectHomeScreen/${item.id}?username=${username}` });
    }}
  > 
    <View style={styles.projectInfo}>
      {/* Display the project title */}
      <Text style={styles.projectTitle}>{item.title}</Text>
      
      {/* Display the number of participants */}
      <View style={styles.participantsBadge}>
        <Text style={styles.participantsText}>
          Participants: {projectParticipantCounts.find((count) => count.project_id === item.id)?.number_participants || 0}
        </Text>
      </View>
    </View>

    {/* Display the arrow button */}
    <View style={styles.arrowButton}>
      <Text style={styles.arrowText}>➔</Text>
    </View>
  </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Display the heading and subtitle */}
      <Text style={styles.heading}>Projects</Text>
      <Text style={styles.subTitle}>Choose one of the projects below to get started.</Text>
      
      {/* Display the project list */}
      {projectList.length > 0 ? (
        <FlatList
          data={projectList}
          renderItem={renderProjectItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text>No projects available. Keep loading...</Text>
      )}

      {/* Go Back Button */}
      <Button title="Go Back" onPress={() => router.back()} color={'#8A2BE2'} />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 20,
    textAlign: 'center',
  },
  projectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  projectInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  participantsBadge: {
    backgroundColor: '#8A2BE2',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
    // make fix the length of the badge
    width: 150,
  },
  participantsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  arrowButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 24,
    color: '#8A2BE2',
  },
  subTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
});
