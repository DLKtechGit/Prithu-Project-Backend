import React from 'react';
import { View, Text, SafeAreaView,Image,TouchableOpacity } from 'react-native';
import { GlobalStyleSheet } from '../../../constants/styleSheet';
import { COLORS, IMAGES, FONTS } from '../../../constants/theme';
import Header from '../../../layout/Header';
import { useTheme } from '@react-navigation/native';

const LoginData = [
  {
    id: '1',
    text: 'Kota, Rajasthan',
    profile: 'Lily Learns',
    time: 'Active now',
    active:true
  },
  {
    id: '2',
    text: 'Kota, Rajasthan',
    profile: 'Alex Learns',
    time: '2 days ago',
    active:false
  }
]

const LoginActivity = () => {

   const theme = useTheme();
    const { colors } : {colors : any} = theme;


  return (
    <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
      <Header
        title='Login activity'
      />
      <View style={GlobalStyleSheet.container}>
        <View style={GlobalStyleSheet.flexalingjust}>
          <Text style={[GlobalStyleSheet.textfont, { fontSize: 15, marginTop: 20,color:colors.title }]}>Where you're logggrd in </Text>
        </View>
        {LoginData.map((data,index) => {
          return (
            <View key={index} style={[GlobalStyleSheet.flexalingjust,{marginTop:20}]}>
              <View style={GlobalStyleSheet.flexaling}>
                <View style={{ backgroundColor: theme.dark ? 'rgba(255,255,255,.2)' : 'rgba(41,121,248,.1)',width:30,height:30,borderRadius:8,justifyContent:'center',alignItems:'center'}}>
                  <Image
                    style={[GlobalStyleSheet.image2,{tintColor:colors.title}]}
                    source={IMAGES.pin}
                  />
                </View>
                <View style={{marginLeft:10}}>
                  <Text style={[GlobalStyleSheet.textfont,{color:colors.title}]}>{data.text}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Text style={[GlobalStyleSheet.textfont,{...FONTS.fontRegular,color:colors.title}]}>{data.profile}</Text>
                    <View style={{ width: 6, height: 6, borderRadius: 100, backgroundColor: colors.placeholder, opacity: .5 }} />
                    <Text style={[{ ...FONTS.fontSm, ...FONTS.fontRegular, opacity: .5 }, data.active == true ? {color:COLORS.success} : {color:colors.title}]}>{data.time}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity>
                <Image
                  style={[GlobalStyleSheet.image,{height:18,width:18}]}
                  source={IMAGES.logout}
                />
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    </SafeAreaView>
  )
}

export default LoginActivity;