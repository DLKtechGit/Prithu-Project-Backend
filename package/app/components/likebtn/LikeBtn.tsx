import React from 'react';
import { Pressable, StyleSheet,Image } from 'react-native';
import { IMAGES } from '../../constants/theme';
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';


const LikeBtn = ({ color, sizes } : any) => {

    const liked = useSharedValue(0);
    const outlineStyle = useAnimatedStyle(() => {
        return {
          transform: [
            {
              scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.CLAMP),
            },
          ],
        };
    });
    const fillStyle = useAnimatedStyle(() => {
        return {
            transform: [
            {
                scale: liked.value,
            },
            ],
        };
    });

    const handleLike = () => {
        liked.value = withSpring(liked.value ? 0 : 1)
    }

    return (
        <Pressable
            accessible={true}
            accessibilityLabel="Like Btn"
            accessibilityHint="Like this item"
            onPress={() => {handleLike()}}
            style={[{
                alignItems: 'center',
                justifyContent: 'center',
            },
            sizes == 'sm'
                ?
                {
                    height: 25,
                    width: 25
                }
                :
            sizes == 'xm'
                ?
                {
                    height:20,
                    width: 20
                }
                : 
            sizes == 'xs'
                ?
                {
                    height: 15,
                    width: 15
                }
                : 
                {
                    height: 50,
                    width: 50,
                }
            ]}    
        >
            <Animated.View style={[StyleSheet.absoluteFillObject,outlineStyle,{alignItems:'center',justifyContent:'center'}]}>
                <Image
                    style={[{
                        tintColor: color ? color : '#ffff',
                        resizeMode: 'contain',
                    },
                        sizes == 'sm'
                            ?
                            {
                                height: 22,
                                width: 22
                            }
                            :
                        sizes == 'xm'
                            ?
                            {
                                height: 20,
                                width: 20
                            }
                            :
                        sizes == 'xs'
                            ?
                            {
                                height: 15,
                                width: 15
                            }
                            : 
                            {
                                height: 25,
                                width: 25,
                            }
                    ]}
                    source={IMAGES.like2}
                />
            </Animated.View>

            <Animated.View style={fillStyle}>
                 <Image
                    style={[{
                        resizeMode: 'contain',
                    },
                    sizes == 'sm'
                        ?
                        {
                            height: 22,
                            width: 22
                        }
                        :
                    sizes == 'xm'
                        ?
                        {
                            height: 20,
                            width: 20
                        }
                        : 
                    sizes == 'xs'
                        ?
                        {
                            height: 15,
                            width: 15
                        }
                        : 
                        {
                            height: 25,
                            width: 25,
                        }
                    ]}
                    source={IMAGES.like}
                />
            </Animated.View>
        </Pressable>
    );
};


export default LikeBtn;