import React, { useRef, useState } from 'react';
import { View, Text,TouchableOpacity,Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, IMAGES, FONTS, SIZES } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import Swiper from 'react-native-swiper';
import LikeBtn from '../../components/likebtn/LikeBtn';
import { ScrollView } from 'react-native-gesture-handler';
import PostShareSheet from '../../components/bottomsheet/PostShareSheet';
import PostoptionSheet from '../../components/bottomsheet/PostoptionSheet';

const postList = [
    {
        id: "1",
        name: "Alex Techie",
        image: IMAGES.profile,
        date: "8 hourse ago",
        postimage: [
            {
                image: IMAGES.profilepic2,
            }
        ],
        like: "154",
        comment: "28",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: true,
    },
    {
        id: "2",
        name: "Alex Techie",
        image: IMAGES.profile,
        date: "3 hourse ago",
        postimage: [
            {
                image: IMAGES.profilepic15,
            },
            {
                image: IMAGES.profilepic3,
            },
            {
                image: IMAGES.profilepic4,
            },
        ],
        like: "132",
        comment: "25",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: true,
    },
    {
        id: "3",
        name: "Alex Techie",
        image: IMAGES.profile,
        date: "12 hourse ago",
        postimage: [
            {
                image: IMAGES.profilepic16,
            }
        ],
        like: "30",
        comment: "40",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: true,
    },
    {
        id: "4",
        name: "Alex Techie",
        image: IMAGES.profile,
        date: "1 hourse ago",
        postimage: [
            {
                image: IMAGES.profilepic17,
            }
        ],
        like: "154",
        comment: "10",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: true,
    },
    {
        id: "5",
        name: "Alex Techie",
        image: IMAGES.profile,
        date: "15 hourse ago",
        postimage: [
            {
                image: IMAGES.profilepic18,
            }
        ],
        like: "100",
        comment: "60",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: true,
    },
    {
        id: "6",
        name: "Alex Techie",
        image: IMAGES.profile,
        date: "22 hourse ago",
        postimage: [
            {
                image: IMAGES.profilepic4,
            }
        ],
        like: "1K",
        comment: "90",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: true,
    },
    {
        id: "7",
        name: "Alex Techie",
        image: IMAGES.profile,
        date: "20 hourse ago",
        postimage: [
            {
                image: IMAGES.profilepic10,
            }
        ],
        like: "184",
        comment: "60",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: true,
    },
    {
        id: "8",
        name: "Alex Techie",
        image: IMAGES.profile,
        date: "8 hourse ago",
        postimage: [
            {
                image: IMAGES.profilepic11,
            }
        ],
        like: "132",
        comment: "28",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: true,
    },
    {
        id: "9",
        name: "Alex Techie",
        image: IMAGES.profile,
        date: "3 hourse ago",
        postimage: [
            {
                image: IMAGES.profilepic12,
            },
            {
                image: IMAGES.profilepic17,
            },
            {
                image: IMAGES.profilepic18,
            },
        ],
        like: "30",
        comment: "25",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: true,
    },
    {
        id: "10",
        name: "Alex Techie",
        image: IMAGES.profile,
        date: "12 hourse ago",
        postimage: [
            {
                image: IMAGES.profilepic13,
            }
        ],
        like: "134",
        comment: "40",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: true,
    },
    {
        id: "11",
        name: "Alex Techie",
        image: IMAGES.profile,
        date: "1 hourse ago",
        postimage: [
            {
                image: IMAGES.profilepic14,
            }
        ],
        like: "100",
        comment: "10",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: true,
    },
    {
        id: "12",
        name: "Alex Techie",
        image: IMAGES.profile,
        date: "15 hourse ago",
        postimage: [
            {
                image: IMAGES.profilepic1,
            }
        ],
        like: "1K",
        comment: "60",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: true,
    },
];

