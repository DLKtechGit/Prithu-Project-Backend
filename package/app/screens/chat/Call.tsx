import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';

type CallScreenProps = StackScreenProps<RootStackParamList, 'Call'>;

const Call = ({ navigation } : CallScreenProps) => {


    const [show, setshow] = React.useState(true);

  return (
      <SafeAreaView style={[GlobalStyleSheet.container,{padding:0, backgroundColor: '#112036', flex: 1 }]}>
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
            <View style={{ paddingTop: 30, alignItems: 'center' }}>
                <Text style={{ ...FONTS.fontSemiBold, ...FONTS.h3, color: COLORS.white }}>Mr. Lily Learns</Text>
                <Text style={{ ...FONTS.h4, ...FONTS.fontMedium, color: COLORS.white, opacity: .4, marginTop: 20 }}>10:20</Text>
            </View>
            <View style={{position:'absolute',top:350,left:0,right:0,alignItems:'center'}}>
                  <Image
                    style={{width:180,height:180,borderRadius:100}}
                    source={IMAGES.videocall}
                  />
            </View>
        </View>
        <View style={{position:'absolute',bottom:20,left:0,right:0}}>
                <View style={[GlobalStyleSheet.flexaling, {justifyContent: 'center', gap: 20, marginTop: 20 }]}>
                    <TouchableOpacity>
                        <View style={GlobalStyleSheet.background}>
                            <Image
                                style={[GlobalStyleSheet.image,{ tintColor: COLORS.white }]}
                                source={IMAGES.volume}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                            <View style={GlobalStyleSheet.background}>
                                <Image
                                    style={[GlobalStyleSheet.image, { tintColor: COLORS.white }]}
                                    source={IMAGES.zoom}
                                />
                            </View>
                    </TouchableOpacity>
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
                                      IMAGES.audio
                                      :
                                      IMAGES.audiomute
                              }
                            />
                        </View>
                    </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
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
    </SafeAreaView>
  )
}

export default Call;