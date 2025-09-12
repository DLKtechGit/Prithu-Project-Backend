import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONTS, IMAGES, SIZES } from '../../constants/theme';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Sharebtn from '../../components/button/Sharebtn';
import { useTheme } from '@react-navigation/native';
import Followbtn from '../../components/button/Followbtn';
import { useNavigation } from '@react-navigation/native';
import ChatoptionSheet from '../../components/bottomsheet/ChatoptionSheet';


const follower = [
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
    
]

const following = [
    {
        id: '1',
        title: 'Alex Techie',
        image: IMAGES.storypic2,
        text: "alex_techie_2123",
        hasStory: true,
    },
    {
        id: '2',
        title: 'Deepesh gaur',
        image: IMAGES.storypic1,
        text: "deepesh_gaur22",
        hasStory: false
    },
    {
        id: '3',
        title: 'Sophia James',
        image: IMAGES.storypic4,
        text: "sophia_james",
        hasStory: false,
    },
    {
        id: '4',
        title: 'Mia Maven',
        image: IMAGES.storypic3,
        text: "mia-meaver_420",
        hasStory: false,
    },
    {
        id: '5',
        title: 'Lily Learns',
        image: IMAGES.storypic2,
        text: "your_lily@123",
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
        title: 'Deepesh gaur',
        image: IMAGES.storypic1,
        text: "deepesh_gaur22",
        hasStory: false,
    },
    {
        id: '8',
        title: 'Sophia James',
        image: IMAGES.storypic4,
        text: "sophia_james",
        hasStory: true,
    },
    {
        id: '9',
        title: 'Mia Maven',
        image: IMAGES.storypic3,
        text: "mia-meaver_420",
        hasStory: false
    },
    {
        id: '10',
        title: 'Lily Learns',
        image: IMAGES.storypic2,
        text: "your_lily@123",
        hasStory: true,
    },
    {
        id: '11',
        title: 'Alex Techie',
        image: IMAGES.storypic1,
        text: "alex_techie_2123",
        hasStory: false,
    },
]

