// Base URL for the API
const API_BASE_URL ='https://0b5ff8b0.uqcloud.net/api';

// JWT token for authorization (replace with your actual token)
const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ3NTk0ODcifQ.PYGpsxjuzysuzHIad-l5VO9MbEYNBhx9X5QSfq4lMuw";

// Helper function to handle API requests
const apiRequest = async (endpoint, method = 'GET', body = null) => {
    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${JWT_TOKEN}`,
            'Content-Type': 'application/json'
        },
    };
    
    // If there is a body (e.g., for POST, PATCH), stringify the body
    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        if (method === 'GET') {
            return response.json(); // Parse the JSON response
        }
        return response; // Return the response (for POST, PATCH, DELETE)
    } catch (error) {
        console.error(`Error in API request: ${error}`);
        throw error; // Rethrow to handle it in the calling function
    }
};

// 1. GET Request - Fetch all projects
export const getProjects = async () => {
    try {
        const data = await apiRequest('/project');
        console.log('Projects:', data);
        return data; // Return data if needed in the calling component
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
};

// 1.5 GET Request - Fetch a single project
export const getProject = async (projectId) => {
    try {
        const data = await apiRequest(`/project?id=eq.${projectId}`);
        console.log('Project:', data);
        return data; // Return the project if needed
    } catch (error) {
        console.error('Error fetching project:', error);
    }
}

// 2. POST Request - Add a new project
export const addProject = async (newProject) => {
    try {
        await apiRequest('/project', 'POST', newProject);
    } catch (error) {
        console.error('Error adding project:', error);
    }
};

// 3. PATCH Request - Update a project
export const updateProject = async (projectId, updatedData) => {
    try {
        await apiRequest(`/project?id=eq.${projectId}`, 'PATCH', updatedData);
    } catch (error) {
        console.error(`Error updating project ${projectId}:`, error);
    }
};

// 4. DELETE Request - Delete a project
export const deleteProject = async (projectId) => {
    try {
        await apiRequest(`/project?id=eq.${projectId}`, 'DELETE');
        console.log(`Project ${projectId} deleted`);
    } catch (error) {
        console.error(`Error deleting project ${projectId}:`, error);
    }
};

// 5. GET Request - Fetch all locations
export const getLocations = async () => {
    try {
        const data = await apiRequest('/location');
        console.log('Locations:', data);
        return data; // Return locations if needed
    } catch (error) {
        console.error('Error fetching locations:', error);
    }
};

// 6. GET Request - Fetch a single location
export const getLocation = async (locationId) => {
    try {
        const data = await apiRequest(`/location?id=eq.${locationId}`);
        console.log('Location:', data);
        return data; // Return the location if needed
    } catch (error) {
        console.error('Error fetching location:', error);
    }
}

// 7. POST Request - Add a new location
export const addLocation = async (newLocation) => {
    try {
        await apiRequest('/location', 'POST', newLocation);
    } catch (error) {
        console.error('Error adding location:', error);
    }
};

// 8. PATCH Request - Update a location
export const updateLocation = async (locationId, updatedData) => {
    try {
        await apiRequest(`/location?id=eq.${locationId}`, 'PATCH', updatedData);
    } catch (error) {
        console.error(`Error updating location ${locationId}:`, error);
    }
};

// 9. DELETE Request - Delete a location
export const deleteLocation = async (locationId) => {
    try {
        await apiRequest(`/location?id=eq.${locationId}`, 'DELETE');
        console.log(`Location ${locationId} deleted`);
    } catch (error) {
        console.error(`Error deleting location ${locationId}:`, error);
    }
}

// ---- TRACKING ENDPOINTS ----

// 10. GET Request - Fetch all tracking entries
export const getTrackings = async () => {
    try {
        const data = await apiRequest('/tracking');
        console.log('Trackings:', data);
        return data;
    } catch (error) {
        console.error('Error fetching trackings:', error);
    }
};

// 11. POST Request - Add a new tracking entry
export const addTracking = async (newTracking) => {
    try {
        await apiRequest('/tracking', 'POST', newTracking);
    } catch (error) {
        console.error('Error adding tracking:', error);
    }
};

// 12. PATCH Request - Update a tracking entry
export const updateTracking = async (trackingId, updatedData) => {
    try {
        await apiRequest(`/tracking?id=eq.${trackingId}`, 'PATCH', updatedData);
    } catch (error) {
        console.error(`Error updating tracking ${trackingId}:`, error);
    }
};

// 13. DELETE Request - Delete a tracking entry
export const deleteTracking = async (trackingId) => {
    try {
        await apiRequest(`/tracking?id=eq.${trackingId}`, 'DELETE');
        console.log(`Tracking ${trackingId} deleted`);
    } catch (error) {
        console.error(`Error deleting tracking ${trackingId}:`, error);
    }
};

// ---- PARTICIPANT COUNTS ENDPOINTS ----

// 14. GET Request - Fetch participant counts for projects
export const getProjectParticipantCounts = async () => {
    try {
        const data = await apiRequest('/project_participant_counts');
        console.log('Project Participant Counts:', data);
        return data;
    } catch (error) {
        console.error('Error fetching project participant counts:', error);
    }
};

// 15. GET Request - Fetch participant counts for locations
export const getLocationParticipantCounts = async () => {
    try {
        const data = await apiRequest('/location_participant_counts');
        console.log('Location Participant Counts:', data);
        return data;
    } catch (error) {
        console.error('Error fetching location participant counts:', error);
    }
};

// ---- LOCATION CONTENT ENDPOINTS ----

// 16. GET Request - Fetch all location content
export const getLocationContent = async () => {
    try {
        const data = await apiRequest('/location_content');
        console.log('Location Content:', data);
        return data;
    } catch (error) {
        console.error('Error fetching location content:', error);
    }
};

// 17. POST Request - Add new location content
export const addLocationContent = async (newContent) => {
    try {
        await apiRequest('/location_content', 'POST', newContent);
    } catch (error) {
        console.error('Error adding location content:', error);
    }
};

// 18. PATCH Request - Update location content
export const updateLocationContent = async (contentId, updatedData) => {
    try {
        await apiRequest(`/location_content?id=eq.${contentId}`, 'PATCH', updatedData);
    } catch (error) {
        console.error(`Error updating location content ${contentId}:`, error);
    }
};

// 19. DELETE Request - Delete location content
export const deleteLocationContent = async (contentId) => {
    try {
        await apiRequest(`/location_content?id=eq.${contentId}`, 'DELETE');
        console.log(`Location content ${contentId} deleted`);
    } catch (error) {
        console.error(`Error deleting location content ${contentId}:`, error);
    }
};
