import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { GlobalStyleSheet } from '../../../constants/styleSheet';
import { COLORS, FONTS } from '../../../constants/theme';
import Header from '../../../layout/Header';
import { useTheme } from '@react-navigation/native';

const Terms = () => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

  return (
      <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
          <Header
              title='Terms of Use'
          />
          <View style={GlobalStyleSheet.container}>
              <Text style={[GlobalStyleSheet.textfont, { fontSize: 15, marginTop: 20, color: colors.title }]}>information</Text>
              <View style={{ marginTop: 20 }}>
                  <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                      <View style={[GlobalStyleSheet.Dot, { backgroundColor: colors.title }]} />
                      <Text style={[GlobalStyleSheet.textfont, GlobalStyleSheet.titlefont3, { color: colors.title }]}>Contact information: We may collect personal information that you voluntarily provide to us, such as your name, email address, profile picture, and any other information you choose to share when using our app.</Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                      <View style={[GlobalStyleSheet.Dot, { backgroundColor: colors.title }]} />
                      <Text style={[GlobalStyleSheet.textfont, GlobalStyleSheet.titlefont3, { color: colors.title }]}>Legal Requirements: We may disclose your information if required by law, such as in response to a court order or subpoena.</Text>
                  </View>
                  <View style={{ flexDirection: 'row', }}>
                      <View style={[GlobalStyleSheet.Dot, { backgroundColor: colors.title }]} />
                      <Text style={[GlobalStyleSheet.textfont, GlobalStyleSheet.titlefont3, { color: colors.title }]}>User-Generated Content: Any content you post, including text, photos, videos, and comments, will be stored and may be publicly visible, depending on your privacy settings.</Text>
                  </View>
              </View>
              <Text style={[GlobalStyleSheet.textfont, { fontSize: 15, marginTop: 20, color: colors.title }]}>Use of our website</Text>
              <View style={{ marginTop: 20 }}>
                  <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                      <View style={[GlobalStyleSheet.Dot, { backgroundColor: colors.title }]} />
                      <Text style={[GlobalStyleSheet.textfont, GlobalStyleSheet.titlefont3, { color: colors.title }]}>Location Data: Many social apps collect users' location information, either through GPS or by asking for permission to access location services on their devices. This data can be used for location-based features or content recommendations.</Text>
                  </View>
              </View>  
          </View>
      </SafeAreaView>
  )
}

export default Terms;