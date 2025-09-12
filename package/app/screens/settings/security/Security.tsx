import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, IMAGES } from '../../../constants/theme';
import Header from '../../../layout/Header';
import { GlobalStyleSheet } from '../../../constants/styleSheet';
import { useTheme } from '@react-navigation/native';

const SettingData = [
    {
        id: "1",
        image: IMAGES.pin,
        text: "Login activity",
        navigate: 'LoginActivity'
    },
    {
        id: "2",
        image: IMAGES.login,
        text: "Saved login info",
        navigate: 'SavedLogin'
    },
    {
        id: "3",
        image: IMAGES.user,
        text: "Tow factor authentication",
        navigate: 'Towfactor'
    },
]

const Security = ({ navigation }) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    return (
        <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
            <Header
                title="Security"
            />
            <View style={[GlobalStyleSheet.container, { marginTop: 10 }]}>
                {SettingData.map((data, index) => {
                    return (
                        <View key={index} style={{ marginHorizontal: -15 }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate(data.navigate)}
                                style={[GlobalStyleSheet.flexalingjust, { height: 48, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.10)', marginHorizontal: 15 }]}
                            >
                                <View style={GlobalStyleSheet.flexaling}>
                                    <Image
                                        style={[GlobalStyleSheet.image2, { height: 20, width: 20, resizeMode: 'contain',tintColor:colors.title }]}
                                        source={data.image}
                                    />
                                    <Text style={[GlobalStyleSheet.textfont, { fontSize: 15, marginLeft: 10,color:colors.title }]}>{data.text}</Text>
                                </View>
                                <Image
                                    style={[GlobalStyleSheet.image2, { height: 15, width: 15, resizeMode: 'contain', tintColor: colors.title }]}
                                    source={IMAGES.rigtharrow}
                                />
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </View>
        </SafeAreaView>
    )
}

export default Security;