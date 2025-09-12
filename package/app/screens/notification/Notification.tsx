import React from 'react';
import { View, Text, SafeAreaView, SectionList, Image, TouchableOpacity } from 'react-native';
import Header from '../../layout/Header';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { useRoute, useTheme } from '@react-navigation/native';
import Sharebtn from '../../components/button/Sharebtn';
import Followbtn from '../../components/button/Followbtn';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';

const DATA = [
    {
        title: 'On Going Calls',
        data: [
            {
                id: "1",
                image: IMAGES.chillzone,
                activeuser:"+39",
                time: '10:00',
                profile: 'Chill Zone',
                type:'ChatRoomCall',
                description:"A laid-back space to relax and chat about anything.",
                calltype:'Video',
                title: 'Chill Zone',
                accountholder:"Lily Learns",
                profilename:"Alex Techie"
            },
            {
                id: "2",
                image: IMAGES.CoffeeChat,
                activeuser:"+29",
                time: '10:00:15',
                profile: 'Coffee & Chat',
                type: 'ChatRoomCall',
                title: 'Coffee & Chat',
                calltype:'call',
                description:"Grab your favorite drink and join in casual conversations.",
                accountholder:"Mia Learns",
                profilename:"Alex Techie"
                
            }
        ],
    },
    {
        title: 'Today',
        data: [
            {
                id: "1",
                image: IMAGES.storypic1,
                time: '5h ago',
                profile: 'alex techie',
                descrption: 'liked your post',
                postimage: IMAGES.profilepic3,
                type:'like',
            },
            {
                id: "2",
                image: IMAGES.storypic3,
                time: '8h ago',
                profile: 'lily learns',
                descrption: 'and 5 others liked your post',
                postimage: IMAGES.profilepic5,
                type: 'like',
            },
            {
                id: "3",
                image: IMAGES.storypic2,
                time: '2h ago',
                profile: 'mia maven',
                descrption: ' mentioned you in a comment: very nice',
                postimage: IMAGES.profilepic4,
                type: 'comment',
            },
            {
                id: "4",
                image: IMAGES.storypic4,
                time: '1h ago',
                profile: 'sophia james',
                descrption: 'started following you.',
                postimage: IMAGES.profilepic4,
                type: "follow",
            },
        ],
    },
    {
        title: 'This month',
        data: [
            {
                id: "1",
                image: IMAGES.profile2,
                time: '3h ago',
                profile: 'deepesh gaur',
                descrption: 'liked your post',
                postimage: IMAGES.profilepic6,
                type: 'like',
            },
            {
                id: "2",
                image: IMAGES.profilepic10,
                time: '8h ago',
                profile: 'herry moven',
                descrption: 'and 5 others liked your post',
                postimage: IMAGES.profilepic5,
                type: 'like',
            },
            {
                id: "3",
                image: IMAGES.storypic3,
                time: '10h ago',
                profile: 'lily learns',
                descrption: ' mentioned you in a comment: very nice',
                postimage: IMAGES.profilepic11,
                type: 'comment',
            },
            {
                id: "4",
                image: IMAGES.storypic1,
                time: '7h ago',
                profile: 'alex techie',
                descrption: 'started following you.',
                postimage: IMAGES.profilepic4,
                type: "follow",
            },
            
        ],
    },
    {
        title: 'This year',
        data: [
            {
                id: "1",
                image: IMAGES.profilepic8,
                time: '3h ago',
                profile: 'lily learns',
                descrption: 'liked your post',
                postimage: IMAGES.profilepic9,
                type: 'like',
            },
            {
                id: "2",
                image: IMAGES.profilepic10,
                time: '8h ago',
                profile: 'herry moven',
                descrption: 'and 5 others liked your post',
                postimage: IMAGES.profilepic11,
                type: 'like',
            },
            {
                id: "3",
                image: IMAGES.storypic2,
                time: '10h ago',
                profile: 'mia maven',
                descrption: ' mentioned you in a comment: very nice',
                postimage: IMAGES.profilepic9,
                type: 'comment',
            },
            {
                id: "4",
                image: IMAGES.profile2,
                time: '7h ago',
                profile: 'herry techie',
                descrption: 'started following you.',
                postimage: IMAGES.profilepic4,
                type: "follow",
            },

        ],
    },
]


type NotificationScreenProps = StackScreenProps<RootStackParamList, 'notification'>;

