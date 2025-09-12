import React, { useState } from 'react';
import { View, Text, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../constants/theme';
import Header from '../../../layout/Header';
import { GlobalStyleSheet } from '../../../constants/styleSheet';
import { useTheme } from '@react-navigation/native';

const SettingNotification = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

   const theme = useTheme();
    const { colors } : {colors : any} = theme;

  return (
    <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
      <Header
        title='Contacts syncing'
      />
      <View style={GlobalStyleSheet.container}>
        <View style={[GlobalStyleSheet.flexalingjust, { marginTop: 20 }]}>
          <Text style={[GlobalStyleSheet.textfont, { fontSize: 15,color:colors.title }]}>Connect contacts</Text>
          <Switch
            trackColor={{ false: '#767577', true: 'rgba(41,121,248,.2)' }}
            thumbColor={isEnabled ? '#2979F8' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SettingNotification;