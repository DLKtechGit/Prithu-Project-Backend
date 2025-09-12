import React from 'react';
import { View, Text,Image,TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';

type VideoScreenProps = StackScreenProps<RootStackParamList, 'Video'>;

const Video = ({ navigation } : VideoScreenProps) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const [show, setshow] = React.useState(true);

    return (
      <SafeAreaView style={[GlobalStyleSheet.container,{padding:0,flex:1}]}>
        <ImageBackground
            style={{width:'100%',height:'100%',flex:1}}
            source={IMAGES.videocall}
        >
            <TouchableOpacity
              style={{position:'absolute',top:50,left:20}}
            >
                <Image
                  style={{width:110,height:180,borderRadius:15}}
                  source={IMAGES.videocall2}
                />
            </TouchableOpacity>
            <View style={[GlobalStyleSheet.flexaling,{ position: 'absolute', top: 50, right: 20,gap:5 }]}>
              <View style={{ backgroundColor:'red', width: 10, height: 10, borderRadius: 50, borderWidth: 2, borderColor: 'red' }}></View>
              <Text style={{...FONTS.font,...FONTS.fontMedium,fontSize:13,color:COLORS.white,opacity:.7}}>28:58</Text>
            </View>
            <View style={{ position: 'absolute', bottom: 50,left:0,right:0 }}>
                <View style={{paddingHorizontal:20,alignItems:'center'}}>
                  <Text style={{...FONTS.fontSemiBold,...FONTS.h4,color:COLORS.white}}>Mr. Lily Learns</Text>  
                  <Text style={{...FONTS.h6,...FONTS.fontMedium,color:COLORS.white,opacity:.4,marginTop:5}}>video Call</Text>  
                </View>
                <View style={[GlobalStyleSheet.flexaling, {justifyContent:'center',gap:20,marginTop:20}]}>
                    <TouchableOpacity>
                        <View style={{ backgroundColor: 'rgba(255,255,255,.1)', height: 50, width: 50, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                style={[GlobalStyleSheet.image,{tintColor:COLORS.white}]}
                                source={IMAGES.camera}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.goBack()}
                    >
                        <View style={{ backgroundColor:'red', height: 60, width: 60, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                style={[GlobalStyleSheet.image, { tintColor: COLORS.white,width:35,height:35 }]}
                                source={IMAGES.phone}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setshow(!show)
                      }}
                    >
                        <View style={{ backgroundColor: 'rgba(255,255,255,.1)', height: 50, width: 50,  borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
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
        </ImageBackground>
      </SafeAreaView>
    )
}

export default Video;