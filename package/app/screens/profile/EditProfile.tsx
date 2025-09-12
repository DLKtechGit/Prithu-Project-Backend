import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { IMAGES } from '../../constants/theme';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import Button from '../../components/button/Button';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
 
const EditProfile = () => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
 
  const [imageUrl, setImageUrl] = useState<string>('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [maritalStatus, setMaritalStatus] = useState(false);
  const [language, setLanguage] = useState('en');
  const [dob, setDob] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
 
  // Format date to YYYY-MM-DD
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
 
  // Fetch profile detail from server
  const fetchProfileDetail = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;
 
      const res = await fetch(`http://192.168.1.48:5000/api/get/profile/detail/${userId}`);
      const data = await res.json();
       
      if (res.ok && data.profileSetting) {
        console.log(data);
        const profile = data.profileSetting;
        setDisplayName(profile.displayName || '');
        setUsername(data.userName || '');
        setBio(profile.bio || '');
        setPhoneNumber(profile.phoneNumber || '');
        setMaritalStatus(profile.maritalStatus === true || profile.maritalStatus === 'true');
        setLanguage(profile.language || 'en');
 
        // Normalize DOB
        if (profile.dateOfBirth) {
          setDob(new Date(profile.dateOfBirth));
        } else {
          setDob(null);
        }
 
        // Fix image path
        if (profile.profileAvatar) {
          const fixedPath = profile.profileAvatar.replace(/\\/g, '/');
          setImageUrl(`http://192.168.1.48:5000/${fixedPath}`);
        } else {
          setImageUrl('');
        }
      } else {
        console.log('Error fetching profile:', data.message);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };
 
  useEffect(() => {
    fetchProfileDetail();
  }, []);
 
  const handleImageSelect = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access media library is required!');
        return;
      }
 
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
 
      if (!result.canceled) {
        setImageUrl(result.assets[0].uri);
      }
    } catch (e) {
      console.error('Error selecting image:', e);
    }
  };
 
  const handleSave = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        alert('User not found, please login again');
        return;
      }
 
      const formData = new FormData();
      formData.append('displayName', displayName);
      formData.append('bio', bio);
      formData.append('phoneNumber', phoneNumber);
      formData.append('maritalStatus', maritalStatus ? 'true' : 'false');
      formData.append('language', language);
      formData.append('role', "Creator");
      formData.append('userName', username)
      formData.append('roleRef', "Creator");
      if (dob) formData.append('dateOfBirth', dob.toISOString());
 
      if (imageUrl) {
        const filename = imageUrl.split('/').pop();
        const fileType = filename?.split('.').pop();
        formData.append('file', {
          uri: imageUrl,
          name: filename || 'profile.jpg',
          type: `image/${fileType || 'jpg'}`,
        } as any);
      }
 
      const res = await fetch(
        `http://192.168.1.48:5000/api/profile/detail/update/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        }
      );
 
      const data = await res.json();
      if (res.ok) {
        alert('Profile updated successfully!');
        fetchProfileDetail(); // reload updated data
      } else {
        console.error('Error updating profile:', data);
        alert(data.message || 'Update failed');
      }
    } catch (err) {

     console.log(err);
     console.error('Save error:', err);
      alert('Something went wrong while saving');
    }
  };
 
  return (
    <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
      <Header title="Edit profile" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Profile Image */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
          <View>
            <Image
              style={{ width: 100, height: 100, borderRadius: 100 }}
              source={imageUrl ? { uri: imageUrl } : IMAGES.profile}
            />
            <TouchableOpacity
              onPress={handleImageSelect}
              style={{ position: 'absolute', bottom: 0, right: 0 }}
            >
              <View
                style={{
                  backgroundColor: theme.dark ? '#112036' : '#fff',
                  width: 36,
                  height: 36,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    backgroundColor: '#2979F8',
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    style={{ width: 18, height: 18, resizeMode: 'contain' }}
                    source={IMAGES.write2}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
 
        <View style={[GlobalStyleSheet.container, { marginTop: 15 }]}>
          {/* Display Name */}
          <Text style={[GlobalStyleSheet.inputlable, { color: colors.title, opacity: 0.6 }]}>
            Name
          </Text>
          <View
            style={[
              GlobalStyleSheet.inputBox,
              { borderColor: colors.border, borderWidth: 1, paddingLeft: 20 },
            ]}
          >
            <TextInput
              style={[GlobalStyleSheet.input, { color: colors.title }]}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter your name"
              placeholderTextColor={colors.placeholder}
            />
          </View>
 
          {/* Username */}
          <Text style={[GlobalStyleSheet.inputlable, { color: colors.title, opacity: 0.6 }]}>
            Username
          </Text>
          <View
            style={[
              GlobalStyleSheet.inputBox,
              { borderColor: colors.border, borderWidth: 1, paddingLeft: 20 },
            ]}
          >
            <TextInput
              style={[GlobalStyleSheet.input, { color: colors.title }]}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor={colors.placeholder}
            />
          </View>
 
          {/* Bio */}
          <Text style={[GlobalStyleSheet.inputlable, { color: colors.title, opacity: 0.6 }]}>
            Bio
          </Text>
          <View
            style={[
              GlobalStyleSheet.inputBox,
              { borderColor: colors.border, borderWidth: 1, paddingLeft: 20, height: 'auto' },
            ]}
          >
            <TextInput
              multiline
              numberOfLines={5}
              style={[
                GlobalStyleSheet.input,
                { color: colors.title, height: 'auto', paddingTop: 10, paddingRight: 10 },
              ]}
              value={bio}
              onChangeText={setBio}
              placeholder="Enter your bio"
              placeholderTextColor={colors.placeholder}
            />
          </View>
 
          {/* Phone Number */}
          <Text style={[GlobalStyleSheet.inputlable, { color: colors.title, opacity: 0.6 }]}>
            Phone Number
          </Text>
          <View
            style={[
              GlobalStyleSheet.inputBox,
              { borderColor: colors.border, borderWidth: 1, paddingLeft: 20 },
            ]}
          >
            <TextInput
              style={[GlobalStyleSheet.input, { color: colors.title }]}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
              placeholderTextColor={colors.placeholder}
            />
          </View>
 
          {/* Marital Status */}
          <Text style={[GlobalStyleSheet.inputlable, { color: colors.title, opacity: 0.6 }]}>
            Marital Status
          </Text>
          <Picker
            selectedValue={maritalStatus ? 'married' : 'single'}
            onValueChange={(val) => setMaritalStatus(val === 'married')}
            style={{ color: colors.title }}
          >
            <Picker.Item label="Single" value="single" />
            <Picker.Item label="Married" value="married" />
          </Picker>
 
          {/* Date of Birth */}
          <Text style={[GlobalStyleSheet.inputlable, { color: colors.title, opacity: 0.6 }]}>
            Date of Birth
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[
              GlobalStyleSheet.inputBox,
              { borderColor: colors.border, borderWidth: 1, paddingLeft: 20, justifyContent: 'center' },
            ]}
          >
            <Text style={{ color: dob ? colors.title : colors.placeholder }}>
              {dob ? formatDate(dob) : 'Select Date of Birth'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dob || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDob(selectedDate);
              }}
            />
          )}
 
          {/* Language */}
          <Text style={[GlobalStyleSheet.inputlable, { color: colors.title, opacity: 0.6 }]}>
            Language
          </Text>
          <Picker
            selectedValue={language}
            onValueChange={(val) => setLanguage(val)}
            style={{ color: colors.title }}
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Tamil" value="ta" />
            <Picker.Item label="Hindi" value="hi" />
            <Picker.Item label="French" value="fr" />
            <Picker.Item label="Spanish" value="es" />
          </Picker>
 
          <Button title="Save" onPress={handleSave} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
 
export default EditProfile;