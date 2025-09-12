import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation, useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';

const roomsdata = [
    {
        id:"0",
        roomname:"Chill Zone",
        description:"A laid-back space to relax and chat about anything.",
        image:IMAGES.chillzone
    },
    {
        id:"1",
        roomname:"Coffee & Chat",
        description:"Grab your favorite drink and join in casual conversations.",
        image:IMAGES.CoffeeChat
    },
    {
        id:"2",
        roomname:"The Hangout",
        description:"Where friends meet, share stories, and vibe together.",
        image:IMAGES.Hangout
    },
    {
        id:"3",
        roomname:"Friends Forever",
        description:"A cozy corner for lifelong friendships and fun.",
        image:IMAGES.friends
    },
    {
        id:"4",
        roomname:"Late Night Talks",
        description:"For deep convos and random thoughts after dark.",
        image:IMAGES.discussion
    },
    {
        id:"5",
        roomname:"Project Alpha",
        description:"Team collaboration for your most important mission.",
        image:IMAGES.rocketlaunch
    },
    {
        id:"6",
        roomname:"Team Sync",
        description:"Daily updates, progress sharing, and teamwork made easy.",
        image:IMAGES.sportteam
    },
    {
        id:"7",
        roomname:"Marketing Hub",
        description:"Brainstorm campaigns and share marketing strategies.",
        image:IMAGES.marketing
    },
    {
        id:"8",
        roomname:"Daily Standup",
        description:"Quick updates and task check-ins for the day.",
        image:IMAGES.standup
    },
    {
        id:"9",
        roomname:"Bug Squashers",
        description:"Dev chat for finding and fixing those pesky bugs.",
        image:IMAGES.bugrepellent
    },
]

const ChatRooms = () => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={{backgroundColor:colors.card,flex:1}}>
            <Header
                title="Chat Rooms"
            />
            <ScrollView contentContainerStyle={{flexGrow:1}} showsVerticalScrollIndicator={false}>
                <View style={[GlobalStyleSheet.container]}>
                    <View style={{justifyContent:'center',alignItems:'center',padding:20,paddingHorizontal:45}}>
                        <Text style={{...FONTS.fontSemiBold,fontSize:22,color:colors.title,marginBottom:10}}>Select room topic</Text>
                        <Text style={{...FONTS.fontRegular,fontSize:14,color:colors.text,textAlign:'center'}}>Select a topic for your group to categorize by collection</Text>
                    </View>
                </View>
                <View style={[GlobalStyleSheet.container,{paddingTop:0}]}>
                    <View>
                        {roomsdata.map((data,index) => {
                            return(
                                <TouchableOpacity key={index}
                                    activeOpacity={0.5}
                                    onPress={() => navigation.navigate('AddMembers')}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingHorizontal: 10,
                                        paddingVertical: 10,
                                        paddingLeft: 15,
                                        marginBottom: 10,
                                        borderWidth: 1,
                                        borderRadius: 15,
                                        borderColor: theme.colors.border,
                                        backgroundColor: theme.dark ? 'rgba(255,255,255,0.03)' : '#F4F8FD',
                                    }}
                                >
                                    <View
                                        style={[GlobalStyleSheet.shadow2,{
                                            height:60,
                                            width:60,
                                            borderRadius:50,
                                            backgroundColor:COLORS.white,
                                            alignItems:'center',
                                            justifyContent:'center'
                                        }]}
                                    >
                                        <Image
                                            style={{height:40,width:40}}
                                            source={data.image}
                                        />
                                    </View>
                                    <View style={{flex:1,marginLeft:10}}>
                                        <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color: colors.title,flex:1 }}>{data.roomname}</Text>
                                        <Text style={{ ...FONTS.fontRegular,fontSize:12, color: colors.title,opacity:.4,paddingRight:35}}>{data.description}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ChatRooms