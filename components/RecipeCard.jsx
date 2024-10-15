import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { colors, sizes, fonts } from "../data/theme";

function RecipeCard({ recipe, onPress }) {
    return (
        // Pressable is used to make the card clickable
        <Pressable 
            style={({ pressed }) => [
                {
                    flexDirection: "row",
                    alignItems: "center",
                    padding: sizes.padding / 2,
                    marginBottom: sizes.padding,
                    borderRadius: sizes.radius,
                    backgroundColor: pressed ? colors.lightGreen : colors.grayLight,
                },
            ]}
            onPress={onPress}
        >
            {({ pressed }) => (
                <>
                    {/* Image Render */}
                    <Image
                        source={recipe.image}
                        resizeMode="cover"
                        style={{
                            flex: 1,
                            width: "35%",
                            height: 100,
                            borderRadius: sizes.radius
                        }}
                    />
                    {/* Details */}
                    <View
                        style={{
                            width: "65%",
                            paddingHorizontal: sizes.padding / 2
                        }}
                    >
                        <Text
                            style={{
                                flex: 1,
                                ...fonts.heading,
                                color: pressed ? colors.darkGreen : colors.darkGreen,
                            }}
                        >
                            {recipe.name}
                        </Text>
                        {/* Servings */}
                        <Text
                            style={{
                                ...fonts.body4,
                                color: colors.gray,
                            }}
                        >
                            {recipe.duration} | Serves {recipe.serving}
                        </Text>
                    </View>
                </>
            )}
        </Pressable>
    );
}

export default RecipeCard;