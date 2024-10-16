// ImagePicker.jsx
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {SafeAreaView, ScrollView, View, Image, Dimensions, Text, Button } from 'react-native';

// Get the screen width and height for styling
const { width, height } = Dimensions.get("window");

const styles = {
    container: {
        padding: 20
    },
    photoFullView: {
        marginBottom: 20
    },
    photoEmptyView: {
        borderWidth: 3,
        borderRadius: 10,
        borderColor: "#999",
        borderStyle: "dashed",
        width: "100%",
        height: height / 2,
        marginBottom: 20
    },
    photoFullImage: {
        width: "100%",
        height: height / 2,
        borderRadius: 10
    },
    buttonView: {
        flexDirection: "row",
        justifyContent: "space-around"
    }
};

// Image Picker Screen Component
const ImagePickerScreen = ({ onImageSelect, onClose }) => {
  const [selectedImage, setSelectedImage] = useState({});

  // Function to handle photo selection
  const pickImage = async () => {
    // Request media library permissions
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    // If the user didn't cancel and an image is selected, update the state
    if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0]);
    }
  };

  // Function to handle the save button press
  const handleSave = () => {
    if (selectedImage) {
      onImageSelect(selectedImage); // Pass the selected image to the parent component
      onClose(); // Close the image picker
    }
  };

  // Function to remove the selected photo
    async function handleRemovePress() {
        setSelectedImage({});
    }

  // Component to display the selected photo or a placeholder
    function Photo(props) {
        if (hasPhoto) {
            return (
                <View style={styles.photoFullView}>
                    <Image
                        style={styles.photoFullImage}
                        resizeMode="cover"
                        source={{ uri: selectedImage.uri }}
                    />
                </View>
            );
        } else {
            return <View style={styles.photoEmptyView} />;
        }
    }

    // Check if a photo has been selected
    const hasPhoto = Boolean(selectedImage.uri);

    return (
        <View>
            <View style={styles.container}>
                <Photo />
                <View style={styles.buttonView}>
                <Button
                    onPress={pickImage}
                    title={hasPhoto ? "Change Photo" : "Add Photo"}
                />
                {hasPhoto && <Button onPress={handleRemovePress} title="Remove Photo" />}
                </View>
            </View>

            {selectedImage && (
                <View style={{ marginTop: 20 }}>
                <Text>Selected image: {selectedImage.uri}</Text>
                <Button title="Save Image" onPress={handleSave} />
                </View>
            )}

            {/* Optionally, you could add a "Cancel" button */}
            <Button title="Cancel" onPress={onClose} />
        </View>
    );
};

export default ImagePickerScreen;
