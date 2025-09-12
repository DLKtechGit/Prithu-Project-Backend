import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions,
    ScrollView,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import LikeBtn from '../../components/likebtn/LikeBtn';
import { useTheme } from '@react-navigation/native';
import PostoptionSheet from '../../components/bottomsheet/PostoptionSheet';
import { GlobalStyleSheet } from '../../constants/styleSheet';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;


const Status = ({route, navigation } : any)  => {

    const { name, image, statusData } = route.params;

    const moresheet = useRef<any>();

    const [current, setCurrent] = useState({ data: statusData[0], index: 0 });

    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (current.index === statusData.length - 1) {
                return navigation.goBack();
            }
            setCurrent({
                ...current,
                index: current.index + 1,
                data: statusData[current.index + 1]
            });
        }, 3000);
        return () => clearTimeout(timer);
    }, [current]);


    
    const ProgressView = (props : any) => {
        
        const progressAnim = useRef(new Animated.Value(0)).current

        useEffect(() => {
            Animated.timing(
                progressAnim,
                {
                    toValue: (width - 40) / statusData.length,
                    duration: 3000,
                    useNativeDriver: false
                }
            ).start();

        }, [progressAnim]);

        return (
            <Animated.Text style={{ backgroundColor: '#fff', width: progressAnim }}>
            </Animated.Text>
        )
    }

    const handlePressIn = () => {
        console.log('erawr');
    }
    
    const handlePressOut = () => {
        console.log('0000');
    }

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    return (
        <SafeAreaView style={[GlobalStyleSheet.container,{padding:0, flex: 1, backgroundColor:'#000' }]}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={'#000'}
            />
            <KeyboardAvoidingView
                style={{flex: 1}}
                //behavior={Platform.OS === 'ios' ? 'padding' : ''}
            >
                <ScrollView
                    //flexglow={1}
                    contentContainerStyle={{flexGrow:1}}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={styles.statusTabContainer}>
                        {statusData.map((item:any, index:any) => (
                            <View
                                key={index}
                                style={[
                                    styles.statusTab,
                                    {
                                        marginHorizontal: 2,
                                        backgroundColor: 'rgba(255,255,255,.2)',
                                    },
                                ]}
                            >
                                {current.index === index ? <ProgressView /> : null}
                            </View>
                        ))}
                    </View>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 }}
                    >
                        <Image
                            style={{
                                height: 40,
                                width: 40,
                                borderRadius: 20,
                                marginRight: 10,
                            }}
                            source={image}
                        />

                        <Text style={{ ...FONTS.font, color: COLORS.white, flex: 1 }}>{name}</Text>
                        <TouchableOpacity
                            onPress={() => moresheet.current.openSheet()}
                            style={{
                                height: 50,
                                width: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                                //position: 'relative',
                                zIndex: 999,
                                //backgroundColor:'red',

                            }}
                        >
                            <Image
                                style={{ tintColor: '#fff', height: 20, width: 20 }}
                                source={IMAGES.more}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{
                                height: 50,
                                width: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                                //zIndex: 999,
                            }}
                        >
                            <Image
                                style={{ tintColor: '#fff', height: 20, width: 20 }}
                                source={IMAGES.close2}
                            />
                        </TouchableOpacity>
                    </View>


                    <View style={styles.imageContainer}>
                        <Image
                            source={current.data}
                            resizeMode="contain"
                            style={styles.imageStyle}
                        />
                    </View>

                    <Pressable
                        onLongPress={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={() => {
                            if (current.index === 0) {
                                return navigation.goBack()
                            }
                            setCurrent({
                                ...current,
                                index: current.index - 1,
                                data: statusData[current.index - 1],
                            });
                        }}
                        style={[styles.controller]}>
                    </Pressable>
                    <TouchableOpacity
                        onPress={() => {
                            if (current.index === statusData.length - 1) {
                                return navigation.goBack()
                            }
                            setCurrent({
                                ...current,
                                index: current.index + 1,
                                data: statusData[current.index + 1],
                            });
                        }}
                        style={[styles.controller, { right: 0 }]}>
                    </TouchableOpacity>
                    
                    <View style={{ flexDirection: 'row', padding: 15, alignItems: 'center', position: 'absolute', bottom: 0, backgroundColor: '#000' }}>
                        <TextInput
                            style={{
                                ...FONTS.font,
                                color: COLORS.white,
                                height: 45,
                                borderWidth: 1,
                                flex: 1,
                                borderRadius: 25,
                                borderColor: 'rgba(255,255,255,.6)',
                                paddingHorizontal: 15,
                                paddingLeft: 20,
                                marginRight: 10,
                                alignItems: 'center'
                            }}
                            placeholder='Send message'
                            placeholderTextColor={COLORS.white}
                        />

                        <LikeBtn/>

                        <TouchableOpacity
                            style={{
                                height: 50,
                                width: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Image
                                style={{ width: 25, height: 25, tintColor: '#fff', resizeMode: 'contain' }}
                                source={IMAGES.send}
                            />
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <PostoptionSheet
                ref={moresheet}
                hidePost={false}
            />
        </SafeAreaView>
    );
};



const styles = StyleSheet.create({

    statusTabContainer: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 12,
        paddingBottom: 10,
        paddingTop: 10,
    },
    statusTab: {
        height: 2,
        // backgroundColor: '#fff',
        backgroundColor: 'rgba(255,255,255,.2)',
        flex: 1
    },
    controller: {
        position: 'absolute',
        width: width / 2,
        height: height * 0.85,
        bottom: 0
    },
    imageContainer: {
        flex: 1,
        //paddingBottom: 80,
        justifyContent: 'center',
        minHeight: 600,
    },
    imageStyle: {
        width: '100%',
        height: height / 1.2,
        maxHeight: height / 1.2,
    }
});


export default Status;