import { View, Text, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { userType } from '../UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const { height } = Dimensions.get('window');

const Home = () => {
  // userId:
  const { userId } = useContext(userType);
  const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
  const navigation = useNavigation();
  const focus = useIsFocused();
  // state array to store the blogs:
  const [blogsArr, setBlogsArr] = useState([]);
  const buttonVisibility = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

  // fetching all the blogs:
  useEffect(() => {
    if (focus) {
      fetchBlogs();
    }
  }, [focus]);

  useEffect(() => {
    console.log("blog array: ", blogsArr);
  }, [blogsArr]);

  // function to retrieve all the blogs from the database:
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${serverUrl}/blogs`);
      if (res.status === 200) {
        setBlogsArr(res.data);
        console.log("checking the res array on Home: ", res.data);
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
      // Scrolling down
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
      // Scrolling up
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
        contentContainerStyle={{ flexGrow: 1, alignItems: "center", paddingVertical: 5 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        {/* Add your blog list rendering here */}
      </ScrollView>
      <Animated.View style={{
        position: 'absolute',
        bottom: 25,
        left: wp("50") - wp("15%"),
        transform: [{ translateY }],
        zIndex: 10
      }}>
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
          <Text style={{ color: 'rgba(29,20,21,1)', fontSize: hp("2.5%"), fontWeight: "600", }}>Post</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Home;
