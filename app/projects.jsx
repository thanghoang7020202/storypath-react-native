import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGlobalSearchParams, useLocalSearchParams, useRouter } from 'expo-router';
import { getProjects, deleteProject, getProjectParticipantCounts, addTracking, getTrackings } from "../components/api";
import { useUsername } from './usernameContext';

export default function ProjectList() {
  const router = useRouter();
  const { username, setUsername } = useUsername();  // Use the context
  const { id } = useLocalSearchParams();
  const [projectList, setProjectList] = useState([]);
  const [projectParticipantCounts, setProjectParticipantCounts] = useState([]);
  const navigation = useNavigation();

  // Fetch projects when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        let data = await getProjects();
        const count = await getProjectParticipantCounts();
        
        //data = data.filter((project) => project.id !== id);

        setProjectList(data);
        setProjectParticipantCounts(count);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [id]);

  // Handle deleting a project
  const handleDelete = async (projectId) => {
    try {
      await deleteProject(projectId);
      setProjectList((prevProjects) =>
        prevProjects.filter((proj) => proj.id !== projectId)
      );
    } catch (error) {
      console.error(`Error deleting project ${projectId}:`, error);
    }
  };

  // Render each project item
  const renderProjectItem = ({ item }) => (
    <View style={styles.projectItem}>
      <View style={styles.projectInfo}>
        <Text style={styles.projectTitle}>{item.title}</Text>
        <View style={styles.participantsBadge}>
          <Text style={styles.participantsText}>Participants: 
            {projectParticipantCounts.find((count) => count.project_id === item.id)?.number_participants || 0}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.arrowButton}
        // go to the projectHomeScreen after clicking the arrow
        onPress={() => {
          router.push({ pathname: `./ProjectHomeScreen/${item.id}?username=${username}` });
        }}
      >
        <Text style={styles.arrowText}>➔</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Projects</Text>
      {projectList.length > 0 ? (
        <FlatList
          data={projectList}
          renderItem={renderProjectItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text>No projects available. Keep loading...</Text>
      )}
    </View>
  );
}

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
});
