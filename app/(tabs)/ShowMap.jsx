import React, { useState, useEffect } from "react";
import { StyleSheet, Appearance, View, SafeAreaView, Text } from "react-native";
import MapView, { Circle } from "react-native-maps";
import * as Location from 'expo-location';
import { getDistance } from "geolib";
//import { locations } from "../data/locations";
import { useProjectId } from ".././projectIdContext";
import { getProject, getTracking, addTracking, getLocations } from "../../components/api";

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
    }
}

export default function ShowMap() {

    const [locations, setLocations] = useState([]);
    const {projectId, setProjectId } = useProjectId();

    useEffect(() => {
        const fetchData = async () => {
            try {
              const locationData = await getLocations();
              for (let i = 0; i < locationData.length; i++) {
                  console.log("locationData", locationData[i].project_id);
              }
              // filter by project id
              const data = locationData.filter(location => location.project_id == projectId);
              console.log("data", data.map(location => location.location_trigger));
              // convert to object-based latlong
              // format: {"id":"12","location":"Mount Gravatt Tafe","latlong":"-27.526065, 153.0909823"}
              const updatedLocations = data.map(location => {
                if (location.location_trigger == "Location Entry" || location.location_trigger == "Both Location Entry and QR Code Scan") {
                  const [latitude, longitude] = location.location_position.slice(1, -1).split(',').map(coord => parseFloat(coord.trim()));
                  return {
                      id: location.id,
                      location: location.location_name,
                      latlong: latitude + ", " + longitude,
                      coordinates: {
                          latitude: latitude,
                          longitude: longitude
                      }
                  };
                  // ignore locations that are not for location entry
                }
                return {
                  id: null,
                  location: null,
                  latlong: null,
                  coordinates: null
                }
              });

              console.log("updatedLocations", updatedLocations);
              // remove null items
              const filteredLocations = updatedLocations.filter(location => location.id != null);
              
              setLocations(filteredLocations);
            } catch (error) {
                console.error('Error fetching locations in ShowMap:', error);
            }
        }
        fetchData();
    }
    , [projectId]);

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

    console.log("colorScheme", colorScheme);

    useEffect(() => {
        async function requestLocationPermission() {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                setMapState(prevState => ({
                    ...prevState,
                    locations: locations,
                    locationPermission: true
                }));
            }
        }
        requestLocationPermission();
    }, [locations]);

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
    }, [mapState.locationPermission]);

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