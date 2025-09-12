import React, { useState } from 'react';
import { View, Text, SafeAreaView, Image, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { IMAGES, SIZES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { ScrollView } from 'react-native-gesture-handler';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NextpageScreenProps = StackScreenProps<RootStackParamList, 'Nextpage'>;

const Nextpage = ({ route, navigation }: NextpageScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const { mediaUrl, mediaType } = route.params || {}; // Get mediaUrl and mediaType from navigation params
  

  const [caption, setCaption] = useState('');

  const handlePost = async () => {
    if (!mediaUrl) {
      Alert.alert('Error', 'No media selected');
      return;
    }

    try {

      const userId = await AsyncStorage.getItem('userId');
            if (!userId) return;
      const formData = new FormData();
      formData.append('file', {
        uri: mediaUrl,
        name: mediaType === 'video' ? 'upload.mp4' : 'upload.jpg',
        type: mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
      } as any);

      formData.append('language', 'English');
      formData.append('category', 'General');
      formData.append('tags', JSON.stringify(['tag1', 'tag2']));
      formData.append('type', mediaType);
      formData.append('caption', caption);

      const res = await axios.post(`http://192.168.1.48:5000/api/creator/feed/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 201) {
        Alert.alert('Success', 'Post uploaded successfully');
        navigation.navigate('DrawerNavigation', { screen: 'Home' });
      }
    } catch (error: any) {
      console.error('Upload error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
      <Header title="New Post" post={true} onPress={handlePost} />
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flex: 1 }}>
          <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
            <View style={{ paddingVertical: 30, backgroundColor: 'rgba(71,90,119,.25)' }}>
              {mediaUrl && mediaType === 'image' ? (
                <Image
                  style={{
                    height:
                      SIZES.width < SIZES.container
                        ? SIZES.width - SIZES.width * 0.2
                        : SIZES.container - SIZES.container * 0.2,
                    width: '100%',
                    resizeMode: 'contain',
                  }}
                  source={{ uri: mediaUrl }}
                />
              ) : mediaUrl && mediaType === 'video' ? (
                <Video
                  source={{ uri: mediaUrl }}
                  style={{
                    height:
                      SIZES.width < SIZES.container
                        ? SIZES.width - SIZES.width * 0.2
                        : SIZES.container - SIZES.container * 0.2,
                    width: '100%',
                  }}
                  useNativeControls
                  resizeMode="contain"
                  isLooping
                />
              ) : (
                <Image
                  style={{
                    height:
                      SIZES.width < SIZES.container
                        ? SIZES.width - SIZES.width * 0.2
                        : SIZES.container - SIZES.container * 0.2,
                    width: '100%',
                    resizeMode: 'contain',
                  }}
                  source={IMAGES.profilepic11} // Fallback image
                />
              )}
            </View>
          </View>

          {/* Caption Input */}
          <View style={[GlobalStyleSheet.container, { marginTop: 20 }]}>
            <Text style={[GlobalStyleSheet.inputlable, { color: colors.title, opacity: 0.6 }]}>
              Write a caption...
            </Text>
            <View
              style={[
                GlobalStyleSheet.inputBox,
                {
                  borderColor: colors.border,
                  borderWidth: 1,
                  paddingLeft: 20,
                  height: 'auto',
                },
              ]}
            >
              <TextInput
                multiline
                numberOfLines={5}
                style={[
                  GlobalStyleSheet.input,
                  {
                    color: colors.title,
                    height: 'auto',
                    paddingTop: 10,
                    paddingRight: 10,
                    paddingBottom: 10,
                    textAlignVertical: 'top',
                  },
                ]}
                placeholder="Enter caption"
                value={caption}
                onChangeText={setCaption}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Nextpage;