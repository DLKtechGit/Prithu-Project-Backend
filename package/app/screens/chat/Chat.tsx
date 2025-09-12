import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { useTheme } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const ChatData = [
  {
    id: '0',
    title: 'Chill Zone',
    image: IMAGES.chillzone,
    username1:"Mia Maven",
    username2:"Sophia James",
    description:"A laid-back space to relax and chat about anything.",
    time:'1 min',
    activeuser:"+99",
    active:true,
    chatroom:true,
    accountholder:"Lily Learns",
    profilename:"Alex Techie"
  },
  {
    id: '1',
    title: 'Alex Techie',
    image: IMAGES.storypic1,
    text: "uff ye mst story 🥰",
    hasStory: false,
    time:'2 min',
    chatcount:'1',
    active:true,
  },
  {
    id: '2',
    title: 'Lily Learns',
    image: IMAGES.storypic2,
    text: "Good Morning ❤️",
    hasStory: true,
    time: '5min',
    chatcount:'2',
    active: false,
  },
  {
    id: '3',
    title: 'Mia Maven',
    image: IMAGES.storypic3,
    text: "Good Night 🤞",
    hasStory: false,
    time: '10 min',
    chatcount:'3',
    active:true,
  },
  {
    id: '4',
    title: 'Coffee & Chat',
    image: IMAGES.CoffeeChat,
    description:"Grab your favorite drink and join in casual conversations.",
    activeuser:"+999",
    username1:"Alex Techie",
    username2:"Lily Learns",
    time:'20 min',
    active:false,
    chatroom:true,
    accountholder:"Mia Learns",
    profilename:"Alex Techie"
  },
  {
    id: '5',
    title: 'Deepesh gaur',
    image: IMAGES.storypic1,
    text: "Welcome bro ❤️",
    hasStory: false,
    time: '1 d',
    active: false,
  },
  {
    id: '6',
    title: 'Alex Techie',
    image: IMAGES.storypic4,
    text: "hmm ",
    hasStory: false,
    time: '5 d',
    active:true,
  },
  {
    id: '7',
    title: 'Lily Learns',
    image: IMAGES.storypic2,
    text: "yes bro",
    hasStory: false,
    time: '10 d',
    active: false,
  },
  {
    id: '8',
    title: 'Mia Maven',
    image: IMAGES.storypic3,
    text: "Have a nice day 🥰",
    hasStory: false,
    time: '15 d',
    active:true,
  },
  {
    id: '9',
    title: 'Sophia James',
    image: IMAGES.storypic4,
    text: "I call you later 🤙",
    hasStory: false,
    time: '16 d',
    active: false,
  },
  {
    id: '10',
    title: 'Deepesh gaur',
    image: IMAGES.storypic1,
    text: "I am busy ",
    hasStory: false,
    time: '20 d',
    active:true,
  },
  {
    id: '11',
    title: 'Alex Techie',
    image: IMAGES.storypic2,
    text: "Good morning dear 🐻",
    hasStory: true,
    time: '25 d',
    active:false,
  },
];

const LiveUserData = [
  {
    id: '0',
    title: 'Chill Zone',
    image: IMAGES.chillzone,
    activeuser:"+99",
    active: true,
    chatroom:true,
    accountholder:"Mia Learns"
  },
  {
    id: '1',
    title: 'Coffee & Chat',
    image: IMAGES.CoffeeChat,
    activeuser:"+999",
    chatroom:true,
    accountholder:"Mia Learns"
  },
  {
    id: '2',
    title: 'Alex Techie',
    image: IMAGES.storypic2,
    active: true,
    
  },
  {
    id: '3',
    title: 'Lily Learns',
    image: IMAGES.storypic3,
    active: false,
  },
  {
    id: '4',
    title: 'Mia Maven',
    image: IMAGES.storypic4,
    active: true,
    
  },
  {
    id: '5',
    title: 'Sophia Techie',
    image: IMAGES.storypic1,
    active: false,
  },
  {
    id: '6',
    title: 'Sophia James',
    image: IMAGES.profilepic7,
    active: false,
  },
  {
    id: '7',
    title: 'herry Techie',
    image: IMAGES.profilepic8,
    active: true,
  },
]


