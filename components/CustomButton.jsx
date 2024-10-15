import React from "react";
import { TouchableOpacity, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { colors, fonts } from "../data/theme";

function CustomButton({ buttonText, buttonContainerStyle, buttonColors, onPress }) {

    if (buttonColors.length > 0) {
        return (
            <TouchableOpacity
                onPress={onPress}
            >
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{x: 1, y: 1}}
                    colors={colors}
                    style={{
                        ...buttonContainerStyle
                    }}
                >
                <Text
                    style={{
                        textAlign: 'center',
                        color: colors.white,
                        ...fonts.h3
                    }}
                >
                    {buttonText}
                </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    } else {
        return (
            <TouchableOpacity
                onPress={onPress}
            >
                <Text
                    style={{
                        textAlign: 'center',
                        color: colors.lightGreen,
                        ...fonts.h3
                    }}
                >
                    {buttonText}
                </Text>
            </TouchableOpacity>
        )
    }
}

export default CustomButton;