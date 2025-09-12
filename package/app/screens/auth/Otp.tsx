import React from 'react';
import { View, Text, Image, Alert, TouchableOpacity, TextInput, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import Button from '../../components/button/Button';
import OTPTextInput from 'react-native-otp-textinput';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import AsyncStorage from '@react-native-async-storage/async-storage';

type OtpScreenProps = StackScreenProps<RootStackParamList, 'Otp'>;

const Otp = ({ navigation } : OtpScreenProps) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const [show, setshow] = React.useState(true);
    const [otp, setOtp] = React.useState("");

    const [inputFocus, setFocus] = React.useState({
        onFocus1: false,
        onFocus2: false
    })

     const handleVerifyOtp = async () => {
        if (!otp || otp.length < 4) {
            Alert.alert("Error", "Please enter the full OTP");
            return;
        }

        try {
            const response = await fetch("http://192.168.1.48:5000/api/auth/exist/creator/Verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ otp }),   // 👈 send OTP to backend
            });

            const data = await response.json();
            console.log("Backend response:", data); 
        
            if (response.ok) {
                console.log(data.email);
                
                   await AsyncStorage.removeItem('verifiedEmail');
                await AsyncStorage.setItem('verifiedEmail', data.email);
                Alert.alert("Success", "OTP verified successfully!", [
                    { text: "OK", onPress: () => navigation.navigate("ChangePassword") }
                ]);
            } else {
                Alert.alert("Error", data.message || "Invalid OTP, please try again");
                console.log(data.message)
            }
        } catch (error) {
            console.error("OTP Verify Error:", error);
            Alert.alert("Error", "Something went wrong. Please try again later.");
            console.log(otp)
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
                            <Text style={GlobalStyleSheet.formtitle}>Enter Code</Text>
                            <Text style={GlobalStyleSheet.forndescription}>Please enter your credentials to access your account and detail</Text>
                        </View>
                        <View style={[GlobalStyleSheet.loginarea, { backgroundColor: colors.card }]}>
                            
                            <View style={{alignItems:'center',marginBottom:20}}>
                                <OTPTextInput 
                                    tintColor={colors.background}
                                     handleTextChange={(text: string) => setOtp(text)} 
                                    inputCount={4}
                                    textInputStyle={{
                                        borderBottomWidth:0,
                                        height:48,
                                        width:48,
                                        borderRadius:SIZES.radius,
                                        backgroundColor:colors.input,
                                        //color:colors.title,
                                    }}
                                    
                                />
                            </View> 

                            <View style={{ marginTop: 10 }}>
                                 <Button title="Next" onPress={handleVerifyOtp}/>
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

export default Otp;