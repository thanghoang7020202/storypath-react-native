import React, { createContext, useContext, useState } from 'react';

// Create Context for Username
const UsernameContext = createContext(
  {
    username: 'participant_username', // Default value for the username
    setUsername: () => {} // Default value for the function
  }
);

// Custom hook for consuming the context
export const useUsername = () => useContext(UsernameContext);

// Provider component
export const UsernameProvider = ({ children }) => {
  const [username, setUsername] = useState('participant_username'); // Default value for the username

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
};


// to use the context in storypath/app/index.jsx, you can import the context and use the custom hook to access the username and setUsername functions:
// example: 
// import { useUsername } from './usernameContext';  // Use the context
// import Profile from './profile'; // Import the Profile component

// export default function Index() {
//   const { username, setUsername } = useUsername(); // Use the context

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to StoryPath</Text>
//       <Text style={styles.subtitle}>Explore Unlimited Location-based Experiences</Text>
//       <Text style={styles.description}>
//         With StoryPath, you can discover and create amazing location-based adventures. From city
//         tours to treasure hunts, the possibilities are endless!
//       </Text>

//       <TouchableOpacity style={styles.button} onPress={ () => router.push( { pathname: '/profile', query: { user: username, updateUsername: setUsername } } ) }>
//         <Text style={styles.buttonText}>Create Profile</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.button} onPress={() => router.push('/projects')}>
//         <Text style={styles.buttonText}>Explore Projects</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// to use UsernameProvider
// import { UsernameProvider } from './usernameContext'; // Import the UsernameProvider
// import Index from './index'; // Import the Index component

// export default function App() {
//   return (
//     <UsernameProvider>
//       <Index />
//     </UsernameProvider>
//   );
// }

// component that uses and updates the username
// import { useUsername } from './usernameContext';  // Use the context

// export default function Profile() {
//   const { username, setUsername } = useUsername(); // Use the context

//   return (
//     <View style={styles.container}>
//       {/* Profile Information */}
//       <Text style={styles.profileHeader}>Your Profile</Text>
//       <Text style={styles.currentUser}>Current User: {username}</Text>
//     </View>
//   );


