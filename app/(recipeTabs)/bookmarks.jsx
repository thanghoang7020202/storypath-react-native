import React from "react";
import { View, FlatList, Text } from "react-native";
import { useRouter } from 'expo-router';
import { colors, fonts, sizes } from "../../data/theme";
import RecipeCard from '../../components/RecipeCard';
import initialRecipes from "../../data/recipes";

export default function Bookmarks() {
  const router = useRouter();
  const filteredRecipes = initialRecipes.filter(recipe => recipe.isBookmark);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <FlatList
        data={filteredRecipes}
        keyExtractor={item => item.id.toString()}
        ListFooterComponent={
          <View style={{ marginBottom: sizes.padding * 5 }}>
            <Text style={{ ...fonts.body4 }}>That's the end of bookmarked recipes.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() => router.push(`/recipe/${item.id}`)}
          />
        )}
        style={{
          padding: sizes.padding,
        }}
      />
    </View>
  );
}