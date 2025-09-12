import React, { useState } from "react";
import {
    NavigationContainer,
    DefaultTheme as NavigationDefaultTheme,
    DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import StackNavigator from "./StackNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import themeContext from "../constants/themeContext";
import { COLORS } from "../constants/theme";

const Routes = () => {
    
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const authContext = React.useMemo(() => ({
        setDarkTheme: () => {
            setIsDarkTheme(true);
        },
        setLightTheme: () => {
            setIsDarkTheme(false);
        }
    }), []);

    const CustomDefaultTheme = {
        ...NavigationDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            background: COLORS.background,
            title: COLORS.title,
            card: COLORS.card,
            text: COLORS.text,
            border: COLORS.border,
            input: COLORS.input,
            placeholder: COLORS.placeholder,
        }
    }
    
    const CustomDarkTheme = {
        ...NavigationDarkTheme,
        colors: {
            ...NavigationDarkTheme.colors,
            background: COLORS.darkBackground,
            title: COLORS.darkTitle,
            card: COLORS.darkCard,
            text: COLORS.darkText,
            border: COLORS.darkBorder,
            input: COLORS.darkInput,
            placeholder: COLORS.darkPlaceholder,
        }
    }

    const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

    return (
        <SafeAreaProvider>
            <themeContext.Provider value={authContext}>
                <NavigationContainer theme={theme}>
                    <StackNavigator />
                </NavigationContainer>
            </themeContext.Provider>
        </SafeAreaProvider>
    );
};
export default Routes;