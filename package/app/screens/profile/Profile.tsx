import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Share,
  Alert,
  SafeAreaView,
} from 'react-native';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { LinearGradient } from 'expo-linear-gradient';
import Followbtn from '../../components/button/Followbtn';
import Sharebtn from '../../components/button/Sharebtn';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from '@react-navigation/native';
import ProfilePostData from './ProfilePostData';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import axios from 'axios'; // Import axios for API calls
import { Video } from 'expo-av';


type ProfileScreenProps = StackScreenProps<RootStackParamList, 'Profile'>;

const Profile = ({ navigation }: ProfileScreenProps) => {
  const scrollRef = useRef<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [posts, setPosts] = useState([]); // State for posts (type: image)
  const [reels, setReels] = useState([]); // State for reels (type: video)
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const slideIndicator = scrollX.interpolate({
    inputRange: [0, SIZES.width],
    outputRange: [0, (SIZES.width - 30) / 2],
    extrapolate: 'clamp',
  });

  const onPressTouch = (val: any) => {
    setCurrentIndex(val);
    scrollRef.current?.scrollTo({
      x: SIZES.width * val,
      animated: true,
    });
  };

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Share your profile link here.',
      });
      if (result.action === Share.sharedAction) {
        // Shared successfully
      } else if (result.action === Share.dismissedAction) {
        // Share dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  // Fetch feeds from the backend
  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        setLoading(true);
        // Replace with your API base URL and ensure token is included if required
        const response = await axios.get('http://192.168.1.48:5000/api/creator/getall/feeds', {
          headers: {
            Authorization: `Bearer YOUR_AUTH_TOKEN`, // Add your auth token here
          },
        });

        const feeds = response.data.feeds;
        console.log(feeds)
        // Filter feeds for posts (type: image) and reels (type: video)
       const imagePosts = feeds
  .filter((feed: any) => feed.type === 'image')
  .map((feed: any) => ({
    id: feed._id,
    image: { uri: feed.contentUrl }, // ✅ use contentUrl
    like: (feed.like ?? 0).toString(),
  }));

const videoReels = feeds
  .filter((feed: any) => feed.type === 'video')
  .map((feed: any) => ({
    id: feed._id,
    video: feed.contentUrl, // ✅ store as video, not image
    like: (feed.like ?? 0).toString(),
  }));



        setPosts(imagePosts);
        setReels(videoReels);
        setLoading(false);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch feeds');
        setLoading(false);
        Alert.alert('Error', error.message || 'Failed to fetch feeds');
      }
    };

    fetchFeeds();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ ...FONTS.font, color: colors.title }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ ...FONTS.font, color: colors.title }}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[GlobalStyleSheet.container, { padding: 0, backgroundColor: theme.dark ? colors.background : colors.card, flex: 1 }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          style={{ width: '100%', height: 360, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, overflow: 'hidden' }}
          source={IMAGES.profilebackground}
        >
          <View style={GlobalStyleSheet.container}>
            <View style={[GlobalStyleSheet.flexalingjust, { marginTop: 10 }]}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image style={{ width: 18, height: 18, tintColor: '#fff' }} source={IMAGES.arrowleft} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <View style={GlobalStyleSheet.background}>
                  <Image style={[GlobalStyleSheet.image, { tintColor: COLORS.white }]} source={IMAGES.setting} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View>
              <TouchableOpacity>
                <View
                  style={{
                    backgroundColor: 'rgba(217, 217, 217, .6)',
                    height: 110,
                    width: 110,
                    borderRadius: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image style={{ width: 100, height: 100, borderRadius: 100 }} source={IMAGES.profile} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={{ position: 'absolute', bottom: 0, right: 0 }}>
                <View
                  style={{
                    backgroundColor: '#001F50',
                    width: 36,
                    height: 36,
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: '#2979F8',
                      width: 30,
                      height: 30,
                      borderRadius: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image style={{ width: 18, height: 18, resizeMode: 'contain' }} source={IMAGES.edit2} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 20, alignItems: 'center' }}>
              <Text style={{ ...FONTS.h6, ...FONTS.fontMedium, color: COLORS.white }}>Alex Techie</Text>
              <Text style={{ ...FONTS.font, ...FONTS.fontRegular, color: COLORS.white, opacity: 0.6, marginTop: 5 }}>
                alex_techie_2123
              </Text>
            </View>
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, .1)',
                height: 70,
                width: 300,
                borderRadius: 12,
                marginTop: 20,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}
            >
              <View style={{ alignItems: 'center', width: '33.33%' }}>
                <Text style={GlobalStyleSheet.textfont2}>{posts.length}</Text>
                <Text style={GlobalStyleSheet.titlefont}>Post</Text>
              </View>
              <View style={{ width: '33.33%' }}>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('Followers')}>
                  <Text style={GlobalStyleSheet.textfont2}>1250</Text>
                  <Text style={GlobalStyleSheet.titlefont}>Followers</Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: '33.33%' }}>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('Followers')}>
                  <Text style={GlobalStyleSheet.textfont2}>500</Text>
                  <Text style={GlobalStyleSheet.titlefont}>Following</Text>
                </TouchableOpacity>
              </View>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.00) ', 'rgba(255, 255, 255, 0.20)', 'rgba(255, 255, 255, 0.00) ']}
                style={{ width: 2, height: 50, position: 'absolute', right: 100 }}
              />
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.00) ', 'rgba(255, 255, 255, 0.20)', 'rgba(255, 255, 255, 0.00) ']}
                style={{ width: 2, height: 50, position: 'absolute', left: 100 }}
              />
            </View>
          </View>
        </ImageBackground>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 20 }}>
          <Followbtn onPress={() => navigation.navigate('Suggestions')} title="Suggestions" />
          <Sharebtn onPress={onShare} title="Share Profile" />
        </View>
        <View style={{ marginHorizontal: 15 }}>
          <View
            style={[
              GlobalStyleSheet.container,
              {
                backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : '#EFF3FA',
                padding: 10,
                marginHorizontal: 20,
                borderRadius: 6,
                marginTop: 20,
              },
            ]}
          >
            <Text style={{ ...FONTS.fontXs, lineHeight: 18, color: colors.title }}>
              Music Lover 🎵 {'\n'}Wish me 09 September 🍰 {'\n'}Fashion, LifeStyle, Video Creator
            </Text>
          </View>
        </View>
        <View style={GlobalStyleSheet.container}>
          <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 0 }}>
            <TouchableOpacity onPress={() => onPressTouch(0)} style={GlobalStyleSheet.TouchableOpacity2}>
              <Image
                style={[{ width: 16, height: 16, tintColor: '#475A77' }, currentIndex === 0 && { tintColor: COLORS.primary }]}
                source={IMAGES.profilepic}
              />
              <Text
                style={[{ ...FONTS.fontMedium, fontSize: 14, color: '#475A77', marginLeft: 5 }, currentIndex === 0 && { color: COLORS.primary }]}
              >
                Post
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPressTouch(1)} style={GlobalStyleSheet.TouchableOpacity2}>
              <Image
                style={[{ width: 16, height: 16, tintColor: '#475A77' }, currentIndex === 1 && { tintColor: COLORS.primary }]}
                source={IMAGES.reels}
              />
              <Text
                style={[{ ...FONTS.fontMedium, fontSize: 14, color: '#475A77', marginLeft: 5 }, currentIndex === 1 && { color: COLORS.primary }]}
              >
                Reels
              </Text>
            </TouchableOpacity>
            <Animated.View
              style={{
                backgroundColor: COLORS.primary,
                width: '50%',
                height: 2,
                position: 'absolute',
                bottom: 0,
                left: 0,
                transform: [{ translateX: slideIndicator }],
              }}
            />
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEventThrottle={16}
          ref={scrollRef}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
          onMomentumScrollEnd={(e: any) => {
            if (e.nativeEvent.contentOffset.x.toFixed(0) == SIZES.width.toFixed(0)) {
              setCurrentIndex(1);
            } else if (e.nativeEvent.contentOffset.x.toFixed(0) == 0) {
              setCurrentIndex(0);
            } else {
              setCurrentIndex(0);
            }
          }}
        >
          <View style={[GlobalStyleSheet.container, { marginTop: 5, width: SIZES.width, padding: 0 }]}>
            <ProfilePostData navigation={navigation} ProfilepicData={posts} />
          </View>
          <View style={[GlobalStyleSheet.container, { marginTop: 5, width: SIZES.width, padding: 0 }]}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {reels.map((data: any, index: number) => (
  <View key={index} style={{ width: '33.33%', padding: 2 }}>
    <TouchableOpacity onPress={() => navigation.navigate('ProfileReels', { videoUrl: data.video })}>
      <Video
        source={{ uri: data.video }}
        style={{ width: '100%', aspectRatio: 1 / 1.8 }}
        resizeMode="cover"
        shouldPlay={false} // autoplay off in grid
        isMuted
      />
      <View
        style={{
          flexDirection: 'row',
          gap: 5,
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.20)',
          position: 'absolute',
          borderRadius: 15,
          paddingHorizontal: 10,
          paddingVertical: 3,
          top: 10,
          right: 10,
        }}
      >
        <Image
          style={{ width: 12, height: 12, resizeMode: 'contain', tintColor: '#fff' }}
          source={IMAGES.eyeopen}
        />
        <Text style={{ ...FONTS.fontRegular, fontSize: 10, color: COLORS.white, lineHeight: 14 }}>
          {data.like}
        </Text>
      </View>
    </TouchableOpacity>
  </View>
))}

            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;