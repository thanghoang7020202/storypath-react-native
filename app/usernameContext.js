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

