import React, { useState, useEffect } from "react";
import { StyleSheet, Appearance, View, SafeAreaView, Text, Alert } from "react-native";
import MapView, { Circle } from "react-native-maps";
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import { getDistance } from "geolib";
//import { locations } from "../data/locations";
import { useProjectId } from ".././projectIdContext";
import { useUsername } from "../usernameContext";
import { getProject, getTrackings, addTracking, getLocations, getProjects } from "../../components/api";

// Define Stylesheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    nearbyLocationSafeAreaView: {
        backgroundColor: "black",
    },
    nearbyLocationView: {
        padding: 20,
    },
    nearbyLocationText: {
        color: "white",
        lineHeight: 25
    }
});

// Get light or dark mode
const colorScheme = Appearance.getColorScheme();

// Component for displaying nearest location and whether it's within 100 metres
function NearbyLocation(props) {
    if(typeof props.location != "undefined") {
        return (
            <SafeAreaView style={styles.nearbyLocationSafeAreaView}>
                <View style={styles.nearbyLocationView}>
                    <Text style={styles.nearbyLocationText}>
                        {props.location}
                    </Text>
                    {props.distance.nearby &&
                        <Text style={{
                            ...styles.nearbyLocationText,
                            fontWeight: "bold"
                        }}>
                            Within 100 Metres!
                        </Text>
                    }
                </View>
            </SafeAreaView>
        );
    } else {
        return (
            <SafeAreaView style={styles.nearbyLocationSafeAreaView}>
                <View style={styles.nearbyLocationView}>
                    <Text style={styles.nearbyLocationText}>
                        No nearby location
                    </Text>
                </View>
            </SafeAreaView>
        );
    }
}

export default function ShowMap() {

    const isFocused = useIsFocused();
    const [locations, setLocations] = useState([]);
    const {projectId, setProjectId } = useProjectId();
    const {username, setUsername } = useUsername();
    const [trackings, setTrackings] = useState([]);
    const [isWithin100m, setIsWithin100m] = useState(false);
    const [nearestLocation, setNearestLocation] = useState(null); // new
    const [project, setProject] = useState(null);

    // update trackings
    useEffect(() => {
        const fetchData = async () => {
            try {
                const trackingData = await getTrackings();
                const projectData = await getProjects();
                const project = projectData.find(project => project.id === projectId);
                setProject(project);
                const data = trackingData.filter(tracking => tracking.project_id == projectId);
                console.log("trackings", data);
                setTrackings(data);
            } catch (error) {
                console.error('Error fetching trackings in ShowMap:', error);
            }
        }
        fetchData();
    }, [projectId, isWithin100m, nearestLocation, isFocused]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const locationData = await getLocations();
                const data = locationData.filter(location => location.project_id == projectId);
                const updatedLocations = data.map(location => {
                // UNCOMMNENT THE LINE BELOW to test location_trigger, otherwise project.participant_scoring will be used
                //if (location.location_trigger === "Location Entry" || location.location_trigger === "Both Location Entry and QR Code Scan") {
                const [latitude, longitude] = location.location_position.slice(1, -1).split(',').map(coord => parseFloat(coord.trim()));
                return {
                    id: location.id,
                    location: location.location_name,
                    score_points: location.score_points,
                    coordinates: { latitude, longitude }
                };
                    return null;
                }).filter(Boolean);
                
                setLocations(updatedLocations);
                console.log("locations", updatedLocations);
            } catch (error) {
                console.error('Error fetching locations in ShowMap:', error);
            }
        };
        fetchData();
    }, [projectId, project, isWithin100m, nearestLocation, isFocused]);

    // add a new tracking entry if user is within 100m of a location entry point and has not visited the location before (not in trackings)
    useEffect(() => {
        const addTrackingEntry = async () => {
            // Check if nearestLocation exists and is within 100m
            if (isWithin100m && nearestLocation
                && !trackings.some(tracking => tracking.location_id === nearestLocation.id && tracking.participant_username === username)
                && (project.participant_scoring === "Number of Locations Entered" || project.participant_scoring === "Not Scored")) { 
                const newTracking = {
                    project_id: projectId,
                    location_id: nearestLocation.id,
                    points: nearestLocation.score_points,
                    username: "s4759487", // fixed username for now
                    participant_username: username,
                };
                try {
                    await addTracking(newTracking);
                    setTrackings(prevTrackings => [...prevTrackings, newTracking]);
                    console.log('Tracking added:', newTracking);
                    Alert.alert(
                        "Visit Location Alert",
                        "You have successfully visited a location! Keep exploring! 🚀",
                    );
                } catch (error) {
                    console.error('Error adding tracking in ShowMap:', error);
                }
            } else {
                console.log(isWithin100m, nearestLocation, trackings.some(tracking => tracking.location_id === nearestLocation?.id && tracking.participant_username === username));
            }
        };
        addTrackingEntry();
    }, [isWithin100m, nearestLocation, trackings, username]);
    

    // Setup state for map data
    const initialMapState = {
        locationPermission: false,
        locations: locations,
        userLocation: {
            latitude: -27.5263381,
            longitude: 153.0954163,
            // Starts at "Indooroopilly Shopping Centre"
        },
        nearbyLocation: {}
    };
    
    const [ mapState, setMapState ] = useState(initialMapState);
    useEffect(() => {
        async function requestLocationPermission() {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                setMapState(prevState => ({
                    ...prevState,
                    // filter out locations that are not in trackings
                    locations: locations.filter(location => trackings.some(tracking => tracking.location_id === location.id && tracking.participant_username === username)),
                    locationPermission: true
                }));
            }
        }
        requestLocationPermission();
    }, [locations, trackings, username]);

    useEffect(() => {
        // Function to retrieve location nearest to current user location
        function calculateDistance(userLocation) {
            const nearestLocations = mapState.locations.map(location => {
                const metres = getDistance(
                    userLocation,
                    location.coordinates
                );
                location["distance"] = {
                    metres: metres, 
                    nearby: metres <= 100 ? true : false
                };
                return location;
            }).sort((previousLocation, thisLocation) => {
                return previousLocation.distance.metres - thisLocation.distance.metres;
            });
            return nearestLocations.shift();
        }

        let locationSubscription = null;

        if (mapState.locationPermission) {
            (async () => {
                locationSubscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        distanceInterval: 10 // in meters
                    },
                    location => {
                        const userLocation = {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude
                        };
                        const nearbyLocation = calculateDistance(userLocation);
                        setNearestLocation(nearbyLocation);
                        setIsWithin100m(nearbyLocation?.distance.nearby || false);
                        setMapState(prevState => ({
                            ...prevState,
                            userLocation,
                            nearbyLocation: nearbyLocation
                        }));
                    }
                );
            })();
        }

        // Cleanup function
        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, [mapState.locationPermission, isFocused]);

    return (
        <>
            <MapView
                camera={{
                    center: mapState.userLocation,
                    pitch: 0, // Angle of 3D map
                    heading: 0, // Compass direction
                    altitude: 3000, // Zoom level for iOS
                    zoom: 15 // Zoom level For Android
                }}
                showsUserLocation={mapState.locationPermission}
                style={styles.container}
            >
                {mapState.locations.map(location => (
                    <Circle
                        key={location.id}
                        center={location.coordinates}
                        radius={100}
                        strokeWidth={3}
                        strokeColor="#A42DE8"
                        fillColor={colorScheme == "dark" ? "rgba(128,0,128,0.5)" : "rgba(210,169,210,0.5)"}
                    />
                ))}
            </MapView>
            <NearbyLocation
                {...mapState.nearbyLocation}
            />
        </>
    );
}