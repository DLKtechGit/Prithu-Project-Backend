import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import {  useRoute, useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { ScrollView } from 'react-native-gesture-handler';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import Chatroomsinfo from '../../components/bottomsheet/Chatroomsinfo';

const ChatData = [
    {
        id: '1',
        title: 'Hi, yatin👋!',
        send: false,
        userimage:IMAGES.storypic1,
        audio:true,
    },
    {
        id: '2',
        title: 'Cna you send presentation file form Mr. Alex i lost it and cant find that 😢.',
        time: "4.40pm",
        send: false,
        userimage:IMAGES.storypic2
    },
    {
        id: '3',
        title: 'Yoo, sure Deep',
        send: true,
    },
    {
        id: '4',
        title: 'Let me find that presentation at my laptop, give me a second!',
        time: "4.50pm",
        send: true,
    },
    {
        id: '5',
        title: 'Yes sure, take your time Brian',
        time: "4.55pm",
        send: false,
        userimage:IMAGES.storypic3,
        audio:true,
    },
    {
        id: '6',
        title: 'History of animal Biolo...',
        time: "4.56pm",
        send: true,
    },
    {
        id: '7',
        title: 'Thank you for helping me! ❤ You save my life hahaha! ',
        time: "4.57pm",
        send: false,
        userimage:IMAGES.storypic4,
        audio:false,
    },
    {
        id: '8',
        title: 'You, sure Deep👍 ',
        time: "4.58pm",
        send: true,
    },
    {
        id: '1',
        title: 'Hi, yatin👋!',
        send: false,
        userimage:IMAGES.storypic1,
        audio:true,
    },
    {
        id: '2',
        title: 'Cna you send presentation file form Mr. Alex i lost it and cant find that 😢.',
        time: "4.40pm",
        send: false,
        userimage:IMAGES.storypic2
    },
    {
        id: '3',
        title: 'Yoo, sure Deep',
        send: true,
    },
    {
        id: '4',
        title: 'Let me find that presentation at my laptop, give me a second!',
        time: "4.50pm",
        send: true,
    },
    {
        id: '5',
        title: 'Yes sure, take your time Brian',
        time: "4.55pm",
        send: false,
        userimage:IMAGES.storypic3,
        audio:true,
    },
    {
        id: '6',
        title: 'History of animal Biolo...',
        time: "4.56pm",
        send: true,
    },
    {
        id: '7',
        title: 'Thank you for helping me! ❤ You save my life hahaha! ',
        time: "4.57pm",
        send: false,
        userimage:IMAGES.storypic4,
        audio:false,
    },
    {
        id: '8',
        title: 'You, sure Deep👍 ',
        time: "4.58pm",
        send: true,
    },
]

type SingleChatRoomScreenProps = StackScreenProps<RootStackParamList, 'SingleChatRoom'>;

const SingleChatRoom = ({ navigation } : SingleChatRoomScreenProps)  => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const sheetRef = React.useRef<any>();

    const route = useRoute<any>();
    
    const { data } = route.params;

    const scrollViewRef = useRef<any>(null);
    
    const [messageList, setMessageList] = useState(ChatData);
    const [message, setMessage] = useState("");

    const sendMessage = () => {
        if(message.length > 0){
            setMessageList([
                ...messageList,
                {
                    id: '0',
                    title: message,
                    time: "4.40pm",
                    send: true,
                },
            ])
            setMessage("");
        }
    }

    return (
        <SafeAreaView style={[GlobalStyleSheet.container,{ backgroundColor: '#112036', flex: 1,padding:0 }]}>
            <View style={GlobalStyleSheet.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, }}>
                    <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                        >
                            <Image
                                style={{ width: 18, height: 18,tintColor:'#fff' }}
                                source={IMAGES.arrowleft}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            // onPress={() => sheetRef.current.openSheet()}
                            onPress={() => sheetRef.current.openSheet({data : data})}
                            activeOpacity={0.6} 
                            style={{
                                flex:1,
                                flexDirection:'row',
                                alignItems:'center'
                            }}
                        >
                            <View
                                style={[GlobalStyleSheet.shadow,{
                                    height:50,
                                    width:50,
                                    borderRadius:50,
                                    backgroundColor:COLORS.white,
                                    alignItems:'center',
                                    justifyContent:'center',
                                    marginLeft:15
                                }]}
                            >
                                <Image
                                    style={{height:40,width:40}}
                                    source={data.image}
                                />
                            </View>
                            <View style={{marginLeft:10}}>
                                <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                                    {data.active === true &&
                                        <View style={{ backgroundColor: COLORS.success, width: 10, height: 10, borderRadius: 50}}/>
                                    }
                                    <Text style={{ ...FONTS.fontMedium,fontSize:14, color: COLORS.card,lineHeight:20 }}>{data.title}</Text>
                                </View>
                                <View style={{flexDirection:'row',alignItems:'center',gap:5,paddingRight:75}}>
                                    <Text numberOfLines={1} style={{ ...FONTS.fontXs, color:'#fff',opacity:.7  }}>{data.accountholder}</Text>
                                    <View style={{height:6,width:6,borderRadius:15,backgroundColor:'#fff',opacity:.7}}/>
                                    <Text style={{ ...FONTS.fontXs, color:'#fff',opacity:.7  }}>{data.activeuser} Members</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>  
                    <View style={{ flexDirection: 'row', }}>
                        <TouchableOpacity
                            onPress={() => {navigation.navigate('ChatRoomCall', {data : data})}}
                            style={{padding:10}}
                        >
                          <Image
                              style={[GlobalStyleSheet.image,{tintColor: '#fff'}]}
                              source={IMAGES.call}
                          /> 
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {navigation.navigate('ChatRoomVideoCall', {data : data})}}
                            style={{ padding: 10 }}
                        >
                            <Image
                                style={[GlobalStyleSheet.image,{ tintColor: '#fff'}]}
                                source={IMAGES.video}
                            />
                        </TouchableOpacity>
                      </View>
                </View>
            </View>
            <KeyboardAvoidingView
              style={{flex: 1}}
              // behavior={Platform.OS === 'ios' ? 'padding' : ''}
            >
              <View style={{ flex: 1, backgroundColor:theme.dark ? colors.background : '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingHorizontal: 20, paddingTop: 20 }}>
                  <ScrollView 
                    showsVerticalScrollIndicator={false}
                    ref={scrollViewRef}
                    onContentSizeChange={() => {scrollViewRef.current?.scrollToEnd()}}
                >
                    <View style={{ flex: 1 }}>
                        {messageList.map((data,index) => {
                            return (
                                <View key={index}>
                                    <View
                                        style={[{
                                            width: '75%',
                                            marginBottom: 10,
                                        },
                                            data.send == false
                                            ?
                                            {
                                                marginRight: 'auto',
                                                alignItems: 'flex-start',
                                            }  
                                            :
                                            {
                                                marginLeft: 'auto',
                                                alignItems: 'flex-end',
                                            }  
                                        ]}
                                    >
                                        <View style={{flexDirection:'row',alignItems:'flex-start',gap:10}}>
                                            {data.userimage &&
                                                <TouchableOpacity
                                                    activeOpacity={0.6}
                                                    onPress={() => navigation.navigate('AnotherProfile')}
                                                >
                                                    <Image
                                                        style={[{height:35,width:35,borderRadius:25}]}
                                                        source={data.userimage}
                                                    />
                                                    {data.audio &&
                                                        <View 
                                                            style={{
                                                                position:'absolute',
                                                                right:-5,
                                                                bottom:-5,
                                                                height:24,
                                                                width:24,
                                                                borderRadius:50,
                                                                backgroundColor:colors.card,
                                                                alignItems:'center',
                                                                justifyContent:'center'
                                                            }}
                                                        >
                                                            <Image
                                                                style={{height:18,width:18,tintColor:COLORS.success}}
                                                                source={IMAGES.audio}
                                                            />
                                                        </View>
                                                    }
                                                    {data.audio === false &&
                                                        <View 
                                                            style={{
                                                                position:'absolute',
                                                                right:-5,
                                                                bottom:-5,
                                                                height:24,
                                                                width:24,
                                                                borderRadius:50,
                                                                backgroundColor:colors.card,
                                                                alignItems:'center',
                                                                justifyContent:'center'
                                                            }}
                                                        >
                                                            <Image
                                                                style={{height:18,width:18,tintColor:COLORS.danger}}
                                                                source={IMAGES.audiomute}
                                                            />
                                                        </View>
                                                    }
                                                </TouchableOpacity>
                                            }
                                            <View
                                                style={[
                                                    data.send == false
                                                        ?
                                                        {
                                                            backgroundColor: COLORS.background,
                                                            borderTopLeftRadius: 10,
                                                            borderTopRightRadius: 10,
                                                            borderBottomRightRadius: 10,
                                                            
                                                        }
                                                        :
                                                        {
                                                            backgroundColor: COLORS.primary,
                                                            
                                                            borderTopLeftRadius: 10,
                                                            borderTopRightRadius: 10,
                                                            borderBottomLeftRadius: 10,

                                                        }

                                                ]}
                                            >
                                                <Text style={{ ...FONTS.font, ...FONTS.fontRegular, color: data.send ? COLORS.white : COLORS.title, paddingVertical:10,paddingHorizontal:10 }}>{data.title}</Text>
                                            </View>
                                        </View>
                                        {data.time &&
                                            <Text style={{ ...FONTS.fontXs, ...FONTS.fontRegular, color: COLORS.title, opacity: .4,marginTop:3,marginLeft:data.userimage ? 48 : 0 }}>{data.time}</Text>
                                        }
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                  </ScrollView>
              </View>
              <View style={{ backgroundColor:theme.dark ? colors.background : colors.card, paddingHorizontal: 15 }}>
                  <View>
                      <TextInput
                          placeholder='Send your message...'
                          placeholderTextColor={colors.placeholder}
                          style={[
                              GlobalStyleSheet.inputBox, {
                                  backgroundColor: colors.input,
                                  paddingRight:110
                              },
                          ]}
                          value={message}
                          onChangeText={(val) => setMessage(val)}
                      />
                        <TouchableOpacity
                            style={{
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
                                }}
                                source={IMAGES.happy}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={{
                                position: 'absolute',
                                top: 13,
                                right: 80
                            }}
                        >
                            <Image
                                style={{
                                    tintColor: colors.title,
                                    opacity:.5,
                                    width: 20,
                                    height: 20,
                                    resizeMode:'contain'
                                }}
                                source={IMAGES.audio}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={{
                                position: 'absolute',
                                top: 13,
                                right: 50
                            }}
                        >
                            <Image
                                style={{
                                    tintColor: colors.title,
                                    opacity:.5,
                                    width: 20,
                                    height: 20,
                                    resizeMode:'contain'
                                }}
                                source={IMAGES.camera}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={{
                                position: 'absolute',
                                top: 13,
                                right: 15
                            }}
                            onPress={() => sendMessage()}
                            disabled={message.length == 0 ? true : false}
                        >
                            <Image
                                style={{
                                    tintColor: colors.primary,
                                    width: 20,
                                    height: 20,
                                    resizeMode: 'contain'
                                }}
                                source={IMAGES.send}
                            />
                        </TouchableOpacity>
                  </View>
              </View>
            </KeyboardAvoidingView>
            <Chatroomsinfo
                ref={sheetRef}
            />
        </SafeAreaView>
    )
}

export default SingleChatRoom;