import { useEffect, useRef, useState } from 'react';
import { Image, Platform, TouchableOpacity, View, Animated, Text, Dimensions } from 'react-native';
import { COLORS,  SIZES, FONTS, IMAGES } from '../constants/theme';
import { useTheme } from '@react-navigation/native';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import { GlobalStyleSheet } from '../constants/styleSheet';

type Props = {
    state : any,
    navigation : any,
    descriptors : any
}

const BottomTab = ({ state, descriptors, navigation } : Props) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const [tabWidth, setWidth] = useState(wp('100%'));

    const tabWD =
        tabWidth < SIZES.container ? tabWidth / 5 : SIZES.container / 5;

    const circlePosition = useRef(
        new Animated.Value(0),
    ).current;

    Dimensions.addEventListener('change', val => {
        setWidth(val.window.width);
    });
    
    useEffect(() => {
        Animated.spring(circlePosition, {
            toValue: state.index * tabWD,
            useNativeDriver: true,
        }).start();
    },[state.index,tabWidth])


    const onTabPress = (index: number) => {
        const tabW =
            tabWidth < SIZES.container ? tabWidth / 5 : SIZES.container / 5; // Adjust this according to your tab width

        Animated.spring(circlePosition, {
            toValue: index * tabW,
            useNativeDriver: true,
        }).start();
    };


    return (
        <View
            style={[{
                backgroundColor: colors.card,
                shadowColor: 'rgba(0, 0, 0, 0.60)',
                shadowOffset: {
                    width: 0,
                    height: 0,
                },
                shadowOpacity: .1,
                shadowRadius: 5,
                //position: 'absolute',
                left: 0,
                bottom: 0,
                right: 0,
            }, Platform.OS === 'ios' && {
                backgroundColor: colors.card,
            }]}
        >
            <View
                style={[{
                    height: 60,
                    backgroundColor:theme.dark ? colors.background : colors.card,
                    paddingTop:5
                },Platform.OS === 'web' && {paddingTop:10}]}>
                <View style={[GlobalStyleSheet.container,{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                }]}>
                    <Animated.View
                        style={{
                            position: 'absolute',
                            height: '100%',
                            width: tabWidth < SIZES.container ? tabWidth / 5 : SIZES.container / 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: [{ translateX: circlePosition }],
                        }}
                    >
                        <View
                            style={{
                                height: 40,
                                width: 40,
                                borderRadius: 38,
                                backgroundColor: COLORS.primary,
                                opacity:.15,
                                marginTop: 5,
                            }}
                        />
                    </Animated.View>
                    {state.routes.map((route:any, index:any) => {
                        const { options } = descriptors[route.key];
                        const label =
                            options.tabBarLabel !== undefined
                                ? options.tabBarLabel
                                : options.title !== undefined
                                    ? options.title
                                    : route.name;

                        const isFocused = state.index === index;


                        const iconTranslateY = useRef(new Animated.Value(0)).current;
                        Animated.timing(iconTranslateY, {
                            toValue: isFocused ? -18 : 0,
                            duration: 200,
                            useNativeDriver: true,
                        }).start();

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate({ name: route.name, merge: true });
                                onTabPress(index);
                            }
                        };


                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={.8}
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarTestID}
                                onPress={onPress}
                                style={{ flex: 1, alignItems: 'center', height: '100%', justifyContent: 'center', marginTop: 5 }}
                            >
                                <Image

                                    // style={{ width: 21, height: 21, tintColor: isFocused ?  COLORS.title : colors.title, resizeMode: 'contain' }}
                                    
                                    style={label == 'Profile' ? { width: 34, height: 34, borderRadius: 50 } : { width: 20, height: 20, opacity: isFocused ? 1 : .4, tintColor: isFocused ? COLORS.primary : colors.text }}

                                    source={
                                        label == 'Home' ? IMAGES.home :
                                        label == 'Search' ? IMAGES.search :
                                        label == 'Reels' ? IMAGES.reels :
                                        label == 'Chat' ? IMAGES.chat :
                                        label == 'Profile' ? IMAGES.profile : IMAGES.eyeclose
                                    }
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

export default BottomTab;