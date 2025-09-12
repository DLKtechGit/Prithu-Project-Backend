import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity,Image,TextInput,FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { useNavigation } from '@react-navigation/native';
import Followbtn from '../../components/button/Followbtn';
import Sharebtn from '../../components/button/Sharebtn';

const LikeData = [
    {
        id: '1',
        title: 'Alex Techie',
        image: IMAGES.storypic1,
        text: "alex_techie_2123",
        hasStory: false,
    },
    {
        id: '2',
        title: 'Lily Learns',
        image: IMAGES.storypic2,
        text: "your_lily@123",
        hasStory: true,
    },
    {
        id: '3',
        title: 'Mia Maven',
        image: IMAGES.storypic3,
        text: "mia-meaver_420",
        hasStory: false
    },
    {
        id: '4',
        title: 'Sophia James',
        image: IMAGES.storypic4,
        text: "sophia_james",
        hasStory: true,
    },
    {
        id: '5',
        title: 'Deepesh gaur',
        image: IMAGES.storypic1,
        text: "deepesh_gaur22",
        hasStory: false,
    },
    {
        id: '6',
        title: 'Alex Techie',
        image: IMAGES.storypic4,
        text: "alex_techie_2123",
        hasStory: false
    },
    {
        id: '7',
        title: 'Lily Learns',
        image: IMAGES.storypic2,
        text: "your_lily@123",
        hasStory: false,
    },
    {
        id: '8',
        title: 'Mia Maven',
        image: IMAGES.storypic3,
        text: "mia-meaver_420",
        hasStory: false,
    },
    {
        id: '9',
        title: 'Sophia James',
        image: IMAGES.storypic4,
        text: "sophia_james",
        hasStory: false,
    },
    {
        id: '10',
        title: 'Deepesh gaur',
        image: IMAGES.storypic1,
        text: "deepesh_gaur22",
        hasStory: false
    },
    {
        id: '11',
        title: 'Alex Techie',
        image: IMAGES.storypic2,
        text: "alex_techie_2123",
        hasStory: true,
    },
];

const Item = ({ title, image, text, hasStory, isChecked, navigation, theme } : any) => {

    const [show, setshow] = React.useState(hasStory);
    return (

        <TouchableOpacity style={[GlobalStyleSheet.flexalingjust, { paddingHorizontal: 15, marginBottom: 10,marginTop:10 }]}
            onPress={() => navigation.navigate('AnotherProfile')}
        >
            <View style={GlobalStyleSheet.flexaling}>
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            hasStory == false ?
                                navigation.navigate('AnotherProfile')
                                :
                                navigation.navigate('status', {
                                    name: title,
                                    image: image,
                                    statusData: [IMAGES.profilepic11, IMAGES.profilepic12]
                                })
                        }}
                        style={{ marginRight: 10 }}
                    >

                        {
                            hasStory == true ?
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        style={{ width: 50, height: 50, borderRadius: 50 }}
                                        source={image}
                                    />
                                    <Image
                                        style={{ width: 58, height: 58, position: 'absolute',resizeMode:'contain' }}
                                        source={IMAGES.cricle}
                                    />
                                </View>
                                :
                                <View>
                                    <Image
                                        style={{ width: 50, height: 50, borderRadius: 50 }}
                                        source={image}
                                    />
                                </View>
                        }

                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={[GlobalStyleSheet.textfont,{color:theme.colors.title}]}>{title}</Text>
                    <Text style={{ ...FONTS.fontXs, color: theme.colors.text }}>{text}</Text>
                </View>
            </View>
            {show ?
                <Followbtn
                    title="Follow"
                    onPress={() => setshow(!show)}
                />
                :
                <Sharebtn
                    title="Following"
                    onPress={() => setshow(!show)}
                />
            }
        </TouchableOpacity>
    )
}
const Like = () => {


    const navigation = useNavigation();

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    return (
        <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
            <View style={GlobalStyleSheet.container}>
                <View style={[GlobalStyleSheet.flexalingjust,{ height: 50}]}>
                    <View style={GlobalStyleSheet.flexaling}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                        >
                            <Image
                                style={{ width: 18, height: 18,tintColor:colors.title }}
                                source={IMAGES.arrowleft}
                            />
                        </TouchableOpacity>
                        <View>
                            <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title, marginLeft: 20 }}>Like</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title }}>250</Text>
                    </View>
                </View>
                <View style={{ marginBottom: 10 }}>
                    <TouchableOpacity
                        style={{
                            zIndex: 1,
                            position: 'absolute',
                            top: 13,
                            left: 15
                        }}
                    >
                        <Image
                            style={{
                                tintColor: colors.text,
                                width: 20,
                                height: 20,
                                resizeMode:'contain'
                            }}
                            source={IMAGES.search}
                        />
                    </TouchableOpacity>
                    <TextInput
                        placeholder='Search'
                        placeholderTextColor={colors.placeholder}
                        style={[
                            GlobalStyleSheet.inputBox, {
                                backgroundColor: colors.input,
                            },
                        ]}
                    />
                </View>
            </View>
            <KeyboardAvoidingView
                style={[GlobalStyleSheet.container,{padding:0, flex: 1}]}
                //behavior={Platform.OS === 'ios' ? 'padding' : ''}
            >
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={LikeData}
                    renderItem={({ item } : any) =>
                        <Item
                            title={item.title}
                            image={item.image}
                            text={item.text}
                            hasStory={item.hasStory}
                            isChecked={item.isChecked}
                            navigation={navigation}
                            theme={theme}
                        />
                    }
                    keyExtractor={item => item.id}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>  
    )
}

export default Like