const Item = ({ title, data, image, text, hasStory, time, chatcount, active, navigation, theme,chatroom,description,activeuser,username1,username2,accountholder } :any) => (
 
  <View>
    {chatroom === true ?
        <TouchableOpacity
          onPress={() => {navigation.navigate('SingleChatRoom', {data : data})}}
          activeOpacity={0.5}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 10,
            marginBottom: 8,
            borderWidth: 1,
            borderRadius: 15,
            marginHorizontal: 15,
            borderColor: theme.colors.border,
            backgroundColor: theme.dark ? 'rgba(255,255,255,0.03)' : '#F4F8FD',
          }}
        > 
          <View
            style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}
          >
            <View>
              <View
                  style={[GlobalStyleSheet.shadow2,{
                      height:48,
                      width:48,
                      borderRadius:50,
                      backgroundColor:COLORS.white,
                      alignItems:'center',
                      justifyContent:'center'
                  }]}
              >
                  <Image
                      style={{height:35,width:35}}
                      source={image}
                  />
                  <View
                    style={[GlobalStyleSheet.shadow2,{
                        height:30,
                        width:30,
                        borderRadius:30,
                        backgroundColor:theme.colors.card,
                        alignItems:'center',
                        justifyContent:'center',
                        position:'absolute',
                        right:-10,
                        bottom:-5
                    }]}
                  >
                    <Text style={{...FONTS.fontRegular,fontSize:11,color:theme.colors.text,lineHeight:16}}>{activeuser}</Text>
                  </View>
              </View>
            </View>
            <View style={{flex:1,marginLeft:20}}>
                <View style={{flexDirection:'row',marginBottom:5}}>
                  <View style={{flex:1, flexDirection:'row',alignItems:'center',gap:5}}>
                    {active == true &&
                      <View style={{ backgroundColor: COLORS.success, width: 12, height: 12, borderRadius: 50, borderWidth: 2, borderColor:theme.dark ? theme.colors.card : '#F4F8FD' }}/>
                    }
                    <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color: theme.colors.title}}>{title}</Text>
                    {accountholder &&
                      <View style={{height:6,width:6,borderRadius:15,backgroundColor:theme.colors.title,opacity:.5,marginHorizontal:5}}/>
                    }
                    {accountholder &&
                      <Text style={{ ...FONTS.font,fontSize:12, color: theme.colors.title,opacity:.5}}>{accountholder}</Text>
                    }
                  </View>
                  <Text style={{ ...FONTS.fontSm, ...FONTS.fontRegular, color: theme.colors.title,opacity:.4}}>{time}</Text>
                </View>
                {chatroom === true &&
                  <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                    <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                      <Text style={{...FONTS.fontMedium,fontSize:12,color:theme.colors.text}}>{username1}</Text>
                      <Image
                        style={[{height:14,width:14, tintColor:theme.colors.text}]}
                        source={IMAGES.messenger}
                      />
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                      <Text style={{...FONTS.fontMedium,fontSize:12,color:theme.colors.text}}>{username2}</Text>
                      <Image
                        style={[{height:14,width:14, tintColor:theme.colors.text}]}
                        source={IMAGES.audio}
                      />
                    </View>
                  </View>
                }
            </View>
          </View>
        </TouchableOpacity>
    :
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {navigation.navigate('SingleChat', {data : data})}}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            paddingVertical: 10,
            marginBottom: 8,
            borderWidth: 1,
            borderRadius: 15,
            marginHorizontal: 15,
            borderColor: theme.colors.border,
            backgroundColor: theme.dark ? 'rgba(255,255,255,0.03)' : '#F4F8FD',
          }}
        >
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
                style={{ marginRight: 10 }}
              >
                {
                  hasStory == false ?
                    <View>
                      <Image
                        style={{ width: 40, height: 40, borderRadius: 50 }}
                        source={image}
                      />
                      <Image
                        style={{ width: 48, height: 48, position: 'absolute', bottom: -4, right: -4 }}
                        source={IMAGES.cricle}
                      />
                    </View>
                    :
                    <View>
                      <Image
                        style={{ width: 42, height: 42, borderRadius: 50 }}
                        source={image}
                      />
                    </View>
                }
                {active == true &&
                  <View style={{ backgroundColor: COLORS.success, width: 12, height: 12, borderRadius: 50, position: 'absolute', bottom: -1, right: -1, borderWidth: 2, borderColor:theme.dark ? theme.colors.card : '#F4F8FD' }}/>
                }
              </TouchableOpacity>
            </View>
            <View style={{flex:1}}>
              <View style={{flexDirection:'row',marginBottom:5}}>
                <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color: theme.colors.title,flex:1 }}>{title}</Text>
                <Text style={{ ...FONTS.fontSm, ...FONTS.fontRegular, color: theme.colors.title,opacity:.4}}>{time}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                {chatroom === false &&
                  <Text numberOfLines={1} style={{ ...FONTS.fontXs, color: theme.colors.text }}>{description}</Text>
                }
                <Text style={{ ...FONTS.fontXs, color: theme.colors.text, flex: 1 }}>{text}</Text>
                {chatcount &&
                <View style={{borderRadius: 50,backgroundColor: theme.colors.primary, }}>
                  <Text style={{ ...FONTS.font, color: '#fff', width: 20, height: 20, alignItems: 'center', textAlign: 'center', }}>{chatcount}</Text>
                </View> 
                }
              </View>
            </View>
        </TouchableOpacity>
    }
  </View>
)

