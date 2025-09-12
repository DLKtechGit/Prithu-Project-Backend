import React from 'react';
import { View, Text, TouchableOpacity, Image, Share, Alert } from 'react-native';
import { COLORS, FONTS, IMAGES } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { GlobalStyleSheet } from '../constants/styleSheet';
import { useTheme } from '@react-navigation/native';

const Header = (props: any) => {
  const navigation = useNavigation<any>();
  const { title, onPress, next, transparent, post, share, more, moresheet, share2, homepage, save } = props;

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Share media link here.',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <View
      style={[
        GlobalStyleSheet.headerstyle,
        GlobalStyleSheet.container,
        { padding: 0, backgroundColor: colors.card, borderBottomColor: colors.border },
        transparent && {
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          zIndex: 1,
          backgroundColor: 'transparent',
          borderBottomWidth: 0,
        },
      ]}
    >
      <View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={[{ width: 18, height: 18, margin: 10, tintColor: colors.title }, transparent && { tintColor: '#fff' }]}
            source={IMAGES.arrowleft}
          />
        </TouchableOpacity>
      </View>
      <Text
        style={[{ ...FONTS.h6, ...FONTS.fontMedium, marginLeft: 10, flex: 1, color: colors.title }, transparent && { color: '#fff' }]}
      >
        {title}
      </Text>

      {next && (
        <TouchableOpacity style={{ paddingRight: 10 }} onPress={onPress}>
          <Text style={{ ...FONTS.font, ...FONTS.fontRegular, color: colors.primary }}>next</Text>
        </TouchableOpacity>
      )}

      {post && (
        <TouchableOpacity style={{ paddingRight: 10 }} onPress={onPress}>
          <Text style={{ ...FONTS.font, ...FONTS.fontRegular, color: colors.primary }}>Post</Text>
        </TouchableOpacity>
      )}

      {share && (
        <TouchableOpacity onPress={onShare}>
          <Image style={[GlobalStyleSheet.image, { tintColor: colors.title, margin: 10 }]} source={IMAGES.share} />
        </TouchableOpacity>
      )}

      {more && (
        <TouchableOpacity onPress={() => moresheet.current.openSheet()}>
          <Image style={[GlobalStyleSheet.image, { tintColor: colors.title, margin: 10, marginRight: 0 }]} source={IMAGES.more} />
        </TouchableOpacity>
      )}

      {share2 && (
        <TouchableOpacity onPress={() => navigation.navigate('DrawerNavigation', { screen: 'Home' })}>
          <Text style={{ ...FONTS.font, ...FONTS.fontRegular, color: colors.primary }}>share</Text>
        </TouchableOpacity>
      )}

      {save && (
        <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => navigation.navigate('SavedMusic')}>
          <Image
            style={[GlobalStyleSheet.image, { tintColor: colors.title, margin: 10, marginRight: 0 }]}
            source={IMAGES.save2}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;