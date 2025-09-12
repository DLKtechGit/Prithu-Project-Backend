import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, IMAGES } from '../constants/theme';
import LikeBtn from '../components/likebtn/LikeBtn';
import { useNavigation } from '@react-navigation/native';
import { GlobalStyleSheet } from '../constants/styleSheet';
import { Video } from 'expo-av';

const Reelsitem = ({ like, comment, save, send, image, text, music, holder, sheetRef, reelsvideo, hasStory } : any) => {
    const navigation = useNavigation<any>();

    const [isShow, setIsShow] = useState<any>(false);

    const [show, setshow] = React.useState(true);

    const video = React.useRef(null);

    return (
      <View style={[GlobalStyleSheet.container,{padding:0, flex:1,backgroundColor:'#000'}]}>
        <View>
             <Video
                ref={video}
                source={reelsvideo}
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
        <View style={{position:'absolute',bottom:20,left:20,paddingRight:120}}>
            <View style={GlobalStyleSheet.flexaling}>
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            hasStory == false ?
                                navigation.navigate('status', {
                                    name: holder,
                                    image: image,
                                    statusData: [IMAGES.profilepic11, IMAGES.profilepic12]
                                })
                                :
                                navigation.navigate('AnotherProfile')
                        }}
                                
                        style={{ marginRight: 20 }}
                    >
                            {
                                hasStory == false ?
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            style={{ width: 45, height: 45, borderRadius: 50 }}
                                            source={image}
                                        />
                                        <Image
                                            style={{ width: 55, height: 55, position: 'absolute'}}
                                            source={IMAGES.cricle}
                                        />
                                    </View>
                                    :
                                    <View>
                                        <Image
                                            style={{ width: 45, height: 45, borderRadius: 50 }}
                                            source={image}
                                        />
                                    </View>
                            }
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AnotherProfile')}     
                    >
                        <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color: COLORS.white }}>{holder}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{marginTop:20}}>
                <Text numberOfLines={isShow ? 0 : 1} style={{ ...FONTS.fontRegular, color: COLORS.white, fontSize: 12 }}>{text}</Text>
                {isShow === false &&       
                    <TouchableOpacity
                        onPress={() => setIsShow(true)}
                        >
                        <Text style={{ ...FONTS.fontRegular, color:COLORS.white,opacity:.6, fontSize: 12,position:'absolute',bottom:-4,right:-30 }}>more</Text>
                    </TouchableOpacity>
                }
            </View>
            <View style={{   marginTop: 10 }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Music')}
                        style={GlobalStyleSheet.flexaling}
                    >
                    <Image
                        style={{width:15,height:15,tintColor:'#fff',resizeMode:'contain'}}
                        source={IMAGES.music}
                    />
                    <Text style={{ ...FONTS.fontRegular, color: COLORS.white, fontSize: 11, marginLeft: 5 }}>{music}</Text>
                </TouchableOpacity>
            </View>
        </View>
        <View style={{ position: 'absolute', bottom:30, right: 20 }}>
            <View style={{alignItems:'center',marginBottom:10}}>
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
                    <Text style={GlobalStyleSheet.Text}>{like}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <TouchableOpacity
                        onPress={() => navigation.navigate('Comments')}
                >
                <View style={GlobalStyleSheet.background}>
                    <Image
                        style={[GlobalStyleSheet.image, {tintColor: COLORS.white}]}
                        source={IMAGES.comment}
                    />
                </View>
            </TouchableOpacity>
                 <Text style={GlobalStyleSheet.Text}>{comment}</Text>
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
                    <Text style={GlobalStyleSheet.Text}>{save}</Text>
            </View>
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <TouchableOpacity
                    onPress={() => sheetRef.current.openSheet('PostShare')}
                >
                    <View style={GlobalStyleSheet.background}>
                    <Image
                        style={[GlobalStyleSheet.image, { tintColor: COLORS.white }]}
                        source={IMAGES.send}
                    />
                    </View>
                </TouchableOpacity>
                <Text style={GlobalStyleSheet.Text}>{send}</Text>
            </View>
        </View>  
    </View>
    )
}

export default Reelsitem;