import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getProjects, deleteProject } from "../components/api";

export default function ProjectList() {
  const [projectList, setProjectList] = useState([]);
  const navigation = useNavigation();

  // Fetch projects when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjectList(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

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
          <Text style={styles.participantsText}>Participants: {item.participants}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => navigation.navigate('ProjectDetails', { projectId: item.id })}
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
        <Text>No projects available.</Text>
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
    color: '#ff6f61',
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
    backgroundColor: '#ff6f61',
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
    color: '#ff6f61',
  },
});
