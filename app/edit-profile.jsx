import { View, Text, TextInput, Button, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import ImagePickerScreen from '../components/imagePicker';

export default function EditProfile() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(null); // State to hold the selected profile image
  const [isPickerVisible, setPickerVisible] = useState(false); // State to control modal visibility
  const [name, setName] = useState('John Doe'); // Default name state
  const [email, setEmail] = useState('john.doe@example.com'); // Default email state
  const [initialData, setInitialData] = useState({ name: 'John Doe', email: 'john.doe@example.com' });
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission state
  const [errorFields, setErrorFields] = useState([]); // Error tracking for required fields

  // Function to handle the selected image from the ImagePicker
  function handleImageChange(image) {
    setProfileImage(image); // Update the profile image
  }

  // Function to open/close the image picker
  function toggleImagePicker() {
    setPickerVisible(!isPickerVisible);
  }

  // Function to handle saving the profile
  function handleSave() {
    const errors = [];
    if (!name) errors.push('name');
    if (!email) errors.push('email');

    setErrorFields(errors);

    if (errors.length > 0) {
      return; // Prevent saving if there are errors
    }

    // Mark form as submitting and save data
    setIsSubmitting(true);
    setTimeout(() => {
      console.log('Profile saved:', { name, email, profileImage });
      setInitialData({ name, email }); // Update initial data after saving
      setIsSubmitting(false);
      router.back(); // Navigate back after save
    }, 1000);
  }

  // Function to check if there are unsaved changes
  function hasUnsavedChanges() {
    return name !== initialData.name || email !== initialData.email || profileImage;
  }

  // Function to handle cancel action with unsaved changes confirmation
  function handleCancel() {
    if (hasUnsavedChanges()) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to discard them?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  }

  return (
    <View className="flex-1 bg-white items-center pt-10 px-4">
      {/* Header */}
      <Text className="text-2xl font-bold mb-5">Edit Profile</Text>

      {/* Profile Image Section */}
      <TouchableOpacity
        className="items-center justify-center rounded-full border border-[#ff6f61] w-30 h-30 overflow-hidden mb-5"
        onPress={toggleImagePicker}
      >
        {profileImage ? (
          <Image source={{ uri: profileImage.uri }} className="w-full h-full object-cover" />
        ) : (
          <Image source={require('../assets/icons/cheese.png')} className="w-full h-full object-cover" />
        )}
        <Text className="absolute text-[#ff6f61] font-bold text-center top-1/2">Tap to Change</Text>
      </TouchableOpacity>

      {/* Image Picker Modal */}
      <Modal visible={isPickerVisible} animationType="slide" onRequestClose={toggleImagePicker}>
        <ImagePickerScreen onImageSelect={handleImageChange} onClose={toggleImagePicker} />
      </Modal>

      {/* Edit Name */}
      <Text className="text-base mb-2">Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        className={`border border-gray-300 rounded-lg w-full p-2 mb-5 ${errorFields.includes('name') ? 'border-red-500' : ''}`}
        placeholder="Enter your name"
      />
      {errorFields.includes('name') && <Text className="text-red-500">Name is required.</Text>}

      {/* Edit Email */}
      <Text className="text-base mb-2">Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        className={`border border-gray-300 rounded-lg w-full p-2 mb-5 ${errorFields.includes('email') ? 'border-red-500' : ''}`}
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      {errorFields.includes('email') && <Text className="text-red-500">Email is required.</Text>}

      {/* Save Button */}
      <Button title={isSubmitting ? 'Saving...' : 'Save Profile'} onPress={handleSave} disabled={isSubmitting} />

      {/* Cancel Button */}
      <View className="mt-3">
        <Button onPress={handleCancel} title="Cancel" />
      </View>
    </View>
  );
}
