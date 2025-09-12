import React, { useRef } from 'react'
import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import { IMAGES, VIDEO, FONTS, COLORS } from '../../constants/theme';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import LikeBtn from '../../components/likebtn/LikeBtn';
import { Video } from 'expo-av';
import PostShareSheet from '../../components/bottomsheet/PostShareSheet';


const ReelsData = [
    {
        id: '1',
        like: '456K',
        comment: '56K',
        save: '512',
        send: '30k',
        image: IMAGES.profile,
        holder: "Alex Techie",
        text: 'Hoe to speak the right and good public and very nice and very very nice?',
        music: 'podcast - janjipodcast',
        //reelsimage:IMAGES.profilepic5,
        reelsvideo: VIDEO.video4
    },
    {
        id: '2',
        like: '230K',
        comment: '59K',
        save: '1K',
        send: '60k',
        image: IMAGES.profile,
        holder: "Alex Techie",
        text: 'Have a good day and good morning and very nice and very very nice?',
        music: 'Atif Aslam - Khair Mangda',
        //reelsimage: IMAGES.profilepic7,
        reelsvideo: VIDEO.video2

    },
]

const ProfileReels = () => {

    const sheetRef = useRef<any>();
    const navigation = useNavigation<any>();

    const [show, setshow] = React.useState(true);

    const video = React.useRef(null);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header
                title='Your reels'
                transparent={true}
            />
            <Swiper
                horizontal={false}
                showsButtons={false}
                showsPagination={false}
                loop={false}
            >
                {ReelsData.map((data:any, index) => {
                    return (
                        <View key={index} style={[GlobalStyleSheet.container,{padding:0, flex: 1, backgroundColor: '#000' }]}>
                            <View>
                                <Video
                                    ref={video}
                                    source={data.reelsvideo}
                                    useNativeControls={false}
                                    resizeMode={'cover'}
                                    isLooping
                                    style={{
                                        width: '100%',
                                        height:'100%',
                                        // position: 'absolute',
                                    }}
                                />
                            </View>
                            <View style={{ position: 'absolute', bottom: 20, left: 20, paddingRight: 120 }}>
                                <View style={GlobalStyleSheet.flexaling}>
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('status', {
                                                name: data.holder,
                                                image: data.image,
                                                statusData: [IMAGES.profilepic15, IMAGES.profilepic18]
                                            })}
                                            style={{ marginRight: 20 }}
                                        >
                                            <Image
                                                style={{ width: 45, height: 45, borderRadius: 50 }}
                                                source={data.image}
                                            />
                                            <Image
                                                style={{ width: 55, height: 55, position: 'absolute', bottom: -5, right: -5 }}
                                                source={IMAGES.cricle}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('Profile')}
                                        >
                                            <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color: COLORS.white }}>{data.holder}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text numberOfLines={1} style={{ ...FONTS.fontRegular, color: COLORS.white, fontSize: 12 }}>{data.text}</Text>
                                    <TouchableOpacity>
                                        <Text style={{ ...FONTS.fontRegular, color: COLORS.white, opacity: .6, fontSize: 12, position: 'absolute', bottom: -4, right: -30 }}>more</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Music')}
                                        style={GlobalStyleSheet.flexaling}
                                    >
                                        <Image
                                            style={{ width: 15, height: 15, tintColor: '#fff', resizeMode: 'contain' }}
                                            source={IMAGES.music}
                                        />
                                        <Text style={{ ...FONTS.fontRegular, color: COLORS.white, fontSize: 11, marginLeft: 5 }}>{data.music}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ position: 'absolute', bottom: 30, right: 20 }}>
                                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                                    <TouchableOpacity>
                                        <View style={GlobalStyleSheet.background}>
                                            <LikeBtn
                                                color={'#fff'}
                                                sizes={'sm'}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('like')}
                                    >
                                        <Text style={GlobalStyleSheet.Text}>{data.like}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Comments')}
                                    >
                                        <View style={GlobalStyleSheet.background}>
                                            <Image
                                                style={[GlobalStyleSheet.image, { tintColor: COLORS.white }]}
                                                source={IMAGES.comment}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={GlobalStyleSheet.Text}>{data.comment}</Text>
                                </View>
                                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setshow(!show)
                                        }}
                                    >
                                        <View style={GlobalStyleSheet.background}>
                                            <Image
                                                style={[GlobalStyleSheet.image, { tintColor: COLORS.white }]}
                                                source={
                                                    show
                                                        ?
                                                        IMAGES.save
                                                        :
                                                        IMAGES.save2
                                                }
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={GlobalStyleSheet.Text}>{data.save}</Text>
                                </View>
                                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                                    <TouchableOpacity
                                        onPress={() => sheetRef.current.openSheet()}
                                    >
                                        <View style={GlobalStyleSheet.background}>
                                            <Image
                                                style={[GlobalStyleSheet.image, { tintColor: COLORS.white }]}
                                                source={IMAGES.send}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={GlobalStyleSheet.Text}>{data.send}</Text>
                                </View>
                            </View>
                        </View>
                    )
                })}

            </Swiper>
            <PostShareSheet
                ref={sheetRef}
            />
        </SafeAreaView>
    )
}

export default ProfileReels;