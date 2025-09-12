import React from 'react';
import { View, Text, Image, Alert, TouchableOpacity, TextInput, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import Button from '../../components/button/Button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';

type ForgotScreenProps = StackScreenProps<RootStackParamList, 'Forgot'>;

const Forgot = ({ navigation } : ForgotScreenProps)  => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const [show, setshow] = React.useState(true);

    const [inputFocus, setFocus] = React.useState({
        onFocus1: false,
        onFocus2: false
    })

    //  state for email
    const [email, setEmail] = React.useState("");

    //  function for Next button
    const handleNext = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email");
            return;
        }

        try {
            const res = await fetch("http://192.168.1.48:5000/api/auth/creator/sent-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            console.log("Forgot Response:", data);

            if (res.ok) {
                Alert.alert("Success", "OTP has been sent to your email");
                navigation.navigate('Otp') // 👈 pass email to OTP screen
            } else {
                Alert.alert("Error", data.message || "Please fill the required email");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to connect to server");
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
                                    style={{width:80,height:80}}
                                    source={IMAGES.logo}
                                />
                            </View>
                            <Text style={GlobalStyleSheet.formtitle}>Forgot Password</Text>
                            <Text style={GlobalStyleSheet.forndescription}>Please enter your credentials to access your account and detail</Text>
                        </View>
                        <View style={[GlobalStyleSheet.loginarea, { backgroundColor: colors.card }]}>
                            
                            <Text style={[GlobalStyleSheet.inputlable, { color: colors.title }]}>Email</Text>
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
                                    source={IMAGES.email}
                                />

                                <TextInput
                                    style={[GlobalStyleSheet.input, { color: colors.title }]}
                                    placeholder='Enter your email'
                                    placeholderTextColor={colors.placeholder}
                                     value={email}
                                     onChangeText={setEmail}
                                    onFocus={() => setFocus({ ...inputFocus, onFocus1: true })}
                                    onBlur={() => setFocus({ ...inputFocus, onFocus1: false })}
                                />
                            </View>

                            <View style={{ marginTop: 10 }}>
                                <Button title="Next" onPress={handleNext} />
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

export default Forgot;