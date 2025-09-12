import React, { useRef } from 'react';
import { useTheme } from '@react-navigation/native';
import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import Header from '../../layout/Header';
import { IMAGES, SIZES, FONTS, COLORS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import Button from '../../components/button/Button';
// import AudioPlayer from '../../components/AudioPlayer';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import ChatoptionSheet from '../../components/bottomsheet/ChatoptionSheet';


const ReelsData = [
  {
    id: '1',
    image: IMAGES.profilepic19,
    like: '164k',
  },
  {
    id: '2',
    image: IMAGES.profilepic20,
    like: '12k',
  },
  {
    id: '3',
    image: IMAGES.profilepic21,
    like: '160k',
  },
  {
    id: '4',
    image: IMAGES.profilepic22,
    like: '134k',
  },
  {
    id: '5',
    image: IMAGES.profilepic5,
    like: '13k',
  },
  {
    id: '6',
    image: IMAGES.profilepic6,
    like: '4k',
  },
]

type MusicScreenProps = StackScreenProps<RootStackParamList, 'Music'>;

const Music = ({ navigation } : MusicScreenProps) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const moresheet = useRef<any>();


  return (
    <SafeAreaView style={[GlobalStyleSheet.container,{padding:0, backgroundColor:colors.card,flex:1}]} >
      <Header
          title='Audio'
          share={true}
          more={true}
          moresheet={moresheet}
      />
      <View style={[GlobalStyleSheet.container, { padding: 15 }]}>
        <View style={{flexDirection:'row'}}>
          <Image
            style={{borderRadius:SIZES.radius_sm,height:80,width:80}}
            source={IMAGES.musicpic}
          />
          <View style={{paddingLeft:20}}>
            <Text style={[GlobalStyleSheet.btnTxt, { color: colors.title,textAlign:'left',marginBottom:2 }]}>Original audio</Text>
            <Text style={[GlobalStyleSheet.textfont, { color: colors.text,marginBottom:15 }]}>podcast - janjipodcast</Text>
            <Text style={[GlobalStyleSheet.textfont, { color: theme.dark ? 'rgba(255,255,255,0.5)' : 'rgba(71, 90, 119, 0.50)', }]}>18.6K reels</Text>
          </View>
        </View>
        <View style={{marginTop:20}}>
          <Button
            title='use audio'
            onPress={() => navigation.navigate('CreateStory')}
          />
        </View>
      </View>
      <View style={{ marginTop: 5, flexDirection: 'row', flexWrap: 'wrap' }}>
        {ReelsData.map((data, index) => {
          return (
            <View key={index} style={{ width: '33.33%', padding: 2 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ProfileReels')}
              >
                <Image
                  style={{ width: '100%', height: undefined, aspectRatio: 1 / 1.8, }}
                  source={data.image}
                />
                <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.20)', position: 'absolute', borderRadius: 15, paddingHorizontal: 10, paddingVertical: 3, top: 10, right: 10 }}>
                  <Image
                    style={{ width: 12, height: 12, resizeMode: 'contain', tintColor: '#fff' }}
                    source={IMAGES.eyeopen}
                  />
                  <Text style={{ ...FONTS.fontRegular, fontSize: 10, color: COLORS.white, lineHeight: 14 }}>{data.like}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
      <ChatoptionSheet
          ref={moresheet}
          block={false}
          deleteChat={false}
      />
   </SafeAreaView>
  )
}

export default Music;