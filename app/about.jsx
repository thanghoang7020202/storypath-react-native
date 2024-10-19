import React from 'react';
import { View, Text, StyleSheet, Linking, ScrollView, TouchableOpacity, Button } from 'react-native';

const About = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title and Subtitle */}
      <View style={styles.header}>
        <Text style={styles.title}>About StoryPath</Text>
        <Text style={styles.subtitle}>Bringing location-based narratives to life.</Text>
      </View>
      
      {/* Main Description */}
      <View style={styles.content}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>StoryPath</Text> is an innovative platform that turns every location into a new adventure. 
          It allows users to create and explore virtual museum exhibits, immersive location-based tours, and treasure hunts with interactive clues.
        </Text>
        <Text style={styles.paragraph}>
          Whether you're crafting educational experiences, designing engaging tours, or building unique treasure hunts, 
          StoryPath provides the tools you need. The platform includes a web app built with React for authoring experiences 
          and a mobile player built with React Native for exploring them in real-world locations.
        </Text>
        <Text style={styles.paragraph}>
          With <Text style={styles.bold}>StoryPath</Text>, the only limit is your imagination. Start exploring the world around you in a new way.
        </Text>

        {/* Contributors Section */}
        <Text style={styles.sectionTitle}>Contributors</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}><Text style={styles.bold}>Cao Quoc Thang Hoang</Text> - Designer, Project Developer and Owner</Text>
          {/* Additional contributors can be added here */}
        </View>

        {/* License Section */}
        <Text style={styles.sectionTitle}>License</Text>
        <View style={styles.licenseBox}>
          <Text style={styles.licenseText}>
            This project is <Text style={styles.bold}>private and confidential</Text>, and delicate as an assignment of the course 
            [COMP2140] Web/Mobile Programming from the University of Queensland, Australia <Text style={styles.bold}>before March 2025</Text>.
            After that, this project will be published under the <Text style={styles.bold}>MIT License</Text>. Feel free to use, modify, and distribute 
            the software as long as you adhere to the terms of the license.
          </Text>
        </View>

        {/* Contact Section */}
        <Text style={styles.sectionTitle}>Contact</Text>
        <TouchableOpacity style={styles.contactBox} onPress={() => Linking.openURL('mailto:s4759487@uq.edu.au')}>
          <Text style={styles.contactText}>
            Have questions? Reach out to us via email at <Text style={styles.linkText}>s4759487@uq.edu.au</Text>.
          </Text>
        </TouchableOpacity>

        {/* Repository and Contributions */}
        <Text style={styles.sectionTitle}>Repository and Contributions</Text>
        <Text style={styles.centerText}>
          The source code for StoryPath is available on{' '}
          <Text style={styles.linkText} onPress={() => Linking.openURL('https://github.com/thanghoang7020202/storypath')}>
            GitHub
          </Text>. Contributions are always welcome! Fork the repository and submit a pull request to help improve the platform.
        </Text>
      </View>
      <Button onPress={() => router.back()} title='Go Back' />
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8A2BE2',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  content: {
    marginTop: 10,
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 15,
    textAlign: 'center',
  },
  list: {
    marginBottom: 30,
  },
  listItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  licenseBox: {
    backgroundColor: '#e0f7fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  licenseText: {
    fontSize: 16,
    color: '#00796b',
    textAlign: 'center',
  },
  contactBox: {
    backgroundColor: '#f0f4c3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  contactText: {
    fontSize: 16,
    color: '#388e3c',
    textAlign: 'center',
  },
  linkText: {
    color: '#1e88e5',
    textDecorationLine: 'underline',
  },
  centerText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
});

export default About;
