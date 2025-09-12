import React from 'react';
import { View, Text,Image,TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { useRoute, useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';

const SpearkersData = [
    {
        image:IMAGES.profilepic7,
        aduio:true,
        name:"Alex Techie",
    },
    {
        image:IMAGES.profilepic8,
        aduio:true,
        name:"Lily Learns",
    },
    {
        image:IMAGES.profilepic9,
        aduio:false,
        name:"Mia Maven",
    },
    {
        image:IMAGES.profilepic10,
        aduio:false,
        name:"Sophia",
    },
    {
        image:IMAGES.storypic5,
        aduio:true,
        name:"Alex Techie",
    },
    {
        image:IMAGES.storypic6,
        aduio:true,
        name:"Lily Learns",
    },
    {
        image:IMAGES.storypic7,
        aduio:false,
        name:"Mia Maven",
    },
    {
        image:IMAGES.storypic8,
        aduio:false,
        name:"Sophia James",
    },
]


type ChatRoomVideoCallONScreenProps = StackScreenProps<RootStackParamList, 'ChatRoomVideoCallON'>;

const ChatRoomVideoCallON = ({ navigation } : ChatRoomVideoCallONScreenProps) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;
  
    const [show, setshow] = React.useState(true);

    const route = useRoute<any>();
                
    const { data } = route.params;

    return (
        <SafeAreaView style={[GlobalStyleSheet.container,{padding:0,backgroundColor:colors.card,flex:1}]}>
            <ImageBackground
                style={{width:'100%',height:'100%',flex:1}}
                source={IMAGES.videocall}
            >
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,marginTop:20}}>
                    <TouchableOpacity
                        onPress={() => {navigation.goBack(); navigation.goBack()}}
                    >
                        <Image
                            style={{ width: 18, height: 18, tintColor: '#fff' }}
                            source={IMAGES.arrowleft}
                        />
                    </TouchableOpacity>
                    <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
                        <View
                            style={[GlobalStyleSheet.shadow2,{
                                height:40,
                                width:40,
                                borderRadius:50,
                                backgroundColor:COLORS.white,
                                alignItems:'center',
                                justifyContent:'center'
                            }]}
                        >
                            <Image
                                style={{height:30,width:30}}
                                source={data.image}
                            />
                        </View>
                        <Text numberOfLines={1} style={{...FONTS.fontSemiBold,...FONTS.h4,color:COLORS.white}}>{data.title}</Text>
                    </View>
                    <View style={{alignItems:'flex-end'}}>
                        <View style={[GlobalStyleSheet.flexaling,{gap:5}]}>
                            <View style={{ backgroundColor:'red', width: 8, height: 8, borderRadius: 50, borderWidth: 2, borderColor: 'red' }}/>
                            <Text style={{...FONTS.font,...FONTS.fontMedium,fontSize:13,color:COLORS.white,opacity:.7}}>00:10</Text>
                        </View> 
                        <Text style={{...FONTS.fontMedium,fontSize:14,color:COLORS.card}}>{data.profilename}</Text>
                    </View>
                </View>
                <View
                    style={{position:'absolute',bottom:40,right:20,alignItems:'center'}}
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{marginBottom:5}}
                    >
                        <Image
                            style={{width:100,height:150,borderRadius:15}}
                            source={IMAGES.videocall2}
                        />
                        <View 
                            style={{
                                position:'absolute',
                                right:0,
                                bottom:0,
                                height:40,
                                width:40,
                                borderRadius:50,
                                backgroundColor:'rgba(0,0,0,0.6)',
                                alignItems:'center',
                                justifyContent:'center'
                            }}
                        >
                            <Image
                                style={{height:20,width:20,tintColor:COLORS.success}}
                                source={IMAGES.audio}
                            />
                        </View>
                    </TouchableOpacity>
                    <Text style={{...FONTS.fontMedium,fontSize:11,color:COLORS.card}}>Sophia James</Text>
                </View>
            </ImageBackground>
            <View
                style={{
                    paddingVertical:20,
                    paddingTop:10
                }}
            >
                <View
                    style={{
                        height:25,
                        backgroundColor:colors.card,
                        borderTopLeftRadius:50,
                        borderTopRightRadius:50,
                        position:'absolute',
                        left:0,
                        right:0,
                        top:-20,
                        alignItems:'center'
                    }}
                />
                <View style={[GlobalStyleSheet.container,{alignItems:'center',padding:0}]}>
                    <Text style={{...FONTS.fontMedium,fontSize:15,color:colors.title,marginBottom:20}}>39 Other Participants</Text>
                    <ScrollView
                        horizontal
                        contentContainerStyle={{paddingHorizontal:20}}
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={{flexDirection:'row',alignItems:'center',gap:15,}}>
                            {SpearkersData.map((data,index) => {
                                return(
                                    <View
                                        key={index}
                                        style={{alignItems:'center'}}
                                    >
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={[GlobalStyleSheet.shadow2,{
                                                height:150,
                                                width:100,
                                                borderRadius:15,
                                                padding:3,
                                                backgroundColor:colors.card,
                                                alignItems:'center',
                                                justifyContent:'center',
                                                marginBottom:10,
                                                borderWidth:2,
                                                borderColor:data.aduio === false ? COLORS.danger: COLORS.success
                                            }]}
                                        >
                                            <Image
                                                style={{height:'100%',width:'100%',borderRadius:15}}
                                                source={data.image}
                                            />
                                            <View 
                                                style={{
                                                    position:'absolute',
                                                    right:-5,
                                                    bottom:-5,
                                                    height:30,
                                                    width:30,
                                                    borderRadius:50,
                                                    backgroundColor:colors.card,
                                                    alignItems:'center',
                                                    justifyContent:'center'
                                                }}
                                            >
                                                <Image
                                                    style={{height:20,width:20,tintColor:data.aduio === false ? COLORS.danger: COLORS.success}}
                                                    source={data.aduio === false ? IMAGES.audiomute : IMAGES.audio}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        <Text style={{...FONTS.fontRegular,fontSize:13,color:colors.title,opacity:.8}}>{data.name}</Text>
                                    </View>
                                )
                            })}
                        </View>
                    </ScrollView>
                    <View>
                        <View style={[GlobalStyleSheet.flexaling, {justifyContent:'center',gap:20,marginTop:20}]}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                            >
                                <View style={{ backgroundColor:theme.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)', height: 50, width: 50, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image
                                        style={[GlobalStyleSheet.image,{tintColor:colors.text}]}
                                        source={IMAGES.camera}
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => {navigation.goBack() ; navigation.goBack()}}
                            >
                                <View style={{ backgroundColor:'red', height: 60, width: 60, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image
                                        style={[GlobalStyleSheet.image, { tintColor: COLORS.white,width:35,height:35 }]}
                                        source={IMAGES.phone}
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    setshow(!show)
                                }}
                            >
                                <View style={{ backgroundColor:theme.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)', height: 50, width: 50,  borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image
                                        style={[GlobalStyleSheet.image, { tintColor: colors.text }]}
                                        source={
                                            show
                                            ?
                                            IMAGES.audio
                                            :
                                            IMAGES.audiomute
                                        }
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ChatRoomVideoCallON;