const ActiveChat = () => {

  const navigation = useNavigation<any>();

  const theme = useTheme();
  const { colors } : {colors : any} = theme;

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal:15,gap:10}}
      >
        {LiveUserData.map((data:any, index:any) => {
          return (
            <View key={index}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() =>  {data.chatroom === true ? navigation.navigate('SingleChatRoom', {data : data}) : navigation.navigate('SingleChat', {data : data})}}
                style={{ alignItems: 'center', marginBottom: 10, width: 65 }}
              >
                {data.chatroom === true ? 
                  <View
                      style={[GlobalStyleSheet.shadow2,{
                          height:55,
                          width:55,
                          borderRadius:50,
                          backgroundColor:COLORS.white,
                          alignItems:'center',
                          justifyContent:'center'
                      }]}
                  >
                      <Image
                          style={{height:40,width:40}}
                          source={data.image}
                      />
                      <View
                        style={[GlobalStyleSheet.shadow2,{
                            padding:5,
                            borderRadius:30,
                            backgroundColor:theme.colors.card,
                            alignItems:'center',
                            justifyContent:'center',
                            position:'absolute',
                            right:-10,
                            bottom:0
                        }]}
                      >
                        <Text style={{...FONTS.fontRegular,fontSize:11,color:theme.colors.text,lineHeight:16}}>{data.activeuser}</Text>
                      </View>
                  </View>
                :
                  <Image
                    style={[GlobalStyleSheet.shadow2,{width: 55, height: 55,borderRadius:50}]}
                    source={ data.image }
                  />
                }
                <Text numberOfLines={1} style={{ ...FONTS.fontMedium, color: colors.title, fontSize: 10, marginTop: 5 }}>{data.title}</Text>
                {data.active === true &&
                  <View style={{ backgroundColor: COLORS.success, width: 12, height: 12, borderRadius: 50, position: 'absolute', bottom: 20, right: 10, borderWidth: 2, borderColor:colors.card }}/>
                }
              </TouchableOpacity>
            </View>
          )
        })}
      </ScrollView>
      <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title,paddingHorizontal:15,marginBottom:10}}>Messages</Text>
    </View>
  )
}

const Chat = () => {

  const navigation = useNavigation<any>();

  const theme = useTheme();
  const { colors } : {colors : any} = theme;

  return (
    <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
      <View style={GlobalStyleSheet.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor:colors.border,marginHorizontal:-15,paddingHorizontal:15 }}>
          <Text style={{ ...FONTS.fontSemiBold, fontSize: 18, color: colors.title, flex: 1 }}>Chat</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate('ChatRooms')}
            style={{
              flexDirection:'row',
              alignItems:'center',
              gap:5,
              borderWidth:1,
              borderRadius:15,
              borderColor:COLORS.primary,
              padding:3,
              paddingHorizontal:10,
              marginRight:10,
              backgroundColor:COLORS.primary
            }}
          >
            <Image
              style={{width:20,height:20,resizeMode:'contain',tintColor:COLORS.white}}
              source={IMAGES.addgroup}
            />
            <Text style={{...FONTS.fontMedium,fontSize:12,color:COLORS.white,lineHeight:16}}>Chat Rooms</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('NewChat')}
          >
            <Image
              style={{width:20,height:20,resizeMode:'contain',tintColor:colors.title}}
              source={IMAGES.write}
            />
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical:20,marginBottom:10 }}>
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
          style={[GlobalStyleSheet.container,{flex: 1,padding:0}]}
      >
        <FlatList
          showsVerticalScrollIndicator={false}
          data={ChatData}
          renderItem={({ item } :any) =>
            <Item
              title={item.title}
              data={item}
              image={item.image}
              text={item.text}
              hasStory={item.hasStory}
              time={item.time}
              chatcount={item.chatcount}
              active={item.active}
              navigation={navigation}
              theme={theme}
              chatroom={item.chatroom}
              activeuser={item.activeuser}
              username1={item.username1}
              username2={item.username2}
              description={item.description}
              accountholder={item.accountholder}
            />
          }
          ListHeaderComponent={() => <ActiveChat/>}
          keyExtractor={item => item.id}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Chat;