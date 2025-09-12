import React from 'react';
import { View, Text, SafeAreaView, Image,TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';	
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { ScrollView } from 'react-native-gesture-handler';
import { COLORS, IMAGES, FONTS,SIZES } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';

const StoryData = [
  {
    id: '1',
    backgroundColor: '#00abc5',
    image: IMAGES.music,
    text: 'Music',
    navigate: "Music2"
  },
  {
    id: '2',
    backgroundColor: '#8c55e2',
    image: IMAGES.happy,
    text: 'Selfie',
   

  },
  {
    id: '3',
    backgroundColor: '#f151a7',
    image: IMAGES.text,
    text: 'Text',
    navigate:"WriteCaption"
  },
]

const storyimage = [
  {
    id: "17",
    image: IMAGES.storypic5
  },
  {
    id: "18",
    image: IMAGES.storypic6
  },
  {
    id: "19",
    image: IMAGES.storypic7
  },
  {
    id: "20",
    image: IMAGES.storypic8
  },
  {
    id: "21",
    image: IMAGES.storypic9
  },
  {
    id: "22",
    image: IMAGES.storypic10
  },
  {
    id: "23",
    image: IMAGES.storypic11
  },
  {
    id: "24",
    image: IMAGES.storypic12
  },
  {
    id: "25",
    image: IMAGES.storypic13
  },
  {
    id: "26",
    image: IMAGES.storypic14
  },
  {
    id: "27",
    image: IMAGES.storypic15
  },
  {
    id: "28",
    image: IMAGES.profilepic15
  },
  {
    id: "1",
    image: IMAGES.profilepic1
  },
  {
    id: "2",
    image: IMAGES.profilepic2
  },
  {
    id: "3",
    image: IMAGES.profilepic3
  },
  {
    id: "4",
    image: IMAGES.profilepic4
  },
  {
    id: "5",
    image: IMAGES.storypic2
  },
  {
    id: "6",
    image: IMAGES.storypic3
  },
  {
    id: "7",
    image: IMAGES.storypic4
  },
  {
    id: "8",
    image: IMAGES.storypic1
  },
  {
    id: "9",
    image: IMAGES.profilepic5
  },
  {
    id: "10",
    image: IMAGES.profilepic6
  },
  {
    id: "11",
    image: IMAGES.profilepic7
  },
  {
    id: "12",
    image: IMAGES.profilepic8
  },
  {
    id: "13",
    image: IMAGES.profilepic9
  },
  {
    id: "14",
    image: IMAGES.profilepic10
  },
  {
    id: "15",
    image: IMAGES.profilepic11
  },
  {
    id: "16",
    image: IMAGES.profile2
  },
];

type AddStoryScreenProps = StackScreenProps<RootStackParamList, 'AddStory'>;

const AddStory = ({ navigation } : AddStoryScreenProps)=> {

   const theme = useTheme();
    const { colors } : {colors : any} = theme;

  return (
    <SafeAreaView style={[GlobalStyleSheet.container,{padding:0, backgroundColor:colors.card,flex:1}]}>
      <Header
        title='Create story'
      />
      <View style={[GlobalStyleSheet.container,{flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:20}]}>
            {StoryData.map((data:any,index) => {
                return (
                  <View key={index}>
                    <TouchableOpacity style={{ backgroundColor: data.backgroundColor, width: 100, height: 150, borderRadius: 8, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}
                      onPress={() => data.navigate && navigation.navigate(data.navigate)}
                    >
                      <View style={{backgroundColor:COLORS.white,width:50,height:50,borderRadius:50,justifyContent:'center',alignItems:'center',marginBottom:10}}>
                        <Image
                          style={{width:25,height:25,resizeMode:'contain'}}
                          source={data.image}
                        />
                      </View>
                      <Text style={[GlobalStyleSheet.textfont,{color:COLORS.white}]}>{data.text}</Text>
                    </TouchableOpacity>
                  </View>
                )
            })}
      </View>
      <View style={[GlobalStyleSheet.flexaling, { paddingHorizontal: 15,marginTop:30 }]}>
        <Text style={{ flex: 1, ...FONTS.fontMedium, ...FONTS.h5, color: colors.title }}>Gallery</Text>
        <TouchableOpacity
          style={{ padding: 10 }}
        >
          <Image
            style={{ height: 24, width: 24, tintColor: colors.title }}
            source={IMAGES.camera}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow:1}}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap',flex:1 }}>
          {storyimage.map((data, index) => {
            return (
              <View
                key={index}
                style={{ width: '25%', height: SIZES.width / 4, padding: 1 }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate('CreateStory')}
                >
                  <Image
                    style={{ width: '100%', height: '100%' }}
                    source={data.image}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
   </SafeAreaView>
  )
}

export default AddStory