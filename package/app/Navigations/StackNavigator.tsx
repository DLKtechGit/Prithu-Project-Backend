import React, { useEffect, useState } from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './RootStackParamList';
import { SafeAreaView, ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import all your screens
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import Forgot from '../screens/auth/Forgot-password';
import Otp from '../screens/auth/Otp';
import ChangePassword from '../screens/auth/ChangePassword';
import Comments from '../screens/comment/Comments';
import HomeScreen from '../screens/home/HomeScreen';
import CreatePost from '../screens/post/CreatePost';
import Notification from '../screens/notification/Notification';
import Like from '../screens/like/Like';
import Status from '../screens/status/Status';
import AddStory from '../screens/status/AddStory';
import SingleChat from '../screens/chat/SingleChat';
import Video from '../screens/chat/Video';
import Call from '../screens/chat/Call';
import NewChat from '../screens/chat/NewChat';
import Followers from '../screens/profile/Followers';
import Settings from '../screens/settings/Settings';
import Security from '../screens/settings/security/Security';
import LoginActivity from '../screens/settings/security/LoginActivity';
import SavedLogin from '../screens/settings/security/SavedLogin';
import SettingNotification from '../screens/settings/notification/SettingNotification';
import Towfactor from '../screens/settings/security/Towfactor';
import Account from '../screens/settings/account/Account';
import PersonalInformation from '../screens/settings/account/PersonalInformation';
import Language from '../screens/settings/account/Language';
import Contacts from '../screens/settings/account/Contacts';
import About from '../screens/settings/about/About';
import PrivacyPolicy from '../screens/settings/about/PrivacyPolicy';
import Terms from '../screens/settings/about/Terms';
import Theme from '../screens/settings/theme/Theme';
import EditProfile from '../screens/profile/EditProfile';
import Suggestions from '../screens/profile/Suggestions';
import ProfilePost from '../screens/profile/ProfilePost';
import ProfileReels from '../screens/profile/ProfileReels';
import AnotherProfile from '../screens/profile/AnotherProfile';
import Save from '../screens/settings/save/Save';
import SavePost from '../screens/settings/save/SavePost';
import SaveReels from '../screens/settings/save/SaveReels';
import Components from '../screens/components/Components';
import AccordionScreen from '../screens/components/Accordion';
import ActionSheet from '../screens/components/ActionSheet';
import ActionModals from '../screens/components/ActionModals';
import Buttons from '../screens/components/Buttons';
import Badges from '../screens/components/Badges';
import Charts from '../screens/components/Charts';
import Headers from '../screens/components/Headers';
import Footers from '../screens/components/Footers';
import TabStyle1 from '../components/Footers/FooterStyle1';
import TabStyle2 from '../components/Footers/FooterStyle2';
import TabStyle3 from '../components/Footers/FooterStyle3';
import TabStyle4 from '../components/Footers/FooterStyle4';
import Inputs from '../screens/components/Inputs';
import ListScreen from '../screens/components/Lists';
import Pricings from '../screens/components/Pricings';
import Snackbars from '../screens/components/Snackbars';
import DividerElements from '../screens/components/DividerElements';
import Socials from '../screens/components/Socials';
import SwipeableScreen from '../screens/components/Swipeable';
import Tabs from '../screens/components/Tabs';
import Tables from '../screens/components/Tables';
import Toggles from '../screens/components/Toggles';
import Nextpage from '../screens/post/Nextpage';
import Music from '../screens/music/Music';
import WriteCaption from '../screens/post/WriteCaption';
import CreateStory from '../screens/createstory/CreateStory';
import Music2 from '../screens/createstory/Music';
import AllSong from '../screens/createstory/AllSong';
import SavedMusic from '../screens/createstory/SavedMusic';
import Reels from '../screens/reels/Reels';
import Profile from '../screens/profile/Profile';
import DrawerNavigation from './DrawerNavigation';
import Datepicker from '../screens/components/Datepicker';
import Search2 from '../screens/components/Search2';
import ChatRooms from '../screens/chatrooms/ChatRooms';
import AddMembers from '../screens/chatrooms/AddMembers';
import SingleChatRoom from '../screens/chatrooms/SingleChatRoom';
import ChatRoomCall from '../screens/chatrooms/ChatRoomCall';
import ChatRoomCallON from '../screens/chatrooms/ChatRoomCallON';
import ChatRoomVideoCall from '../screens/chatrooms/ChatRoomVideoCall';
import ChatRoomVideoCallON from '../screens/chatrooms/ChatRoomVideoCallON';
import TermsOfUse from '../screens/auth/TermsOfUse';

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
      } catch (e) {
        console.error('Failed to load token', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Show loading screen while checking auth status
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ width: '100%', flex: 1 }}>
      <Stack.Navigator
        initialRouteName={userToken ? "DrawerNavigation" : "Login"}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "transparent", flex: 1 },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
       

        {/* Main App Screens - Only accessible when logged in */}
        <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Forgot" component={Forgot} />
            <Stack.Screen name="Otp" component={Otp} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
        <Stack.Screen name="Comments" component={Comments} />
        <Stack.Screen name="homescreen" component={HomeScreen} />
        <Stack.Screen name="createpost" component={CreatePost} />
        <Stack.Screen name="notification" component={Notification} />
        <Stack.Screen name="like" component={Like} />
        <Stack.Screen name="status" component={Status} />
        <Stack.Screen name="AddStory" component={AddStory} />
        <Stack.Screen name="SingleChat" component={SingleChat} />
        <Stack.Screen name="Video" component={Video} />
        <Stack.Screen name="Reels" component={Reels} />
        <Stack.Screen name="Call" component={Call} />
        <Stack.Screen name="NewChat" component={NewChat} />
        <Stack.Screen name="ChatRooms" component={ChatRooms} />
        <Stack.Screen name="AddMembers" component={AddMembers} />
        <Stack.Screen name="SingleChatRoom" component={SingleChatRoom} />
        <Stack.Screen name="ChatRoomCall" component={ChatRoomCall} />
        <Stack.Screen name="ChatRoomCallON" component={ChatRoomCallON} />
        <Stack.Screen name="ChatRoomVideoCall" component={ChatRoomVideoCall} />
        <Stack.Screen name="ChatRoomVideoCallON" component={ChatRoomVideoCallON} />
        <Stack.Screen name="Followers" component={Followers} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="SettingNotification" component={SettingNotification} />
        <Stack.Screen name="Security" component={Security} />
        <Stack.Screen name="LoginActivity" component={LoginActivity} />
        <Stack.Screen name="SavedLogin" component={SavedLogin} />
        <Stack.Screen name="Towfactor" component={Towfactor} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="PersonalInformation" component={PersonalInformation} />
        <Stack.Screen name="Language" component={Language} />
        <Stack.Screen name="Contacts" component={Contacts} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="Terms" component={Terms} />
        <Stack.Screen name="Theme" component={Theme} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Suggestions" component={Suggestions} />
        <Stack.Screen name="ProfilePost" component={ProfilePost} />
        <Stack.Screen name="ProfileReels" component={ProfileReels} />
        <Stack.Screen name="AnotherProfile" component={AnotherProfile} />
        <Stack.Screen name="Save" component={Save} />
        <Stack.Screen name="Savepost" component={SavePost} />
        <Stack.Screen name="SaveReels" component={SaveReels} />
        <Stack.Screen name="TermsOfUse" component={TermsOfUse} />

        {/* Component Screens */}
        <Stack.Screen name="Components" component={Components} />
        <Stack.Screen name="Accordion" component={AccordionScreen} />
        <Stack.Screen name="ActionSheet" component={ActionSheet} />
        <Stack.Screen name="ActionModals" component={ActionModals} />
        <Stack.Screen name="Buttons" component={Buttons} />
        <Stack.Screen name="Badges" component={Badges} />
        <Stack.Screen name="Datepicker" component={Datepicker} />
        <Stack.Screen name="Search2" component={Search2} />
        <Stack.Screen name="Charts" component={Charts} />
        <Stack.Screen name="Headers" component={Headers} />
        <Stack.Screen name="Footers" component={Footers} />
        <Stack.Screen name="TabStyle1" component={TabStyle1} />
        <Stack.Screen name="TabStyle2" component={TabStyle2} />
        <Stack.Screen name="TabStyle3" component={TabStyle3} />
        <Stack.Screen name="TabStyle4" component={TabStyle4} />
        <Stack.Screen name="Inputs" component={Inputs} />
        <Stack.Screen name="lists" component={ListScreen} />
        <Stack.Screen name="Pricings" component={Pricings} />
        <Stack.Screen name="Snackbars" component={Snackbars} />
        <Stack.Screen name="DividerElements" component={DividerElements} />
        <Stack.Screen name="Socials" component={Socials} />
        <Stack.Screen name="Swipeable" component={SwipeableScreen} />
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Tables" component={Tables} />
        <Stack.Screen name="Toggles" component={Toggles} />
        <Stack.Screen name="Nextpage" component={Nextpage} />
        <Stack.Screen name="Music" component={Music} />
        <Stack.Screen name="WriteCaption" component={WriteCaption} />
        <Stack.Screen name="CreateStory" component={CreateStory} />
        <Stack.Screen name="Music2" component={Music2} />
        <Stack.Screen name="AllSong" component={AllSong} />
        <Stack.Screen name="SavedMusic" component={SavedMusic} />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default StackNavigator;