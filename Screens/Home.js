import { View, Text, ScrollView, TouchableOpacity, Animated, Dimensions, Image } from 'react-native';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { userType } from '../UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const Home = () => {
  const { userId, setUserImage, setUserName, userName, userImage } = useContext(userType);
  const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
  const navigation = useNavigation();
  const focus = useIsFocused();
  const [blogsArr, setBlogsArr] = useState([]);

  const buttonVisibility = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (focus) {
      fetchBlogs();
    }
  }, [focus]);

  useEffect(() => {
    if (!userName) {
      fetchUserData();
    }
    console.log("username", userName);
  }, [userName, userImage]);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${serverUrl}/getUserData/${userId}`);
      if (res.status === 200) {
        setUserName(res.data.username);
        setUserImage(res.data.userImage);
        console.log("successfully retrieved user data on home screen");
      }
    } catch (err) {
      console.log("error in getting the user data", err);
      alert("Failed to retrieve data", "please try to reload the app");
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${serverUrl}/blogs`);
      if (res.status === 200) {
        setBlogsArr(res.data.blogs);
        console.log("checking the res array on Home: ", res.data.blogs);
      }
    } catch (err) {
      console.log("error in retrieving the blogs", err);
      alert("Failed to Retrieve Blogs", "Try refreshing the screen");
    }
  };

  const handleScroll = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;

    if (scrollDiff > 0) {
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(buttonVisibility, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(buttonVisibility, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    lastScrollY.current = currentScrollY;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(29,20,21,1)" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, alignItems: "center", gap: 5, paddingVertical: 5 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        {
          blogsArr.map((blog, index) => {
            return (
              <View key={index} style={{ minHeight: hp("20%"), width: "90%", backgroundColor: "grey" }}>
                {/* post creater info */}
                <View style={{ height: hp("7%"), width: "100%", flexDirection: "row", gap: 10, alignItems: "center" }}>
                  <Image style={{ height: 50, width: 50, borderRadius: 100, backgroundColor: "lightgrey" }} source={blog.isAnonymous?require("../assets/anonymous.jpg"):{uri:`${serverUrl}/images/${blog.userImageName}`}} />
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: "500" }}>{blog.name}</Text>
                </View>
                {/* end of post creater info */}
              </View>
            )
          })
        }
      </ScrollView>
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 25,
          left: wp("50%") - wp("15%"),
          transform: [{ translateY }],
          zIndex: 10
        }}
      >
        <TouchableOpacity
          style={{
            height: hp("6.2%"),
            width: wp("30%"),
            backgroundColor: 'rgba(241,185,224,1)',
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onPress={() => { navigation.navigate("Post") }}
        >
          <Text style={{ color: 'rgba(29,20,21,1)', fontSize: hp("2.5%"), fontWeight: "600" }}>Post</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Home;
