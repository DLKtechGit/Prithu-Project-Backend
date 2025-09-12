import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native'
const DashboardScreen = () => {
    const navigation = useNavigation();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f8f9fb", padding: 16 }}>
      
      {/* Header */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "700", color: "#222" }}>
          Creator Dashboard
        </Text>
        <Text style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
          Overview of your performance
        </Text>
      </View>

      {/* Stats Row */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {/* Posts */}
        <View style={styles.card}>
          <FontAwesome5 name="file" size={28} color="#4e73df" />
          <Text style={styles.cardNumber}>120</Text>
          <Text style={styles.cardLabel}>Posts</Text>
        </View>

        {/* Likes */}
        <View style={styles.card}>
          <Ionicons name="heart" size={28} color="#e74a3b" />
          <Text style={styles.cardNumber}>5.2k</Text>
          <Text style={styles.cardLabel}>Likes</Text>
        </View>

        {/* Shares */}
        <View style={styles.card}>
          <MaterialIcons name="share" size={28} color="#1cc88a" />
          <Text style={styles.cardNumber}>1.1k</Text>
          <Text style={styles.cardLabel}>Shares</Text>
        </View>
      </View>

      {/* Most Liked Video */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Most Liked Video</Text>
        <View style={styles.videoCard}>
          <Image
            source={{ uri: "https://picsum.photos/300/200" }}
            style={styles.thumbnail}
          />
          <View style={{ padding: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              Travel Vlog in Bali 🌴
            </Text>
            <Text style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
              3.5k Likes • 20k Views
            </Text>
          </View>
        </View>
      </View>

      {/* Most Watched Video */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Most Watched Video</Text>
        <View style={styles.videoCard}>
          <Image
            source={{ uri: "https://picsum.photos/301/200" }}
            style={styles.thumbnail}
          />
          <View style={{ padding: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              Cooking Masterclass 🍳
            </Text>
            <Text style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
              12k Views • 1.2k Likes
            </Text>
          </View>
        </View>
      </View>

      {/* Create Post Button */}
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('createpost')}>
        <Ionicons name="add-circle-outline" size={22} color="#fff" />
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 }}>
          Create Post
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = {
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
    color: "#222",
  },
  cardLabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#222",
  },
  videoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  thumbnail: {
    width: "100%",
    height: 150,
  },
  createButton: {
    flexDirection: "row",
    backgroundColor: "#4e73df",
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
  },
};

export default DashboardScreen;
