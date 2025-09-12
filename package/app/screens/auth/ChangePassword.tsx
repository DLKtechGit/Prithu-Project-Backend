import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert, TextInput, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import Button from '../../components/button/Button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ChangePasswordScreenProps = StackScreenProps<RootStackParamList, 'ChangePassword'>;

const ChangePassword = ({ navigation } : ChangePasswordScreenProps) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const [show, setshow] = React.useState(true);

    const [show2, setshow2] = React.useState(true);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [inputFocus, setFocus] = React.useState({
        onFocus1: false,
        onFocus2: false
    })

        
const handleSubmit = async () => {
  if (!newPassword || !confirmPassword) {
    Alert.alert("Error", "Please fill all fields");
    return;
  }
  if (newPassword !== confirmPassword) {
    Alert.alert("Error", "Passwords do not match");
    return;
  }

  try {
    //  await AsyncStorage
    const email = await AsyncStorage.getItem("verifiedEmail");
    console.log("Retrieved email:", email);

    if (!email) {
      Alert.alert("Error", "Email not found. Please verify again.");
      return;
    }

    const response = await fetch("http://192.168.1.48:5000/api/auth/creator/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        newPassword, // ✅ make sure backend expects "password"
      }),
    });

    const data = await response.json();

    if (response.ok) {
      await AsyncStorage.removeItem("verifiedEmail");
      Alert.alert("Success", "Password changed successfully", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } else {
      Alert.alert("Error", data.error || "Failed to change password");
    }
  } catch (err: any) {
    Alert.alert("Error", err.message);
  }
};

    return (
        <SafeAreaView style={[GlobalStyleSheet.container,{padding:0, flex: 1 }]}>
            <KeyboardAvoidingView
                style={{flex: 1}}
                //behavior={Platform.OS === 'ios' ? 'padding' : ''}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ backgroundColor: COLORS.secondary, flex: 1 }}>
                        <View style={{ alignItems: 'center' }}>
                            <LinearGradient colors={['rgba(255, 255, 255, 0.00)', 'rgba(255, 255, 255, 0.08)']} style={GlobalStyleSheet.cricleGradient1}>
                            </LinearGradient>
                            <LinearGradient colors={['rgba(255, 255, 255, 0.00)', 'rgba(255, 255, 255, 0.08)']} style={GlobalStyleSheet.cricleGradient2}>
                            </LinearGradient>
                            <View
                                style={{
                                    paddingTop: 40,
                                    paddingBottom: 20
                                }}
                            >
                                <Image
                                    style={{ width: 80, height: 80 }}
                                    source={IMAGES.logo}
                                />
                            </View>
                            <Text style={GlobalStyleSheet.formtitle}>Change Password</Text>
                            <Text style={GlobalStyleSheet.forndescription}>Please enter your credentials to access your account and detail</Text>
                        </View>
                        <View style={[GlobalStyleSheet.loginarea, { backgroundColor: colors.card }]}>
                            

                            <Text style={[GlobalStyleSheet.inputlable, { color: colors.title }]}> New Password</Text>
                            <View
                                style={[
                                    GlobalStyleSheet.inputBox, {
                                        backgroundColor: colors.input,
                                    },
                                    inputFocus.onFocus1 && {
                                        borderColor: COLORS.primary,
                                    }
                                ]}
                            >
                                <Image
                                    style={[
                                        GlobalStyleSheet.inputimage,
                                        {
                                            tintColor: theme.dark ? colors.title : colors.text,
                                        }
                                    ]}
                                    source={IMAGES.lock}
                                />

                                <TextInput
                                    style={[GlobalStyleSheet.input, { color: colors.title }]}
                                    placeholder='Enter your new password'
                                    placeholderTextColor={colors.placeholder}
                                    secureTextEntry={show}
                                    keyboardType='number-pad'
                                    value={newPassword}
                                    onChangeText={(pass)=>{setNewPassword(pass)}}
                                    onFocus={() => setFocus({ ...inputFocus, onFocus1: true })}
                                    onBlur={() => setFocus({ ...inputFocus, onFocus1: false })}
                                />
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        position: 'absolute',
                                        right: 15,

                                    }}
                                    onPress={() => {
                                        setshow(!show)
                                    }}
                                >
                                    <Image
                                        style={[GlobalStyleSheet.inputSecureIcon, {
                                            tintColor: theme.dark ? colors.title : colors.text,
                                        }]}
                                        source={
                                            show
                                                ?
                                                IMAGES.eyeclose
                                                :
                                                IMAGES.eyeopen
                                        }
                                    />
                                </TouchableOpacity>
                            </View>
                            
                            <Text style={[GlobalStyleSheet.inputlable, { color: colors.title }]}> Confirm Password</Text>
                            <View
                                style={[
                                    GlobalStyleSheet.inputBox, {
                                        backgroundColor: colors.input,
                                    },
                                    inputFocus.onFocus2 && {
                                        borderColor: COLORS.primary,
                                    }
                                ]}
                            >
                                <Image
                                    style={[
                                        GlobalStyleSheet.inputimage,
                                        {
                                            tintColor: theme.dark ? colors.title : colors.text,
                                        }
                                    ]}
                                    source={IMAGES.lock}
                                />

                                <TextInput
                                    style={[GlobalStyleSheet.input, { color: colors.title }]}
                                    placeholder='Enter your confirm password'
                                    placeholderTextColor={colors.placeholder}
                                    secureTextEntry={show2}
                                    keyboardType='number-pad'
                                    value={confirmPassword}
                                    onChangeText={(pass)=>{setConfirmPassword(pass)}}
                                    onFocus={() => setFocus({ ...inputFocus, onFocus2: true })}
                                    onBlur={() => setFocus({ ...inputFocus, onFocus2: false })}
                                />
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        position: 'absolute',
                                        right: 15,

                                    }}
                                    onPress={() => {
                                        setshow2(!show2)
                                    }}
                                >
                                    <Image
                                        style={[GlobalStyleSheet.inputSecureIcon, {
                                            tintColor: theme.dark ? colors.title : colors.text,
                                        }]}
                                        source={
                                            show2
                                                ?
                                                IMAGES.eyeclose
                                                :
                                                IMAGES.eyeopen
                                        }
                                    />
                                </TouchableOpacity>
                            </View>
                            
                            <View style={{marginTop:10}}>
                               <Button title="Submit" onPress={handleSubmit} />
                            </View>

                            <View style={{ flex: 1 }}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                                <Text style={{ ...FONTS.font, color: colors.text }}>Already have an account
                                </Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Login')}
                                >
                                    <Text style={{ ...FONTS.font, color: COLORS.primary, textDecorationLine: 'underline', textDecorationColor: '#2979F8', marginLeft: 5 }}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChangePassword;