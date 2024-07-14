import { View, Text, Image, TouchableOpacity, Alert, Animated } from 'react-native';
import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
// importing icons:
import { Ionicons } from '@expo/vector-icons';

const UserProfile = () => {
  const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
  const navigation = useNavigation();
  const route = useRoute();
  const { id, name, email, userImage } = route.params;
  const [userData, setUserData] = useState(null);
  const rotateValue = useRef(new Animated.Value(0)).current;
  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-sharp" size={26} color="white" />
          </TouchableOpacity>
          <View style={{ alignItems: "center", justifyContent: "center", borderRadius: 100, borderWidth: 1.3, borderColor: "pink", padding: 3 }}>
            <Image style={{ height: 32, width: 32, borderRadius: 100 }} source={{ uri: `${serverUrl}/images/${userImage}` }} />
          </View>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>{name}</Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: "rgba(40,40,40,0.98)",
      },
    });
  }, []);

  useEffect(() => {
    fetchData();
    startRotationAnimation();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${serverUrl}/userProfileData/${id}`);
      if (response.status === 200) {
        setUserData(response.data.user);
        console.log("res: ", response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Failed to Fetch User Data", "Please try again later.");
    }
  };
  const startRotationAnimation = () => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 5500,
        useNativeDriver: true,
      })
    ).start();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(29,20,21,1)", alignItems: "center", justifyContent: "center", paddingVertical: 10 }}>
      {userData ? (
        <View style={{ flex: 1, width: "90%", alignItems: "center", gap: 10 }}>
          <Text style={{ color: "pink", fontSize: 30, fontWeight: "600" }}>{name}</Text>
          <Text style={{ color: "white", fontSize: 18, marginTop: -8, fontWeight: "500" }}>{email}</Text>
          <View style={{ height: 280, width: "100%", justifyContent: "center", alignItems: "center", borderRadius: 10, borderWidth: 1, borderColor: "transparent", padding: 3.2, overflow: "hidden", position: 'relative' }}>
            <Animated.View style={{
              width: "200%",
              height: "205%",
              left: "-50%",
              top: "-50%",
              borderRadius: 10,
              position: "absolute", transform: [{ rotate: rotateInterpolate }]
            }}>
              <LinearGradient
                style={{ width: "100%", height: "100%" }}
                colors={["rgba(29,20,21,1)", "rgba(29,20,21,1)", "rgba(29,20,21,1)", "rgba(255, 162, 203, 0.8)", "rgba(255, 162, 203, 0.8)", "rgba(29,20,21,1)", "rgba(29,20,21,1)", "rgba(29,20,21,1)"]}
              />
            </Animated.View>
            <Image style={{ height: "100%", width: "100%", borderWidth: 5, borderColor: "rgba(29,20,21,1)", borderRadius: 8, resizeMode: "cover" }} source={{ uri: `${serverUrl}/images/${userImage}` }} />
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Text style={{ color: "white", marginTop: 5, fontSize: 25, fontWeight: "500" }}>Status:</Text>
            <Text style={{ color: "pink", marginTop: 5, fontSize: 25, fontWeight: "500" }}>{userData.pregnancyStatus}</Text>
          </View>
          {userData.pregnancyStatus != "MotherHood" &&
            <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Text style={{ color: "white", fontSize: 19, fontWeight: "500" }}>Due Date:</Text>
                <Text style={{ color: "pink", fontSize: 19, fontWeight: "500" }}>{userData.dueDate.substring(0, 10)}</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Text style={{ color: "white", fontSize: 19, fontWeight: "500" }}>Birth Plan:</Text>
                <Text style={{ color: "pink", fontSize: 19, fontWeight: "500" }}>{userData.birthPlan}</Text>
              </View>
            </View>}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={{ color: 'white', fontSize: 22, fontWeight: "500" }}>Verification:</Text>
            <Text style={{ color: userData.verified ? 'lightgreen' : "red", fontSize: 22, fontWeight: "500" }}>{userData.verified ? "Verified" : "Not Verified"}</Text>
          </View>
        </View>
      ) : (
        <Text style={{ color: "white", fontSize: 18 }}>Loading user data...</Text>
      )
      }
    </View >
  );
};

export default UserProfile;