const Notification =  ({ navigation } : NotificationScreenProps) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    // const route = useRoute<any>();
            
    // const { data } = route.params;

    return (
        <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
            <Header
                title="Notification"
            />
            <SectionList
                style={GlobalStyleSheet.container}
                showsVerticalScrollIndicator={false}
                sections={DATA}
                 //keyExtractor={(item, index) => item + index}
                renderItem={({ item } :any) => {
                    
                    const [show, setshow] = React.useState(true);

                    return(
                        <View>
                            {item.type === "ChatRoomCall" ?
                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                    <View
                                        style={[GlobalStyleSheet.shadow2,{
                                            height:50,
                                            width:50,
                                            borderRadius:50,
                                            backgroundColor:COLORS.white,
                                            alignItems:'center',
                                            justifyContent:'center'
                                        }]}
                                    >
                                        <Image
                                            style={{height:35,width:35}}
                                            source={item.image}
                                        />
                                        <View
                                        style={[GlobalStyleSheet.shadow2,{
                                            padding:5,
                                            borderRadius:30,
                                            backgroundColor:colors.card,
                                            alignItems:'center',
                                            justifyContent:'center',
                                            position:'absolute',
                                            right:-5,
                                            bottom:0
                                        }]}
                                        >
                                        <Text style={{...FONTS.fontRegular,fontSize:10,color:theme.colors.text,lineHeight:16}}>{item.activeuser}</Text>
                                        </View>
                                    </View>
                                    <View style={{marginLeft:15,flex:1,marginRight:20}}>
                                        <Text numberOfLines={1} style={{...FONTS.fontMedium, ...FONTS.font, color: colors.title,}}>{item.profile}</Text>
                                        <Text style={{ ...FONTS.fontSm, ...FONTS.fontMedium, color: colors.text, opacity: .5 }}>{item.time}</Text>
                                    </View>
                                    <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
                                        <TouchableOpacity
                                            activeOpacity={0.6}
                                            onPress={() => navigation.goBack()}
                                        >
                                            <Text style={{...FONTS.fontMedium,fontSize:14,color:COLORS.danger,lineHeight:22}}>Ignore</Text>
                                        </TouchableOpacity>
                                        {item.calltype === 'Video' &&
                                            <TouchableOpacity
                                                onPress={() => {navigation.navigate('ChatRoomVideoCall', {data: item})}}
                                                activeOpacity={0.6}
                                                style={{
                                                    padding:5,
                                                    paddingHorizontal:15,
                                                    borderRadius:20,
                                                    backgroundColor:COLORS.primary,
                                                    flexDirection:'row',
                                                    alignItems:'center',
                                                    gap:5
                                                }}
                                            >
                                                <Text style={{...FONTS.fontMedium,fontSize:14,color:COLORS.card,lineHeight:22}}>Join</Text>
                                                <Image
                                                    style={{height:24,width:24,tintColor:COLORS.card}}
                                                    source={IMAGES.video}
                                                />
                                            </TouchableOpacity>
                                        }
                                        {item.calltype === 'call' &&
                                            <TouchableOpacity
                                                onPress={() => {navigation.navigate('ChatRoomCall', {data: item})}}
                                                activeOpacity={0.6}
                                                style={{
                                                    padding:5,
                                                    paddingHorizontal:15,
                                                    borderRadius:20,
                                                    backgroundColor:COLORS.primary,
                                                    flexDirection:'row',
                                                    alignItems:'center',
                                                    gap:5
                                                }}
                                            >
                                                <Text style={{...FONTS.fontMedium,fontSize:14,color:COLORS.card,lineHeight:22}}>Join</Text>
                                                <Image
                                                    style={{height:20,width:20,tintColor:COLORS.card,resizeMode:'contain'}}
                                                    source={IMAGES.call}
                                                />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View> 
                                :
                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View>
                                            <Image
                                                style={{ width: 50, height: 50, borderRadius: 50 }}
                                                source={item.image}
                                            />
                                            {item.type == 'comment' ?
                                                <View
                                                    style={{
                                                        width: 24,
                                                        height: 24,
                                                        backgroundColor: COLORS.primary,
                                                        borderRadius: 50,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        position: 'absolute',
                                                        bottom: -2,
                                                        right: -2,
                                                    }}
                                                >
                                                    <View>
                                                        <Image
                                                            style={{ width: 14, height: 14, resizeMode: 'contain', tintColor: '#fff' }}
                                                            source={IMAGES.chat2}
                                                        />
                                                    </View>
                                                </View>
                                                :
                                                item.type == 'like' ?

                                                <View
                                                    style={{
                                                        width: 24,
                                                        height: 24,
                                                        backgroundColor: '#ffe4ef',
                                                        borderRadius: 50,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        position: 'absolute',
                                                        bottom: -2,
                                                        right: -2,
                                                    }}
                                                >
                                                    <View>
                                                        <Image
                                                            style={{ width: 14, height: 14, resizeMode: 'contain' }}
                                                            source={IMAGES.like}
                                                        />
                                                    </View>
                                                </View>
                                                :
                                                null
                                            }
                                        </View>
                                    </View>
                                    <View style={{ paddingLeft: 20, flex: 1 }}>
                                        <Text style={{ ...FONTS.fontSm, ...FONTS.fontMedium, color: colors.text, opacity: .5 }}>{item.time}</Text>
                                        <Text style={{ ...FONTS.fontMedium, ...FONTS.font, color: colors.title, }}><Text style={{ ...FONTS.fontSm, ...FONTS.fontMedium, color: colors.title, }}>{item.profile}</Text> {item.descrption}</Text>
                                    </View>
                                    {item.type == "follow" ?

                                        show ?
                                        
                                            <Sharebtn
                                                title='Following'
                                                onPress={() => setshow(!show)}
                                            />
                                            :
                                            <Followbtn
                                                title="Follow"
                                                onPress={() => setshow(!show)}
                                            />
                                        :
                                        <View>
                                            <Image
                                                style={{ width: 55, height: 55 }}
                                                source={item.postimage}
                                            />
                                        </View>
                                    }
                                </View>
                            }
                        </View>
                    )
                }}
                    renderSectionHeader={({ section: { title } }) => (
                    <Text style={{...FONTS.fontMedium,...FONTS.h6,paddingVertical:10,color:colors.title,backgroundColor:colors.card}}>{title}</Text>
                )}
            />
        </SafeAreaView>
    )
}

export default Notification;