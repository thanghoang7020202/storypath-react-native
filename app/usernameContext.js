import React, { createContext, useContext, useState } from 'react';

// Create Context for Username
const UsernameContext = createContext();

// Custom hook for consuming the context
export const useUsername = () => useContext(UsernameContext);

// Provider component
export const UsernameProvider = ({ children }) => {
  const [username, setUsername] = useState('participant_username');

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
};