const Followers = () => {

    const moresheet = React.useRef<any>();

    const scrollRef = useRef<any>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const slideIndicator = scrollX.interpolate({
        inputRange: [0, SIZES.width],
        outputRange: [0, (SIZES.width - 30) / 2],
        extrapolate: 'clamp',
    });

    const onPressTouch = (val:any) => {
        setCurrentIndex(val)
        scrollRef.current?.scrollTo({
            x: SIZES.width * val,
            animated: true,
        });
    }

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

  return (
    <SafeAreaView style={[GlobalStyleSheet.container,{padding:0, backgroundColor: colors.card, flex: 1 }]}>
          <Header
            title='Alex Techie'
          />
        <View style={{flex:1}}>
            <View style={GlobalStyleSheet.container}>
                <View style={{flexDirection:'row'}}>
                    <TouchableOpacity
                        onPress={() => onPressTouch(0)}
                        style={GlobalStyleSheet.TouchableOpacity2}
                    >
                          <Text style={[GlobalStyleSheet.titlefont2, { color: currentIndex === 0  ? colors.title  : colors.text}]}>1250 follower</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onPressTouch(1)}
                        style={GlobalStyleSheet.TouchableOpacity2}
                    >
                          <Text style={[GlobalStyleSheet.titlefont2, { color: currentIndex === 1 ? colors.title  : colors.text }]}>500 following</Text>
                    </TouchableOpacity>
                    <Animated.View style={{
                        backgroundColor: colors.title ,
                        width: '50%',
                        height: 2,
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        transform: [{ translateX: slideIndicator }]
                        }}
                    ></Animated.View>
                </View> 
            </View>
             
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={true}
                ref={scrollRef}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onMomentumScrollEnd={(e:any) => {
                    if (e.nativeEvent.contentOffset.x.toFixed(0) == SIZES.width.toFixed(0)) {
                        setCurrentIndex(1)
                    } else if (e.nativeEvent.contentOffset.x.toFixed(0) == 0) {
                        setCurrentIndex(0)
                    } else {
                        setCurrentIndex(0)
                    }
                }}
            >
                <View style={[GlobalStyleSheet.container,{padding:0, width:SIZES.width}]}>
                    <ScrollView>
                        <View style={GlobalStyleSheet.container}>
                            <View style={{ marginTop: 10 }}>
                                <TextInput
                                    placeholder='Search here...'
                                    placeholderTextColor={colors.placeholder}
                                    style={[
                                        GlobalStyleSheet.inputBox, {
                                            backgroundColor: colors.input,
                                            paddingLeft: 25,
                                            //marginHorizontal: 15
                                        },
                                    ]}
                                />
                            </View>
                        </View>
                        <View style={{paddingHorizontal:15,marginBottom:10}}>
                            <Text style={{ ...FONTS.fontRegular, ...FONTS.h6, color: colors.title }} >All Followers</Text>
                        </View>
                        {follower.map((data:any, index) => {
                            
                            const navigation = useNavigation<any>();

                            const [show, setshow] = React.useState(true);

                            return (
                                <View key={index} style={[GlobalStyleSheet.flexalingjust, { paddingHorizontal: 15, marginBottom: 10 }]}>
                                    <View style={[GlobalStyleSheet.flexaling,{marginBottom:10}]}>
                                        <View>
                                            <TouchableOpacity

                                                onPress={() => {
                                                    data.hasStory == false ?
                                                        navigation.navigate('AnotherProfile')
                                                        :
                                                        navigation.navigate('status', {
                                                            name: data.title,
                                                            image: data.image,
                                                            statusData: [IMAGES.profilepic11, IMAGES.profilepic12]
                                                        })
                                                }}

                                                style={{ marginRight: 10 }}
                                            >

                                                {
                                                    data.hasStory == true ?
                                                        <View>
                                                            <Image
                                                                style={{ width: 50, height: 50, borderRadius: 50 }}
                                                                source={data.image}
                                                            />
                                                            <Image
                                                                style={{ width: 58, height: 58, position: 'absolute', bottom: -3.8, right: -4, resizeMode: 'contain' }}
                                                                source={IMAGES.cricle}
                                                            />
                                                        </View>
                                                        :
                                                        <View>
                                                            <Image
                                                                style={{ width: 50, height: 50, borderRadius: 50 }}
                                                                source={data.image}
                                                            />
                                                        </View>
                                                }

                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <TouchableOpacity
                                                onPress={ () => navigation.navigate('AnotherProfile')}
                                            >
                                                <Text style={[GlobalStyleSheet.textfont,{color:colors.title}]}>{data.title}</Text>
                                            </TouchableOpacity>
                                            <Text style={{ ...FONTS.fontXs, color: colors.text }}>{data.text}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        {show ?
                                            
                                            <Sharebtn
                                                title='Remove'
                                                onPress={() => setshow(!show)}
                                            />
                                            :
                                            <Followbtn
                                                title="Follow"
                                                onPress={() => setshow(!show)}
                                            />
                                        }
                                    </View>
                                </View>
                            )
                        })}
                    </ScrollView>
                </View>
                <View style={[GlobalStyleSheet.container,{padding:0, width:SIZES.width}]}>
                    <ScrollView>
                        <View style={GlobalStyleSheet.container}>
                            <View style={{ marginTop: 10 }}>
                                <TextInput
                                    placeholder='Search here...'
                                    placeholderTextColor={colors.placeholder}
                                    style={[
                                        GlobalStyleSheet.inputBox, {
                                            backgroundColor: colors.input,
                                            paddingLeft: 25,
                                            //marginHorizontal: 15
                                        },
                                    ]}
                                />
                            </View>
                        </View>
                          {following.map((data, index) => {
                            
                            const navigation = useNavigation<any>();
                              
                            const [show, setshow] = React.useState(true);

                            return (
                                <View key={index} style={[GlobalStyleSheet.flexalingjust, { paddingHorizontal: 15, marginBottom: 10 }]}>
                                    <View style={[GlobalStyleSheet.flexaling, { marginBottom: 10 }]}>
                                        <View>
                                            <TouchableOpacity

                                                onPress={() => {
                                                    data.hasStory == false ?
                                                        navigation.navigate('AnotherProfile')
                                                        :
                                                        navigation.navigate('status', {
                                                            name: data.title,
                                                            image: data.image,
                                                            statusData: [IMAGES.profilepic11, IMAGES.profilepic12]
                                                        })
                                                }}

                                                style={{ marginRight: 10 }}
                                            >

                                                {
                                                    data.hasStory == true ?
                                                        <View>
                                                            <Image
                                                                style={{ width: 50, height: 50, borderRadius: 50 }}
                                                                source={data.image}
                                                            />
                                                            <Image
                                                                style={{ width: 58, height: 58, position: 'absolute', bottom: -3.8, right: -4, resizeMode: 'contain' }}
                                                                source={IMAGES.cricle}
                                                            />
                                                        </View>
                                                        :
                                                        <View>
                                                            <Image
                                                                style={{ width: 50, height: 50, borderRadius: 50 }}
                                                                source={data.image}
                                                            />
                                                        </View>
                                                }

                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate('AnotherProfile')}
                                            >
                                                <Text style={[GlobalStyleSheet.textfont, { color: colors.title }]}>{data.title}</Text>
                                            </TouchableOpacity>
                                            <Text style={{ ...FONTS.fontXs, color: colors.text }}>{data.text}</Text>
                                        </View>
                                    </View>
                                    <View style={GlobalStyleSheet.flexaling}>
                                        <View>
                                            {show ?

                                                <Sharebtn
                                                    title='Following'
                                                    onPress={() => setshow(!show)}
                                                />
                                                :
                                                <Followbtn
                                                    title="Follow"
                                                    onPress={() => setshow(!show)}
                                                />
                                            }
                                        </View>
                                        <View>
                                            <TouchableOpacity
                                                onPress={() => moresheet.current.openSheet()}
                                                style={{ paddingLeft: 10 }}
                                            >
                                                <Image
                                                    style={[GlobalStyleSheet.image, { tintColor:colors.title, width: 15, height: 15 }]}
                                                    source={IMAGES.more}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                    
                    </ScrollView>
                </View>
            </ScrollView> 
        </View>
        <ChatoptionSheet
            ref={moresheet}
            deleteChat={false}
        />
    </SafeAreaView>
  )
}

export default Followers