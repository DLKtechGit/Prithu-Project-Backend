import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { TextInput } from 'react-native-gesture-handler';
import Collapsible from 'react-native-collapsible';
import LikeBtn from '../../components/likebtn/LikeBtn';
import { useNavigation } from '@react-navigation/native';
import ChatoptionSheet from '../../components/bottomsheet/ChatoptionSheet';

const Comment = [
    {
        id: '1',
        title: 'alex techie',
        image: IMAGES.storypic1,
        time: "20min",
        comment: "Her daughter is so smart!",
        like: "20",
        commentNumber: "2",
        hasStory: false,
        replies: [
            {
                id: '1',
                title: 'Herry Malik',
                image: IMAGES.profilepic10,
                time: "10min",
                comment: "very Nice",
                like: "20",
                commentNumber: "5",
                hasStory: false,
              
            },
            {
                id: '2',
                title: 'david maoven',
                image: IMAGES.profilepic11,
                time: "5min",
                comment: "Very Very good ",
                like: "20",
                commentNumber: "2",
                hasStory: true, 
            },
        ]
    },
    {
        id: '2',
        title: 'lily learns',
        image: IMAGES.storypic2,
        time: "40min",
        comment: "Yes, Awesome",
        like: "2",
        commentNumber: "5",
        hasStory: false,
        replies: [
            {
                id: '1',
                title: 'aamir james',
                image: IMAGES.profilepic12,
                time: "20min",
                comment: "Nice",
                like: "20",
                commentNumber: "2",
                hasStory: true,

            },
            {
                id: '2',
                title: 'alex techie',
                image: IMAGES.profilepic13,
                time: "20min",
                comment: "😍❤😘",
                like: "20",
                commentNumber: "5",
                hasStory: false,

            },
        ]
        
    },
    {
        id: '3',
        title: 'mia maven',
        image: IMAGES.storypic3,
        time: "15min",
        comment: "Super",
        like: "10",
        commentNumber: "10",
        hasStory: true,
       
    },
    {
        id: '4',
        title: 'sophia james',
        image: IMAGES.storypic4,
        time: "19min",
        comment: "Very Nice",
        like: "38",
        commentNumber: "6",
        hasStory: true,
    },
    {
        id: '5',
        title: 'deepesh gaur',
        image: IMAGES.profile2,
        time: "5min",
        comment: "Very Very Nice",
        like: "80",
        commentNumber: "6",
        hasStory: false,
       
    },
    {
        id: '6',
        title: 'herry moven',
        image: IMAGES.storypic1,
        time: "13min",
        comment: "Good",
        like: "20",
        commentNumber: "10",
        hasStory: true,
      
    },
    {
        id: '7',
        title: 'aamir james',
        image: IMAGES.storypic2,
        time: "25min",
        comment: "Awesome",
        like: "29",
        commentNumber: "1",
        hasStory: false,
        
    },
    {
        id: '8',
        title: 'david maoven',
        image: IMAGES.storypic3,
        time: "7min",
        comment: "Bad",
        like: "10",
        commentNumber: "5",
        hasStory: true,
        
    },

];


