import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, IMAGES } from '../../constants/theme';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';

type SettingsScreenProps = StackScreenProps<RootStackParamList, 'Settings'>;

const SettingData = [
    {
        id: "1",
        image: IMAGES.bell,
        text: "Notification",
        navigate: 'SettingNotification'
    },
    {
        id: "2",
        image: IMAGES.verified,
        text: "Security",
        navigate: 'Security'
    },
    {
        id: "3",
        image: IMAGES.usename,
        text: "Account",
        navigate: 'Account'
    },
    {
        id: "4",
        image: IMAGES.about,
        text: "About",
        navigate: 'About'
    },
    {
        id: "5",
        image: IMAGES.save,
        text: "Save",
        navigate: 'Save'
    },
    {
        id: "6",
        image: IMAGES.theme,
        text: "Theme",
        navigate: 'Theme'
    },
    {
        id: "7",
        image: IMAGES.logout,
        text: "Log out",
        isLogout: true
    },
]

const Settings = ({ navigation }: SettingsScreenProps) => {
    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Clear all stored user data
                            await AsyncStorage.multiRemove(['userToken', 'userData']);
                            // Navigate to login screen
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        } catch (e) {
                            console.error('Failed to logout', e);
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    const handleItemPress = (item: any) => {
        if (item.isLogout) {
            handleLogout();
        } else {
            navigation.navigate(item.navigate as keyof RootStackParamList);
        }
    };

    return (
        <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
            <Header
                title="Settings"
            />
            <View style={[GlobalStyleSheet.container, { marginTop: 10 }]}>
                {SettingData.map((data, index) => {
                    return (
                        <View key={index} style={{ marginHorizontal: -15 }}>
                            <TouchableOpacity
                                onPress={() => handleItemPress(data)}
                                style={[GlobalStyleSheet.flexalingjust, {
                                    height: 48,
                                    borderBottomWidth: 1,
                                    borderBottomColor: colors.border,
                                    marginHorizontal: 15
                                }]}
                            >
                                <View style={GlobalStyleSheet.flexaling}>
                                    <Image
                                        style={[GlobalStyleSheet.image2, {
                                            height: 20,
                                            width: 20,
                                            resizeMode: 'contain',
                                            tintColor: data.isLogout ? COLORS.danger : colors.title
                                        }]}
                                        source={data.image}
                                    />
                                    <Text style={[GlobalStyleSheet.textfont, {
                                        fontSize: 15,
                                        marginLeft: 10,
                                        color: data.isLogout ? COLORS.danger : colors.title
                                    }]}>{data.text}</Text>
                                </View>
                                {!data.isLogout && (
                                    <Image
                                        style={[GlobalStyleSheet.image2, {
                                            height: 15,
                                            width: 15,
                                            resizeMode: 'contain',
                                            tintColor: colors.title
                                        }]}
                                        source={IMAGES.rigtharrow}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </View>
        </SafeAreaView>
    )
}

export default Settings;