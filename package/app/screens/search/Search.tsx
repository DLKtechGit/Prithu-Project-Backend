import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IMAGES, SIZES, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import ProfilePostData from '../profile/ProfilePostData';
import { ScrollView } from 'react-native-gesture-handler';
import Sharebtn from '../../components/button/Sharebtn';
import Followbtn from '../../components/button/Followbtn';


const data = [
  {
    id: '1',
    image: IMAGES.profilepic5,
    like: '164',
  },
  {
    id: '2',
    image: IMAGES.profilepic6,
    like: '132',
  },
  {
    id: '3',
    image: IMAGES.profilepic7,
    like: '30',
  },
  {
    id: '4',
    image: IMAGES.profilepic8,
    like: '154',
  },
  {
    id: '5',
    image: IMAGES.profilepic9,
    like: '100',
  },
  {
    id: '6',
    image: IMAGES.profilepic10,
    like: '1K',
  },
  {
    id: '7',
    image: IMAGES.profilepic11,
    like: '164',
  },
  {
    id: '8',
    image: IMAGES.profilepic12,
    like: '132',
  },
  {
    id: '9',
    image: IMAGES.profilepic13,
    like: '30',
  },
  {
    id: '10',
    image: IMAGES.profilepic14,
    like: '154',
  },
  {
    id: '11',
    image: IMAGES.profilepic15,
    like: '100',
  },
  {
    id: '12',
    image: IMAGES.profilepic16,
    like: '1K',
  },
  {
    id: '13',
    image: IMAGES.profilepic2,
    like: '164',
  },
  {
    id: '14',
    image: IMAGES.profilepic22,
    like: '132',
  },
  {
    id: '15',
    image: IMAGES.profilepic20,
    like: '30',
  },
  {
    id: '16',
    image: IMAGES.profilepic17,
    like: '154',
  },
  {
    id: '17',
    image: IMAGES.profilepic18,
    like: '100',
  },
  {
    id: '18',
    image: IMAGES.profilepic4,
    like: '1K',
  },
  {
    id: '19',
    image: IMAGES.profilepic10,
    like: '164',
  },
  {
    id: '20',
    image: IMAGES.profilepic11,
    like: '132',
  },
  {
    id: '21',
    image: IMAGES.profilepic12,
    like: '30',
  },
  {
    id: '22',
    image: IMAGES.profilepic13,
    like: '154',
  },
  {
    id: '23',
    image: IMAGES.profilepic14,
    like: '100',
  },
  {
    id: '24',
    image: IMAGES.profilepic1,
    like: '1K',
  }
]


const SuggestionData = [
  {
    id: '1',
    title: 'Alex Techie',
    image: IMAGES.storypic1,
    hasStory: false,
  },
  {
    id: '2',
    title: 'Lily Learns',
    image: IMAGES.storypic2,
    hasStory: true,
  },
  {
    id: '3',
    title: 'Mia Maven',
    image: IMAGES.storypic3,
    hasStory: false
  },
  {
    id: '4',
    title: 'Sophia James',
    image: IMAGES.storypic4,
    hasStory: true,
  },
  {
    id: '5',
    title: 'Deepesh gaur',
    image: IMAGES.storypic1,
    hasStory: false,
  },
  {
    id: '6',
    title: 'Alex Techie',
    image: IMAGES.storypic4,
    hasStory: false
  },
  {
    id: '7',
    title: 'Lily Learns',
    image: IMAGES.storypic2,
    hasStory: false,
  },
  {
    id: '8',
    title: 'Mia Maven',
    image: IMAGES.storypic3,
    hasStory: false,
  },
  {
    id: '9',
    title: 'Sophia James',
    image: IMAGES.storypic4,
    hasStory: false,
  },
  {
    id: '10',
    title: 'Deepesh gaur',
    image: IMAGES.storypic1,
    hasStory: false
  },
  {
    id: '11',
    title: 'Alex Techie',
    image: IMAGES.storypic2,
    hasStory: true,
  },
];


const Search = ({ navigation } : any) => {

  const theme = useTheme();
  const { colors } : {colors : any} = theme;

  return (
    <SafeAreaView style={[GlobalStyleSheet.container,{padding:0, backgroundColor: colors.card, flex: 1 }]}>
      <View style={GlobalStyleSheet.container}>

        <View style={{ marginVertical: 20, marginBottom: 10 }}>
          <TouchableOpacity
            style={{
              zIndex: 1,
              position: 'absolute',
              top: 13,
              left: 15
            }}
          >
            <Image
              style={{
                tintColor: colors.text,
                width: 20,
                height: 20,
                resizeMode: 'contain'
              }}
              source={IMAGES.search}
            />
          </TouchableOpacity>
          <TextInput
            placeholder='Search chat here...'
            placeholderTextColor={colors.placeholder}
            style={[
              GlobalStyleSheet.inputBox, {
                backgroundColor: colors.input,
              },
            ]}
          />
        </View>
      </View>
      <KeyboardAvoidingView
        style={{flex: 1}}
        // behavior={Platform.OS === 'ios' ? 'padding' : ''}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <Text style={[GlobalStyleSheet.textfont, { color: colors.title, fontSize: 14, paddingLeft: 15, marginBottom: 10 }]}>Suggestion</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 15 }}
          >
            {SuggestionData.map((data, index) => {

              const [show, setshow] = React.useState(true);
              return (
                <View key={index} style={{ marginBottom: 30, marginRight:10 }}>
                  <View style={{ backgroundColor: colors.input, height: 153, width: 135, borderRadius: SIZES.radius }}>
                    <View style={{ alignItems: 'center' }}>

                      <TouchableOpacity
                        onPress={() => {
                          data.hasStory == false ?
                            navigation.navigate('AnotherProfile')
                            :
                            navigation.navigate('status', {
                              name: data.title,
                              image: data.image,
                              statusData: [IMAGES.profilepic11, IMAGES.profilepic12]
                            })
                        }}
                        style={{ marginTop: 20 }}
                      >
                        {
                          data.hasStory == true ?
                            <View>
                              <Image
                                style={{ width: 50, height: 50, borderRadius: 50 }}
                                source={data.image}
                              />
                              <Image
                                style={{ width: 58, height: 58, position: 'absolute', bottom: -4, right: -4, resizeMode: 'contain' }}
                                source={IMAGES.cricle}
                              />
                            </View>
                            :
                            <View>
                              <Image
                                style={{ width: 50, height: 50, borderRadius: 50 }}
                                source={data.image}
                              />
                            </View>
                        }

                      </TouchableOpacity>
                      <Text style={[GlobalStyleSheet.textfont, { color: colors.title, marginTop: 10 }]}>{data.title}</Text>
                      <View style={{ marginTop: 10 }}>
                        {show ?

                          <Followbtn
                            title='Follow'
                            onPress={() => setshow(!show)}
                          />
                          :
                          <Sharebtn
                            title="Following"
                            white={true}
                            onPress={() => setshow(!show)}
                          />
                        }
                      </View>
                    </View>
                  </View>
                </View>
              )
            })}
          </ScrollView>
          <View style={[GlobalStyleSheet.container,{padding:0, width: SIZES.width > SIZES.container ?  SIZES.container :SIZES.width }]}>
            <Text style={[GlobalStyleSheet.textfont, { color: colors.title, fontSize: 14, paddingLeft: 15, marginBottom: 5 }]}>Public Posts</Text>
            <ProfilePostData navigation={navigation} ProfilepicData={data} />
          </View>
        </ScrollView>

      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Search;