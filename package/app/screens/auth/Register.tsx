import React from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import Button from '../../components/button/Button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRoute } from "@react-navigation/native";
import TermsOfUse from './TermsOfUse';

type RegisterScreenProps = StackScreenProps<RootStackParamList, 'Register'>;

const Register = ({ navigation }: RegisterScreenProps) => {
    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const [show, setShow] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        username: '',
        email: '',
        password: '',
        otp: '',
    });



    const [inputFocus, setFocus] = React.useState({
        onFocus1: false,
        onFocus2: false,
        onFocus3: false,
        onFocus4: false,
    });
        
  const [otpSent, setOtpSent] = React.useState(false);
  const [otpVerified, setOtpVerified] = React.useState(false);
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
   const route = useRoute<any>(); // 🔹 Get route params

   // Auto check the box if coming from TermsOfUse
  React.useEffect(() => {
  if (route.params?.formData) {
    setFormData(route.params.formData);
  }
  if (route.params?.otpSent !== undefined) {
    setOtpSent(route.params.otpSent);
  }
  if (route.params?.otpVerified !== undefined) {
    setOtpVerified(route.params.otpVerified);
  }
  if (route.params?.acceptedTerms) {
    setAcceptedTerms(true);
  }
}, [route.params]);
 


   // Send OTP
  const sendOtp = async () => {
    if (!formData.email) {
      Alert.alert('Error', 'Please enter your email first');
      return;
    }
    try {
      const res = await fetch("http://192.168.1.48:5000/api/auth/creator/sent-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        Alert.alert('Success', 'OTP sent to your email');
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error(error);
      console.log(error)
      Alert.alert('Error', 'Failed to connect to server');
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!formData.otp) {
      Alert.alert('Error', 'Please enter OTP first');
      return;
    }
    try {
      const res = await fetch("http://192.168.1.48:5000/api/auth/new/creator/Verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpVerified(true);
        Alert.alert('Success', 'OTP verified');
      } else {
        setOtpVerified(false);
        Alert.alert('Error', data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to connect to server');
    }
  };


    const handleRegister = async () => {
          // Basic validation
        if (!formData.username || !formData.email || !formData.password || !formData.otp) {
            Alert.alert('Error', 'All fields including OTP are required');
            return;
        }
         if (!otpVerified) {
              Alert.alert('Error', 'Please verify OTP before registering');
              return;
           }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://192.168.1.48:5000/api/auth/creator/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                otp: formData.otp,
            });

            if (response.status === 201) {
                Alert.alert('Success', 'Registration successful!');
                navigation.navigate('Login');
            }
        } catch (error: any) {
            if (error.response) {
                // Server responded with error status
                Alert.alert('Error', error.response.data.error || 'Registration failed');
            } else if (error.request) {
                // Request was made but no response received
                Alert.alert('Error', 'Network error - please check your connection');
            } else {
                // Other errors
                Alert.alert('Error', 'An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    const updateFormData = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <SafeAreaView style={[GlobalStyleSheet.container, { padding: 0, flex: 1 }]}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                            <Text style={GlobalStyleSheet.formtitle}>Create a Creator Account</Text>
                            <Text style={GlobalStyleSheet.forndescription}>Please enter your credentials to access your account and detail</Text>
                        </View>
                        <View style={[GlobalStyleSheet.loginarea, { backgroundColor: colors.card }]}>
                            <Text style={[GlobalStyleSheet.inputlable, { color: colors.title }]}>Username</Text>
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
                                    source={IMAGES.usename}
                                />

                                <TextInput
                                    style={[GlobalStyleSheet.input, { color: colors.title }]}
                                    placeholder='Enter your username'
                                    placeholderTextColor={colors.placeholder}
                                    onFocus={() => setFocus({ ...inputFocus, onFocus1: true })}
                                    onBlur={() => setFocus({ ...inputFocus, onFocus1: false })}
                                    value={formData.username}
                                    onChangeText={(text) => updateFormData('username', text)}
                                    autoCapitalize="none"
                                />
                            </View>

                            <Text style={[GlobalStyleSheet.inputlable, { color: colors.title }]}>Email</Text>
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
                                    source={IMAGES.email}
                                />

                                <TextInput
                                    style={[GlobalStyleSheet.input, { color: colors.title }]}
                                    placeholder='Enter your email'
                                    placeholderTextColor={colors.placeholder}
                                    onFocus={() => setFocus({ ...inputFocus, onFocus2: true })}
                                    onBlur={() => setFocus({ ...inputFocus, onFocus2: false })}
                                    value={formData.email}
                                    onChangeText={(text) => updateFormData('email', text)}
                                    keyboardType="email-address"
                                    autoCapitalize="none" />

                                 <TouchableOpacity style={{ position: "absolute", right: 15 }} onPress={sendOtp}>
                                    <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
                                </TouchableOpacity>
                               
                            </View>

                {/* OTP field (only after sent) */}
                 {otpSent && (
                <>
                  <Text style={[GlobalStyleSheet.inputlable, { color: colors.title }]}>Verification OTP</Text>
                  <View style={[GlobalStyleSheet.inputBox, { backgroundColor: colors.input }, inputFocus.onFocus4 && { borderColor: COLORS.primary }]}>
                    <Image style={[GlobalStyleSheet.inputimage, { tintColor: theme.dark ? colors.title : colors.text }]} source={IMAGES.lock} />
                    <TextInput
                      style={[GlobalStyleSheet.input, { color: colors.title }]}
                      placeholder='Enter verification code'
                      placeholderTextColor={colors.placeholder}
                      keyboardType='number-pad'
                      value={formData.otp}
                      onChangeText={(text) => updateFormData('otp', text)}
                      onFocus={() => setFocus({ ...inputFocus, onFocus4: true })}
                      onBlur={() => setFocus({ ...inputFocus, onFocus4: false })}/>
                    <TouchableOpacity style={{ position: "absolute", right: 15 }} onPress={verifyOtp}>
                      <Ionicons name="checkmark-circle" size={22} color={otpVerified ? "green" : COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                  </>
                 )}
            <Text style={[GlobalStyleSheet.inputlable, { color: colors.title }]}>Password</Text>
                            <View
                                style={[
                                    GlobalStyleSheet.inputBox, {
                                        backgroundColor: colors.input,
                                    },
                                    inputFocus.onFocus3 && {
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
                                    placeholder='Enter your password'
                                    placeholderTextColor={colors.placeholder}
                                    secureTextEntry={show}
                                    onFocus={() => setFocus({ ...inputFocus, onFocus3: true })}
                                    onBlur={() => setFocus({ ...inputFocus, onFocus3: false })}
                                    value={formData.password}
                                    onChangeText={(text) => updateFormData('password', text)}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        position: 'absolute',
                                        right: 15,
                                    }}
                                    onPress={() => {
                                        setShow(!show)
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

                                     {/*  Terms of Use Checkbox UI */}
                      <View style={{ flexDirection: "row",
                                    alignItems: "center", 
                                    marginTop: 15,
                                    justifyContent: "center", 
                                    marginLeft : 25
                                   }}>
                           <TouchableOpacity
                           onPress={() => setAcceptedTerms(!acceptedTerms)}
                           style={{
                            width: 20,
                            height: 20,
                            borderWidth: 1.5,
                            borderColor: COLORS.primary,
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 8,
                           borderRadius: 4,
                             }}  >
                         {acceptedTerms && (
                           <Ionicons name="checkmark" size={16} color={COLORS.primary} />
                              )}
                       </TouchableOpacity>

                       <Text style={{ color: colors.text, flex: 1 }}>
                                I accept and agree to the{" "}
                         <Text
                          onPress={() =>
                          navigation.navigate("TermsOfUse", {
                          formData,
                          otpSent,
                          otpVerified,
                          acceptedTerms,
                         })
                           }
                        style={{
                         color: COLORS.primary,
                         textDecorationLine: "underline",
                            }}>
                        Terms of Use
                      </Text>
                      </Text>
                     </View>
                        
                        
                            <View style={{ marginTop: 10 }}>
                                <Button 
                                    title={loading ? "Registering..." : "Register"}
                                    onPress={handleRegister}
                                    disabled={loading}
                                />
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

export default Register;