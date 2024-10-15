import React from "react";
import { View, FlatList, Text } from "react-native";
import { useRouter } from 'expo-router';
import { colors, fonts, sizes } from "../../data/theme";
import ShowMap from "../../components/ShowMap";

export default function Map() {
  const router = useRouter(); // Get the router object

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
        <ShowMap />
    </View>
  );
}