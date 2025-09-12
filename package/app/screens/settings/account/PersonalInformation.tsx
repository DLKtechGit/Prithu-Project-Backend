import React from 'react';
import { View, Text, SafeAreaView, Image, TextInput } from 'react-native';
import { COLORS, IMAGES } from '../../../constants/theme';
import Header from '../../../layout/Header';
import { GlobalStyleSheet } from '../../../constants/styleSheet';
import Button from '../../../components/button/Button';
import { useTheme } from '@react-navigation/native';

const PersonalInformation = () => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    return (
        <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
            <Header
                title='Personal Information'
            />
        <View style={[GlobalStyleSheet.container,{marginTop:15}]}>
                <View
                    style={[
                        GlobalStyleSheet.inputBox, {
                            borderColor:colors.border,
                            borderWidth: 1,
                        },
                    ]}
                >
                    <Image
                        style={[
                            GlobalStyleSheet.inputimage,
                            {
                                tintColor: colors.title
                            }
                        ]}
                        source={IMAGES.usename}
                    />

                    <TextInput
                        style={[GlobalStyleSheet.input, { color: colors.title }]}
                        placeholder='Enter Address'
                        placeholderTextColor={colors.placeholder}
                    />
                </View>

                <View
                    style={[
                        GlobalStyleSheet.inputBox, {
                            borderColor: colors.border,
                            borderWidth: 1,
                        },
                    ]}
                >
                    <Image
                        style={[
                            GlobalStyleSheet.inputimage,
                            {
                                tintColor: colors.title
                            }
                        ]}
                        source={IMAGES.usename}
                    />

                    <TextInput
                        style={[GlobalStyleSheet.input, { color: colors.title }]}
                        placeholder='+91 7665186421'
                        placeholderTextColor={colors.placeholder}
                    />
                </View>

                <Button
                    title="Save"
                />
        </View>    
      </SafeAreaView>
  )
}

export default PersonalInformation;