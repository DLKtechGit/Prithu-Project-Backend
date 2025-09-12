import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import { useRoute, useTheme } from '@react-navigation/native';

type ChatRoomVideoCallScreenProps = StackScreenProps<RootStackParamList, 'ChatRoomVideoCall'>;

const ChatRoomVideoCall = ({ navigation } : ChatRoomVideoCallScreenProps) => {


    const [show, setshow] = React.useState(true);

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    useEffect(()=>{
        setTimeout(() => {
            {navigation.navigate('ChatRoomVideoCallON', {data : data})}
        },3500)
    },[])

    const route = useRoute<any>();
            
    const { data } = route.params;

    return (
        <SafeAreaView style={[GlobalStyleSheet.container,{ backgroundColor: '#112036', flex: 1,padding:0 }]}>
            <View style={GlobalStyleSheet.container}>
                <View style={{paddingTop:20}}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Image
                            style={{ width: 18, height: 18, tintColor: '#fff' }}
                            source={IMAGES.arrowleft}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[GlobalStyleSheet.container,{flex:1,padding:0}]}>
                <View style={{alignItems:'center',paddingBottom:20,marginBottom:15,flex:1}}>
                    <View
                        style={[GlobalStyleSheet.shadow2,{
                            height:60,
                            width:60,
                            borderRadius:50,
                            backgroundColor:COLORS.white,
                            alignItems:'center',
                            justifyContent:'center',
                            marginBottom:10
                        }]}
                    >
                        <Image
                            style={{height:40,width:40}}
                            source={data.image}
                        />
                    </View>
                    <View style={{alignItems:'center',marginHorizontal:40}}>
                        <Text style={{ ...FONTS.fontMedium,fontSize:14, color: COLORS.card }}>{data.title}</Text>
                        <View style={{flexDirection:'row',alignItems:'center',gap:5,justifyContent:'center'}}>
                            <Text numberOfLines={1} style={{ ...FONTS.fontXs, color:COLORS.card,opacity:.7  }}>{data.accountholder}</Text>
                            <View style={{height:6,width:6,borderRadius:15,backgroundColor:COLORS.card,opacity:.7}}/>
                            <Text style={{ ...FONTS.fontXs, color:COLORS.card,opacity:.7  }}>{data.activeuser} Members</Text>
                        </View>
                        <Text style={{ ...FONTS.fontRegular,fontSize:12, color: COLORS.card,opacity:.4,lineHeight:22,textAlign:'center'}}>{data.description}</Text>
                        <View style={{flexDirection:'row',alignItems:'center',gap:10,marginTop:5}}>
                            <Image
                                style={[GlobalStyleSheet.image2,{tintColor:COLORS.card}]}
                                source={IMAGES.video}
                            />
                            <Text style={{...FONTS.fontMedium,fontSize:14,color:COLORS.card,lineHeight:20}}>Video Call</Text>
                        </View>
                    </View>
                </View>
                <View style={{alignItems:'center',marginBottom:10}}>
                    <View style={{marginBottom:10}}>
                        <Text style={{...FONTS.fontSemiBold,fontSize:24,color:COLORS.card}}>Meeting Starting...</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',marginBottom:20}}>
                        <Image
                            style={{height:40,width:40,borderRadius:50,marginRight:-20}}
                            source={IMAGES.storypic1}
                        />
                        <Image
                            style={{height:50,width:50,borderRadius:50,zIndex:99}}
                            source={IMAGES.storypic2}
                        />
                        <View style={{marginHorizontal:-20,zIndex:999}}>
                            <Image
                                style={{height:70,width:70,borderRadius:50}}
                                source={IMAGES.profile}
                            />
                        </View>
                        <Image
                            style={{height:50,width:50,borderRadius:50,zIndex:99}}
                            source={IMAGES.storypic3}
                        />
                        <Image
                            style={{height:40,width:40,borderRadius:50,marginLeft:-20}}
                            source={IMAGES.storypic4}
                        />
                    </View>
                    <Text style={{...FONTS.fontMedium,fontSize:15,color:COLORS.card}}>29 Other Participants</Text>
                </View>
                <View style={{marginBottom:30}}>
                    <View style={[GlobalStyleSheet.flexaling, {justifyContent: 'center', gap: 20, marginTop: 20 }]}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                        >
                                <View style={GlobalStyleSheet.background}>
                                    <Image
                                        style={[GlobalStyleSheet.image, { tintColor: COLORS.white }]}
                                        source={IMAGES.camera}
                                    />
                                </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.goBack()}
                        >
                            <View style={[GlobalStyleSheet.background,{backgroundColor:'red'}]}>
                                <Image
                                    style={{ tintColor: COLORS.white, width: 25, height: 25,resizeMode:'contain' }}
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
                            <View style={GlobalStyleSheet.background}>
                                <Image
                                    style={[GlobalStyleSheet.image, { tintColor: COLORS.white }]}
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
        </SafeAreaView>
    )
}

export default ChatRoomVideoCall;