const ProfilePost = () => {

    const sheetRef = useRef<any>();

    const moresheet = useRef<any>();

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={{backgroundColor:colors.card,flex:1}}>
            <Header
                title="Post"
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={GlobalStyleSheet.container}>
                    {postList.map((data, index) => {
                        const [isShow, setIsShow] = useState(false);
                        const [show, setshow] = React.useState(true);
                        return (
                            <View key={index} style={{ borderBottomWidth: 1, borderBottomColor: colors.border , marginHorizontal: -15 }}>
                                <View style={[GlobalStyleSheet.flexalingjust, { paddingVertical: 10, paddingHorizontal: 15 }]}>
                                    <View style={GlobalStyleSheet.flexaling}>
                                        <View>
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate('status', {
                                                    name: data.name,
                                                    image: data.image,
                                                    statusData: [IMAGES.profilepic17, IMAGES.profilepic18]
                                                })}
                                            >
                                                <View>
                                                    <Image
                                                        style={{ width: 42, height: 42, borderRadius: 50 }}
                                                        source={data.image}
                                                    />
                                                    <Image
                                                        style={{ width: 50, height: 50, position: 'absolute', bottom: -4, right: -4,resizeMode:'contain' }}
                                                        source={IMAGES.cricle}
                                                    />
                                                </View>

                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginLeft: 10 }}>
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate('Profile')}
                                            >
                                                <Text style={{ ...FONTS.fontSm, ...FONTS.fontMedium, color: colors.title }}>{data.name}</Text>
                                            </TouchableOpacity>
                                            <Text style={{ ...FONTS.fontMedium, fontSize: 11, color:colors.text }}>{data.date}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity
                                             onPress={() => sheetRef.current.openSheet()}
                                        >
                                            <Image
                                                style={{ width: 18, height: 18, marginRight: 23,tintColor:colors.title }}
                                                source={IMAGES.share}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => moresheet.current.openSheet()}
                                        >
                                            <Image
                                                style={{ width: 18, height: 18, tintColor: colors.title }}
                                                source={IMAGES.more}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: SIZES.width < SIZES.container ? SIZES.width - (SIZES.width * (20 / 100)) : SIZES.container - (SIZES.container * (20 / 100)),
                                    }}
                                >
                                    <Swiper
                                        height={'auto'}
                                        showsButtons={false}
                                        loop={false}
                                        paginationStyle={{
                                            bottom: 10
                                        }}
                                        dotStyle={{
                                            width: 5,
                                            height: 5,
                                            backgroundColor: 'rgba(255, 255, 255, 0.40)'
                                        }}
                                        activeDotStyle={{
                                            width: 6,
                                            height: 6,
                                            backgroundColor: '#ffff'
                                        }}
                                    >
                                        {data.postimage.map((post, index) => {
                                            return (
                                                <Image
                                                    key={index}
                                                    style={{ width: '100%', height: '100%' }}
                                                    source={post.image}
                                                />
                                            )
                                        })}
                                    </Swiper>
                                </View>
                                <View style={{ paddingVertical: 10, paddingHorizontal: 15, paddingBottom: 20 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={[GlobalStyleSheet.flexaling, { gap: 22 }]}>
                                            <View style={GlobalStyleSheet.flexaling}>
                                                <TouchableOpacity>
                                                    <LikeBtn
                                                        color={colors.title}
                                                        sizes={'sm'}
                                                    />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => navigation.navigate('like')}
                                                >
                                                    <Text style={[GlobalStyleSheet.postlike,{color:colors.title}]}>{data.like}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate('Comments')}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image
                                                        style={{ width: 22, height: 22, resizeMode: 'contain',tintColor:colors.title }}
                                                        source={IMAGES.comment}
                                                    />
                                                    <Text style={[GlobalStyleSheet.postlike, { color: colors.title }]}>{data.comment}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setshow(!show)
                                                }}
                                            >
                                                <Image
                                                    style={{ width: 18, height: 18, resizeMode: 'contain', margin: 10, tintColor: show ? colors.title : colors.primary }}
                                                    source={
                                                        show
                                                            ?
                                                            IMAGES.save
                                                            :
                                                            IMAGES.save2
                                                    }
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 15 }}>
                                        <View style={{ paddingRight: 35 }}>
                                            <Text numberOfLines={isShow ? 0 : 2} style={{ ...FONTS.fontRegular, color: colors.title, fontSize: 13 }}>{data.posttitle}</Text>
                                            {isShow === false &&
                                                <TouchableOpacity
                                                    onPress={() => setIsShow(true)}
                                                    style={{ position: 'absolute', bottom: -4, right: 0 }}
                                                >
                                                    <Text style={{ ...FONTS.fontRegular, color: theme.dark ? 'rgba(255,255,255,0.5)' : 'rgba(71, 90, 119, 0.50)', fontSize: 13 }}>more</Text>
                                                </TouchableOpacity>
                                            }
                                        </View>
                                        <Text style={{ ...FONTS.fontRegular, color: theme.dark ? 'rgba(255,255,255,0.4)' : '#475A77', fontSize: 13 }}>{data.posttag}</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
            <PostShareSheet
                ref={sheetRef}
            />
            <PostoptionSheet
                ref={moresheet}
            />  
        </SafeAreaView>
    )
}

export default ProfilePost;