import React from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { IMAGES, FONTS, COLORS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import SongoptionSheet from '../../components/bottomsheet/SongoptionSheet';

const musicData = [
    {
        id: '1',
        image: IMAGES.smallpic7,
        title: 'Insane (Slpwed + Reverb) ',
        text: 'sid04'
    },
    {
        id: '2',
        image: IMAGES.smallpic8,
        title: 'Chaleye (from "jawan") ',
        text: 'Anirudh ravichander,Arijit Sing '
    },
    {
        id: '3',
        image: IMAGES.smallpic9,
        title: 'Dil Jhoom ',
        text: 'Mithoon,Arijit Sing'
    },
    {
        id: '4',
        image: IMAGES.smallpic10,
        title: 'Amchaya Papani Ganpa ',
        text: 'Arijit Sing'
    },
]

const SavedMusic = () => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const moresheet = React.useRef<any>();

    return (
        <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
            <Header
                title="Saved Music"
            />
            <View style={{ marginTop: 20 }}>

                <ScrollView>
                    {musicData.map((data, index) => {
                        return (
                            <TouchableOpacity key={index}>
                                <View style={[GlobalStyleSheet.container, GlobalStyleSheet.flexalingjust, { marginBottom: 15,padding:0,paddingHorizontal:15 }]}>
                                    <View style={GlobalStyleSheet.flexaling}>
                                        <Image
                                            style={{ width: 50, height: 50, borderRadius: 8, marginRight: 10 }}
                                            source={data.image}
                                        />
                                        <View>
                                            <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color: colors.title }}>{data.title}</Text>
                                            <Text style={{ ...FONTS.fontXs, color: theme.colors.text }}>{data.text}</Text>
                                        </View>
                                    </View>
                                    <View style={GlobalStyleSheet.flexaling}>
                                        <TouchableOpacity
                                           onPress={() => moresheet.current.openSheet()}
                                        >
                                            <Image
                                                style={[GlobalStyleSheet.image2, { marginRight: 10, tintColor: colors.title }]}
                                                source={IMAGES.more}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity>
                                            <View style={[GlobalStyleSheet.background, { backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)' }]}>
                                                <Image
                                                    style={[GlobalStyleSheet.image2, { tintColor: colors.title }]}
                                                    source={IMAGES.play}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </View>
            <SongoptionSheet
                ref={moresheet}
                unseved={false}
            />
        </SafeAreaView>
    )
}

export default SavedMusic