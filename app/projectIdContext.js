import React, { createContext, useContext, useState } from 'react';

// Create Context for Username
const ProjectIDContext = createContext(
  {
    projectId: 'project_id',      // Default value for the projectId
    setProjectId: () => {}        // Default value for the function
  }
);

// Custom hook for consuming the context
export const useProjectId = () => useContext(ProjectIDContext);

// Provider component
export const ProjectIdProvider = ({ children }) => {
  const [projectId, setProjectId] = useState('original_project_id'); // Default value for the projectId

  return (
    <ProjectIDContext.Provider value={{ projectId, setProjectId }}>
      {children}
    </ProjectIDContext.Provider>
  );
};