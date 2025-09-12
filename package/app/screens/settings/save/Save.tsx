import React, { useRef, useState } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlobalStyleSheet } from '../../../constants/styleSheet';
import { ScrollView } from 'react-native-gesture-handler';
import { IMAGES,COLORS,FONTS,SIZES } from '../../../constants/theme';
import Header from '../../../layout/Header';
import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../Navigations/RootStackParamList';

const ProfilepicData = [
    {
        id: '1',
        image: IMAGES.profilepic2,
        like: '164',
    },
    {
        id: '2',
        image: IMAGES.profilepic15,
        like: '132',
    },
    {
        id: '3',
        image: IMAGES.profilepic16,
        like: '30',
    },
    {
        id: '4',
        image: IMAGES.profilepic17,
        like: '154',
    },
    {
        id: '5',
        image: IMAGES.profilepic18,
        like: '100',
    },
    {
        id: '6',
        image: IMAGES.profilepic4,
        like: '1K',
    },
    {
        id: '7',
        image: IMAGES.profilepic10,
        like: '164',
    },
    {
        id: '8',
        image: IMAGES.profilepic11,
        like: '132',
    },
    {
        id: '9',
        image: IMAGES.profilepic12,
        like: '30',
    },
    {
        id: '10',
        image: IMAGES.profilepic13,
        like: '154',
    },
    {
        id: '11',
        image: IMAGES.profilepic14,
        like: '100',
    },
    {
        id: '12',
        image: IMAGES.profilepic1,
        like: '1K',
    }
]

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

type SaveScreenProps = StackScreenProps<RootStackParamList, 'Save'>;

const Save = ({ navigation } : SaveScreenProps) => {

    const scrollRef = useRef<any>();
    const [currentIndex, setCurrentIndex] = useState<any>(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const slideIndicator = scrollX.interpolate({
        inputRange: [0, SIZES.width],
        outputRange: [0, (SIZES.width - 30) / 2],
        extrapolate: 'clamp',
    });

    const onPressTouch = (val:any) => {
        setCurrentIndex(val)
        scrollRef.current?.scrollTo({
            x: SIZES.width * val,
            animated: true,
        });
    }

    const theme = useTheme();
    const { colors } : {colors : any} = theme;


  return (
    <SafeAreaView style={[GlobalStyleSheet.container,{padding:0, backgroundColor: colors.card, flex:1}]}>
          <Header
            title='All Posts'
          />
          <View style={{ backgroundColor: colors.card, flex: 1 }}>
              <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={GlobalStyleSheet.container}>
                      <View style={{ flexDirection: 'row', marginTop:0, marginBottom: 0, }}>
                          <TouchableOpacity
                              onPress={() => onPressTouch(0)}
                              style={GlobalStyleSheet.TouchableOpacity2}>
                              <Image
                                  style={[{ width: 16, height: 16, tintColor: '#475A77' }, currentIndex == 0 && { tintColor: COLORS.primary }]}
                                  source={IMAGES.profilepic}
                              />
                              <Text style={[{ ...FONTS.fontMedium, fontSize: 14, color: '#475A77', marginLeft: 5 }, currentIndex == 0 && { color: COLORS.primary }]}>Post</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                              onPress={() => onPressTouch(1)}
                              style={GlobalStyleSheet.TouchableOpacity2}>
                              <Image
                                  style={[{ width: 16, height: 16, tintColor: '#475A77' }, currentIndex == 1 && { tintColor: COLORS.primary }]}
                                  source={IMAGES.reels}
                              />
                              <Text style={[{ ...FONTS.fontMedium, fontSize: 14, color: '#475A77', marginLeft: 5 }, currentIndex == 1 && { color: COLORS.primary }]}>Reels</Text>
                          </TouchableOpacity>
                          <Animated.View
                              style={{
                                  backgroundColor: COLORS.primary,
                                  width: '50%',
                                  height: 2,
                                  position: 'absolute',
                                  bottom: 0,
                                  left: 0,
                                  transform: [{ translateX: slideIndicator }]
                              }}>
                          </Animated.View>
                      </View>
                  </View>

                  <ScrollView
                      horizontal
                      scrollEventThrottle={16}
                      showsHorizontalScrollIndicator={false}
                      pagingEnabled
                      ref={scrollRef}
                      onScroll={Animated.event(
                          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                          { useNativeDriver: false }
                      )}
                      onMomentumScrollEnd={(e : any) => {
                          if (e.nativeEvent.contentOffset.x.toFixed(0) == SIZES.width.toFixed(0)) {
                              setCurrentIndex(1)
                          } else if (e.nativeEvent.contentOffset.x.toFixed(0) == 0) {
                              setCurrentIndex(0)
                          } else {
                              setCurrentIndex(0)
                          }
                      }}
                  >
                      <View style={[GlobalStyleSheet.container,{marginTop: 5, width: SIZES.width,padding:0}]}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                          {ProfilepicData.map((data:any, index) => {
                              return (
                                  <View
                                      key={index}
                                      style={[{ width: '33.33%' }]}
                                  >
                                      <TouchableOpacity style={{ padding: 2 }}
                                          onPress={() => navigation.navigate('Savepost')}
                                      >
                                          <Image
                                              style={{ width: '100%', height: null, aspectRatio: 1 / 1 }}
                                              source={data.image}
                                          />
                                          <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.20)', position: 'absolute', borderRadius: 15, paddingHorizontal: 10, paddingVertical: 3, bottom: 10, left: 10 }}>
                                              <Image
                                                  style={{ width: 10, height: 10, resizeMode: 'contain', tintColor: '#fff' }}
                                                  source={IMAGES.like}
                                              />
                                              <Text style={{ ...FONTS.fontRegular, fontSize: 10, color: COLORS.white, lineHeight: 14 }}>{data.like}</Text>
                                          </View>
                                      </TouchableOpacity>
                                  </View>
                              )
                          })}
                        </View>
                      </View>
                      <View style={[GlobalStyleSheet.container,{marginTop: 5, width: SIZES.width,padding:0}]}>
                          <View style={{flexDirection: 'row', flexWrap: 'wrap' }}>
                            {ReelsData.map((data, index) => {
                                return (
                                    <View key={index} style={{ width: '33.33%', padding: 2 }}>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('SaveReels')}
                                        >
                                            <Image
                                                style={{ width: '100%', height: null, aspectRatio: 1 / 1.9, }}
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
                      </View>
                  </ScrollView>
              </ScrollView>
          </View>

    </SafeAreaView>
  )
}

export default Save;