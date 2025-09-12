import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import Header from '../../layout/Header';
import Button from '../../components/button/Button';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { useNavigation } from '@react-navigation/native';


const NewChatData = [
    {
        id: '1',
        title: 'Alex Techie',
        image: IMAGES.storypic1,
        text: "alex_techie_2123",
        hasStory: false,
    },
    {
        id: '2',
        title: 'Lily Learns',
        image: IMAGES.storypic2,
        text: "your_lily@123",
        hasStory: true,
    },
    {
        id: '3',
        title: 'Mia Maven',
        image: IMAGES.storypic3,
        text: "mia-meaver_420",
        hasStory: false,
    },
    {
        id: '4',
        title: 'Sophia James',
        image: IMAGES.storypic4,
        text: "sophia_james",
        hasStory: true,
    },
    {
        id: '5',
        title: 'Deepesh gaur',
        image: IMAGES.storypic1,
        text: "deepesh_gaur22",
        hasStory: false,
    },
    {
        id: '6',
        title: 'Alex Techie',
        image: IMAGES.storypic4,
        text: "alex_techie_2123",
        hasStory: false,
    },
    {
        id: '7',
        title: 'Lily Learns',
        image: IMAGES.storypic2,
        text: "your_lily@123",
        hasStory: false,
    },
    {
        id: '8',
        title: 'Mia Maven',
        image: IMAGES.storypic3,
        text: "mia-meaver_420",
        hasStory: false,
    },
    {
        id: '9',
        title: 'Sophia James',
        image: IMAGES.storypic4,
        text: "sophia_james",
        hasStory: false,
    },
    {
        id: '10',
        title: 'Deepesh gaur',
        image: IMAGES.storypic1,
        text: "deepesh_gaur22",
        hasStory: false,
    },
    {
        id: '11',
        title: 'Alex Techie',
        image: IMAGES.storypic2,
        text: "alex_techie_2123",
        hasStory: true,
    },
];

const Item = ({ title, image, text, hasStory, navigation, theme } : any) => {
    
    const [isSelected, setIsSelected] = useState(false);
    
    return (

        <TouchableOpacity
            onPress={() => setIsSelected(!isSelected)}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            hasStory == false ?
                                navigation.navigate('status', {
                                    name: title,
                                    image: image,
                                    statusData: [IMAGES.profilepic11, IMAGES.profilepic12]
                                })
                                :
                                navigation.navigate('AnotherProfile')
                        }}
                        style={{marginRight:10}}
                    >
                        {
                            hasStory == false ?
                                <View>
                                    <Image
                                        style={{ width: 55, height: 55, borderRadius: 50 }}
                                        source={image}
                                    />
                                    <Image
                                        style={{ width: 65, height: 65, position: 'absolute', bottom: -5, right: -5 }}
                                        source={IMAGES.cricle}
                                    />
                                </View>
                                :
                                <View>
                                    <Image
                                        style={{ width: 55, height: 55, borderRadius: 50 }}
                                        source={image}
                                    />
                                </View>
                        }

                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color: theme.colors.title }}>{title}</Text>
                    <Text style={{ ...FONTS.fontXs, color: theme.colors.text }}>{text}</Text>
                </View>
            </View>
            <View
                style={[{
                    borderWidth: 2,
                    width: 22,
                    height: 22,
                    borderRadius: 50,
                    borderColor: theme.colors.border,
                    alignItems: 'center',
                    justifyContent: 'center',

                }, isSelected == true && {
                    backgroundColor: '#2979F8',
                    borderWidth: 0
                }]}
            >
                <View style={{ width: 10, height: 10, backgroundColor: theme.colors.card, borderRadius: 50 }}></View>
            </View>
        </TouchableOpacity>
    )
}
const ActiveChat = () => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    return (
        <View style={{paddingLeft:15,marginBottom:20}}>
           <Text style={{...FONTS.fontRegular,...FONTS.h6,color:colors.title}}>Suggested</Text>
        </View>
    )
}

const NewChat = () => {

    const navigation = useNavigation<any>();
    
    const theme = useTheme();
    const { colors } : {colors : any} = theme;

  return (
    <SafeAreaView style={[GlobalStyleSheet.container,{padding:0, backgroundColor: colors.card, flex: 1 }]}>
          <Header
            title='New message'
          />
          <TextInput
              placeholder='Search here...'
              placeholderTextColor={colors.placeholder}
              style={[
                  GlobalStyleSheet.inputBox, {
                      backgroundColor: colors.input,
                      paddingLeft: 25,
                      marginHorizontal: 15,
                      marginTop:20
                  },
              ]}
          />
          <FlatList
              showsVerticalScrollIndicator={false}
              data={NewChatData}
              renderItem={({ item }) =>
                  <Item
                      title={item.title}
                      image={item.image}
                      text={item.text}
                      hasStory={item.hasStory}
                      navigation={navigation}
                      theme={theme}
                  />
              }
              ListHeaderComponent={() => <ActiveChat />}
              keyExtractor={item => item.id}
          /> 
          <View style={{ paddingHorizontal: 30, paddingBottom: 10 }}>
              <Button
                  title="Create Chat"
                  onPress={() => navigation.goBack()}
              />
          </View>
   </SafeAreaView>
  )
}

export default NewChat;