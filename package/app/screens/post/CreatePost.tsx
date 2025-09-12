import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, FlatList } from 'react-native';
import Header from '../../layout/Header';
import { FONTS, IMAGES, SIZES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

type CreatePostScreenProps = StackScreenProps<RootStackParamList, 'createpost'>;

const CreatePost = ({ navigation }: CreatePostScreenProps) => {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [gallery, setGallery] = useState<{ uri: string; type: 'image' | 'video' }[]>([]);
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  // Pick single media (image or video)
  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow images and videos
      allowsEditing: true,
      quality: 1,
      videoMaxDuration: 60, // Limit video duration to 60 seconds
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const type = result.assets[0].type === 'video' ? 'video' : 'image';
      setMediaUrl(uri);
      setMediaType(type);
      setGallery([{ uri, type }, ...gallery]);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      console.log('Permission status:', status);

      if (status === 'granted') {
        const media = await MediaLibrary.getAssetsAsync({
          mediaType: ['photo', 'video'], // Fetch both photos and videos
          first: 50,
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        });

        console.log('Total assets fetched:', media.assets.length);
        const assets = media.assets.map((a) => ({
          uri: a.uri,
          type: a.mediaType === MediaLibrary.MediaType.video ? 'video' : 'image',
        }));
        setGallery(assets);

        if (assets.length > 0) {
          setMediaUrl(assets[0].uri);
          setMediaType(assets[0].type);
        } else {
          await pickMedia();
        }
      }
    })();
  }, []);

  return (
    <SafeAreaView style={[GlobalStyleSheet.container, { padding: 0, backgroundColor: colors.card, flex: 1 }]}>
      <Header
        title="Select Post"
        next={true}
        onPress={() => navigation.navigate('Nextpage', { mediaUrl, mediaType })} // Pass mediaUrl and mediaType
      />

      {/* Preview */}
      <View>
        <View style={{ paddingVertical: 30, backgroundColor: 'rgba(71,90,119,.25)' }}>
          {mediaUrl ? (
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
          ) : (
            <Text style={{ textAlign: 'center', color: colors.title }}>No Media Selected</Text>
          )}
        </View>
      </View>

      {/* Top Bar */}
      <View style={[GlobalStyleSheet.flexaling, { paddingHorizontal: 15 }]}>
        <Text style={{ flex: 1, ...FONTS.fontMedium, ...FONTS.h5, color: colors.title }}>Gallery</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Nextpage', { mediaUrl, mediaType })}
          style={{ padding: 10 }}
        >
          <Image style={{ height: 24, width: 24, tintColor: colors.title }} source={IMAGES.edit} />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 10 }} onPress={pickMedia}>
          <Image style={{ height: 24, width: 24, tintColor: colors.title }} source={IMAGES.camera} />
        </TouchableOpacity>
      </View>

      {/* Gallery Grid */}
      <FlatList
        data={gallery}
        numColumns={4}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setMediaUrl(item.uri);
              setMediaType(item.type);
            }}
            style={{ width: '25%', aspectRatio: 1, padding: 1 }}
          >
            <Image
              style={{ width: '100%', height: '100%' }}
              source={{ uri: item.uri }}
            />
            {item.type === 'video' && (
              <View
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: [{ translateX: -12 }, { translateY: -12 }],
                }}
              >
                <Image
                  source={IMAGES.play}
                  style={{ width: 24, height: 24, tintColor: '#fff' }}
                />
              </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: colors.title }}>No Media Found</Text>
        }
      />
    </SafeAreaView>
  );
};

export default CreatePost;