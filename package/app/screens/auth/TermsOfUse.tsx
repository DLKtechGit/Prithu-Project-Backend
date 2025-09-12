import React from "react";
import { View, Text, ScrollView, SafeAreaView, Image } from "react-native";
import { useTheme } from "@react-navigation/native";
import { COLORS, FONTS, IMAGES } from "../../constants/theme";
import Button from "../../components/button/Button";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../Navigations/RootStackParamList";
import { GlobalStyleSheet } from "../../constants/styleSheet";
import { LinearGradient } from "expo-linear-gradient";



type Props = StackScreenProps<RootStackParamList, "TermsOfUse">;

const TermsOfUse: React.FC<Props> = ({ navigation,route }) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  return (
    <SafeAreaView style={[GlobalStyleSheet.container, { padding: 0, flex: 1 }]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ backgroundColor: COLORS.secondary, flex: 1 }}>
          {/* 🔹 Top gradient + logo */}
          <View style={{ alignItems: "center" }}>
            <LinearGradient
              colors={["rgba(255, 255, 255, 0.00)", "rgba(255, 255, 255, 0.08)"]}
              style={GlobalStyleSheet.cricleGradient1}
            />
            <LinearGradient
              colors={["rgba(255, 255, 255, 0.00)", "rgba(255, 255, 255, 0.08)"]}
              style={GlobalStyleSheet.cricleGradient2}
            />
            <View style={{ paddingTop: 40, paddingBottom: 20 }}>
              <Image style={{ width: 80, height: 80 }} source={IMAGES.logo} />
            </View>
            <Text style={GlobalStyleSheet.formtitle}>Terms of Use</Text>
            <Text style={GlobalStyleSheet.forndescription}>
              Please read carefully before continuing
            </Text>
          </View>

          {/* 🔹 Main content area */}
          <View style={[GlobalStyleSheet.loginarea, { backgroundColor: colors.card }]}>
            <Text style={{ ...FONTS.h3, color: colors.title, marginBottom: 10 }}>
              1. Acceptance of Terms
            </Text>
           <Text style={{ ...FONTS.font, color: colors.text, marginBottom: 20 }}>
          By accessing or using Prithu, you agree to be bound by these Terms of
          Use and all applicable laws and regulations. If you do not agree with
          any part, you must not use this app.
        </Text>

        <Text style={{ ...FONTS.h3, color: colors.title, marginBottom: 10 }}>
          2. Eligibility
        </Text>
        <Text style={{ ...FONTS.font, color: colors.text, marginBottom: 20 }}>
          You must be at least 13 years old to use this app. By registering, you
          confirm that the information you provide is accurate and truthful.
        </Text>

        <Text style={{ ...FONTS.h3, color: colors.title, marginBottom: 10 }}>
          3. User Conduct
        </Text>
        <Text style={{ ...FONTS.font, color: colors.text, marginBottom: 20 }}>
          You agree not to misuse the app, including but not limited to:
          {"\n"}• Uploading harmful or malicious content.{"\n"}• Harassing,
          bullying, or defaming other users.{"\n"}• Violating intellectual
          property rights.{"\n"}• Attempting to hack or disrupt the service.
        </Text>

        <Text style={{ ...FONTS.h3, color: colors.title, marginBottom: 10 }}>
          4. Privacy
        </Text>
        <Text style={{ ...FONTS.font, color: colors.text, marginBottom: 20 }}>
          Your privacy is important to us. By using this app, you agree to the
          collection and use of your information as outlined in our Privacy
          Policy. We may update our Privacy Policy from time to time.
        </Text>

        <Text style={{ ...FONTS.h3, color: colors.title, marginBottom: 10 }}>
          5. Content Ownership
        </Text>
        <Text style={{ ...FONTS.font, color: colors.text, marginBottom: 20 }}>
          You retain ownership of the content you post. However, by posting on
          Prithu, you grant us a worldwide, non-exclusive, royalty-free license
          to use, distribute, and display that content within the app.
        </Text>

        <Text style={{ ...FONTS.h3, color: colors.title, marginBottom: 10 }}>
          6. Termination
        </Text>
        <Text style={{ ...FONTS.font, color: colors.text, marginBottom: 20 }}>
          We reserve the right to suspend or terminate your access at any time,
          without notice, if we believe you have violated these terms or misused
          the platform.
        </Text>

        <Text style={{ ...FONTS.h3, color: colors.title, marginBottom: 10 }}>
          7. Limitation of Liability
        </Text>
        <Text style={{ ...FONTS.font, color: colors.text, marginBottom: 20 }}>
          Prithu is provided "as is" without warranties of any kind. We are not
          responsible for damages, data loss, or issues arising from your use of
          the app.
        </Text>

        <Text style={{ ...FONTS.h3, color: colors.title, marginBottom: 10 }}>
          8. Updates to Terms
        </Text>
        <Text style={{ ...FONTS.font, color: colors.text, marginBottom: 20 }}>
          We may update these Terms of Use periodically. Continued use of the
          app after changes means you accept the updated terms.
        </Text>

        <Text style={{ ...FONTS.h3, color: colors.title, marginBottom: 10 }}>
          9. Contact Us
        </Text>
        <Text style={{ ...FONTS.font, color: colors.text, marginBottom: 20 }}>
          If you have any questions regarding these Terms, please contact us at
          support@prithu.com.
        </Text>

        <Text style={{ ...FONTS.font, color: colors.text, marginTop: 30 }}>
          By registering or using Prithu, you acknowledge that you have read,
          understood, and agreed to these Terms of Use.
        </Text>

        
        {/* 🔹 Agree button at the bottom */}
        <View style={{ marginTop: 30, backgroundColor:"blue",borderRadius: 20 }}>
          <Button
            title="Agree"
            onPress={() => {
            navigation.navigate("Register", {
            acceptedTerms: true,
              formData: (route.params?.formData || {}),   // 👈 restore old data
              otpSent: route.params?.otpSent || false,
              otpVerified: route.params?.otpVerified || false,
                 });
                 }}/>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsOfUse;