const Item = ({ title, image, time, comment, like, commentNumber, replies, moresheet, hasStory, navigation } : any) => {

    const [show, setshow] = useState(true);

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    return (
    
        <View
            style={[GlobalStyleSheet.container,{marginTop:0,paddingTop:0}]}
        >
            <View style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{marginTop:10}}>
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
                        >
                            {
                                hasStory == false ?
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            style={{ width: 42, height: 42, borderRadius: 50 }}
                                            source={image}
                                        />
                                        <Image
                                            style={{ width: 50, height: 50, position: 'absolute',resizeMode:'contain' }}
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
                            
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginLeft: 10, flex: 1 }}>
                        <View style={[GlobalStyleSheet.flexaling,{gap: 10 }]}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('AnotherProfile')}
                            >
                                <Text style={[GlobalStyleSheet.textfont,{ marginBottom: 5,color:colors.title }]}>{title}</Text>
                            </TouchableOpacity>
                            <View style={{ width: 6, height: 6, borderRadius: 100, backgroundColor: colors.placeholder, opacity: .5 }} />
                            <Text style={{ ...FONTS.fontSm, ...FONTS.fontMedium, color: colors.text, opacity: .5 }}>{time}</Text>
                        </View>
                        <View>
                            <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color: colors.title, marginBottom: 10 }}>{comment}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                            <TouchableOpacity>
                                <LikeBtn
                                    color={colors.title}
                                    sizes={'xm'}
                                />
                            </TouchableOpacity>
                            <Text style={[GlobalStyleSheet.textfont,{color:colors.title}]}>{like}</Text>
                           
                            {replies && replies.length > 0 &&
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        style={[GlobalStyleSheet.image2,{tintColor:colors.title}]}
                                        source={IMAGES.comment}
                                    />

                                    <Text style={[GlobalStyleSheet.textfont,{ marginLeft: 8,color:colors.title }]}>{commentNumber}</Text>
                                </View>
                            }
                            <TouchableOpacity>
                                <Text style={[GlobalStyleSheet.textfont, { color: colors.title, opacity: .4 }]}>Replay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity
                             onPress={() => moresheet.current.openSheet()}
                        >
                            <Image
                                style={{ width: 15, height: 15, resizeMode: 'contain', marginTop: 15,tintColor:colors.title }}
                                source={IMAGES.more}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                {replies && replies.length > 0 &&
                    <View
                        style={{
                            marginLeft: 46
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setshow(!show)
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                <Text style={[GlobalStyleSheet.textfont, {color:colors.text}]}>See Replay</Text>
                                {/* <Text style={[GlobalStyleSheet.textfont, { color: COLORS.text }]}>({counter})</Text> */}
                                <Image
                                    style={{ width: 15, height: 15, tintColor: colors.text, transform: [{ rotate: show == true ? '0deg':'-180deg' }], }}
                                    source={IMAGES.downarrow}
                                />
                            </View>
                        </TouchableOpacity>

                        <Collapsible collapsed={show}>
                            <View style={{ marginTop: 10,paddingLeft:10 }}>
                                {replies.map((data:any, index:any) => (
                                    <View style={{ flexDirection: 'row', marginBottom: 10 }} key={index}>
                                        <View>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    data.hasStory == false ?
                                                        navigation.navigate('status', {
                                                            name: title,
                                                            image: image,
                                                            statusData: [IMAGES.profilepic11, IMAGES.profilepic12]
                                                        })
                                                        :
                                                        navigation.navigate('AnotherProfile')
                                                }}
                                            >
                                                {
                                                    data.hasStory == false ?
                                                        <View>
                                                            <Image
                                                                style={{ width: 40, height: 40, borderRadius: 50 }}
                                                                source={data.image}
                                                            />
                                                            <Image
                                                                style={{ width: 48, height: 48, position: 'absolute', bottom: -4, right:-4,resizeMode:'contain' }}
                                                                source={IMAGES.cricle}
                                                            />
                                                        </View>
                                                        :
                                                        <View>
                                                            <Image
                                                                style={{ width: 40, height: 40, borderRadius: 50 }}
                                                                source={data.image}
                                                            />
                                                        </View>
                                                }

                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginLeft: 10, flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                <TouchableOpacity
                                                    onPress={() => navigation.navigate('AnotherProfile')}
                                                >
                                                    <Text style={[GlobalStyleSheet.textfont,{ marginBottom: 5,color:colors.title }]}>{data.title}</Text>
                                                </TouchableOpacity>
                                                <View style={{ width: 6, height: 6, borderRadius: 100, backgroundColor: colors.placeholder, opacity: .5 }} />
                                                <Text style={{ ...FONTS.fontSm, ...FONTS.fontMedium, color: colors.text, opacity: .5 }}>{data.time}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color: colors.title, marginBottom: 10 }}>{data.comment}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                                <TouchableOpacity>
                                                    <LikeBtn
                                                        color={colors.title}
                                                        sizes={'xs'}
                                                    />
                                                </TouchableOpacity>
                                               
                                                <Text style={[GlobalStyleSheet.textfont,{fontSize:12,color:colors.title}]}>{data.like}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <TouchableOpacity
                                               onPress={() => moresheet.current.openSheet()}
                                            >
                                                <Image
                                                    style={{ width: 15, height: 15, resizeMode: 'contain', marginTop: 15 }}
                                                    source={IMAGES.more}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </Collapsible>
                    </View>
                }
            </View>
        </View>
    )
};

const Comments = () => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const moresheet = useRef<any>();

    const navigation = useNavigation<any>();

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.card,
            }}
        >
            
            <View style={GlobalStyleSheet.container}>
                <View style={{ height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                        >
                            <Image
                                style={{ width: 18, height: 18,tintColor:colors.title }}
                                source={IMAGES.arrowleft}
                            />
                        </TouchableOpacity>
                        <View>
                            <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title, marginLeft: 20 }}>Comments</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title }}>365</Text>
                    </View>
                </View>
                <View style={{ marginBottom: 10 }}>
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
                            }}
                            source={IMAGES.happy}
                        />
                    </TouchableOpacity>
                    <TextInput
                        placeholder='Send your comment...'
                        placeholderTextColor={colors.placeholder}
                        style={[
                            GlobalStyleSheet.inputBox, {
                                backgroundColor: colors.input,
                            },
                        ]}
                    />
                    <TouchableOpacity
                        style={{
                            zIndex: 1,
                            position: 'absolute',
                            top: 13,
                            right: 15
                        }}
                    >
                        <Image
                            style={{
                                tintColor: colors.primary,
                                width: 20,
                                height: 20,
                            }}
                            source={IMAGES.send}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <KeyboardAvoidingView
                style={{flex: 1}}
                //behavior={Platform.OS === 'ios' ? 'padding' : ''}
            >
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={Comment}
                    renderItem={({ item }) => <Item
                        title={item.title}
                        image={item.image}
                        id={item.id}
                        time={item.time}
                        comment={item.comment}
                        like={item.like}
                        commentNumber={item.commentNumber}
                        //counter={item.counter}
                        replies={item.replies}
                        moresheet={moresheet}
                        hasStory={item.hasStory}
                        navigation={navigation}
                        theme={theme}
                    />
                    }
                    keyExtractor={item => item.id}
                />
                
            </KeyboardAvoidingView>
            <ChatoptionSheet
                    ref={moresheet}
                    deleteChat={false}
                />
        </SafeAreaView>
        
    )
}

export default Comments;