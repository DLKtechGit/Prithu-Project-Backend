import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, IMAGES } from '../../../constants/theme';
import Header from '../../../layout/Header';
import { GlobalStyleSheet } from '../../../constants/styleSheet';
import { useTheme } from '@react-navigation/native';

const accountData = [
    {
        id: "1",
        image: IMAGES.pin,
        text: "Personal information",
        navigate: 'PersonalInformation'
    },
    {
        id: "2",
        image: IMAGES.login,
        text: "Language",
        navigate: 'Language'
    },
    {
        id: "3",
        image: IMAGES.user,
        text: "Contacts syncing",
        navigate: 'Contacts'
    },
]

const Account = ({ navigation }) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    return (
        <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
            <Header
                title="Account"
            />
            <View style={[GlobalStyleSheet.container, { marginTop: 10 }]}>
                {accountData.map((data, index) => {
                    return (
                        <View key={index} style={{ marginHorizontal: -15 }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate(data.navigate)}
                                style={[GlobalStyleSheet.flexalingjust, { height: 48, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.10)', marginHorizontal: 15 }]}
                            >
                                <Text style={[GlobalStyleSheet.textfont, { fontSize: 15,color:colors.title }]}>{data.text}</Text>
                                <Image
                                    style={[GlobalStyleSheet.image2, { height: 15, width: 15, resizeMode: 'contain',tintColor:colors.title }]}
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

export default Account;
