import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import { useRoute, useTheme } from '@react-navigation/native';

const SpearkersData = [
    {
        image:IMAGES.storypic1,
        aduio:true,
        name:"Alex Techie",
    },
    {
        image:IMAGES.storypic2,
        aduio:true,
        name:"Lily Learns",
    },
    {
        image:IMAGES.storypic3,
        aduio:false,
        name:"Mia Maven",
    },
    {
        image:IMAGES.storypic4,
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

type ChatRoomCallONScreenProps = StackScreenProps<RootStackParamList, 'ChatRoomCallON'>;

const ChatRoomCallON = ({ navigation } : ChatRoomCallONScreenProps) => {


    const [show, setshow] = React.useState(true);

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const route = useRoute<any>();
            
    const { data } = route.params;

    return (
        <SafeAreaView style={[GlobalStyleSheet.container,{ backgroundColor: '#112036', flex: 1,padding:0 }]}>
            <View style={GlobalStyleSheet.container}>
                <View style={{paddingTop:20}}>
                    <TouchableOpacity
                        onPress={() => {navigation.goBack(); navigation.goBack()}}
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
                            height:100,
                            width:100,
                            borderRadius:50,
                            backgroundColor:COLORS.white,
                            alignItems:'center',
                            justifyContent:'center',
                            marginBottom:10
                        }]}
                    >
                        <Image
                            style={{height:95,width:95,borderRadius:50}}
                            source={IMAGES.profile}
                        />
                    </View>
                    <View style={{alignItems:'center',marginHorizontal:40}}>
                        <Text style={{ ...FONTS.fontMedium,fontSize:18, color:COLORS.card ,marginVertical:5}}>{data.profilename}</Text>
                        <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                            <View style={{ backgroundColor:'red', width: 8, height: 8, borderRadius: 50, borderWidth: 2, borderColor: 'red' }}/>
                            <Text style={{ ...FONTS.h6, ...FONTS.fontMedium, color: COLORS.white, opacity: .4, }}>00:10</Text>
                        </View>
                    </View>
                </View>
                <View style={{marginVertical:10,alignItems:'center'}}>
                    <Text style={{...FONTS.fontMedium,fontSize:15,color:COLORS.card,marginBottom:30}}>39 Other Participants</Text>
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
                                        <View
                                            style={[GlobalStyleSheet.shadow2,{
                                                height:60,
                                                width:60,
                                                borderRadius:50,
                                                backgroundColor:'#112036',
                                                alignItems:'center',
                                                justifyContent:'center',
                                                marginBottom:10,
                                                borderWidth:1.5,
                                                borderColor:data.aduio === false ? COLORS.danger: COLORS.success
                                            }]}
                                        >
                                            <Image
                                                style={{height:50,width:50,borderRadius:50}}
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
                                                    backgroundColor:'#112036',
                                                    alignItems:'center',
                                                    justifyContent:'center'
                                                }}
                                            >
                                                <Image
                                                    style={{height:20,width:20,tintColor:data.aduio === false ? COLORS.danger: COLORS.success}}
                                                    source={data.aduio === false ? IMAGES.audiomute : IMAGES.audio}
                                                />
                                            </View>
                                        </View>
                                        <Text style={{...FONTS.fontRegular,fontSize:12,color:colors.card,opacity:.8}}>{data.name}</Text>
                                    </View>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View>
                <View style={{marginBottom:30}}>
                    <View style={[GlobalStyleSheet.flexaling, {justifyContent: 'center', gap: 20, marginTop: 20 }]}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                        >
                            <View style={GlobalStyleSheet.background}>
                                <Image
                                    style={[GlobalStyleSheet.image,{ tintColor: COLORS.white }]}
                                    source={IMAGES.volume}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.6}
                        >
                                <View style={GlobalStyleSheet.background}>
                                    <Image
                                        style={[GlobalStyleSheet.image, { tintColor: COLORS.white }]}
                                        source={IMAGES.zoom}
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
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {navigation.goBack(); navigation.goBack()}}
                        >
                            <View style={[GlobalStyleSheet.background,{backgroundColor:'red'}]}>
                                <Image
                                    style={{ tintColor: COLORS.white, width: 25, height: 25,resizeMode:'contain' }}
                                    source={IMAGES.phone}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ChatRoomCallON;