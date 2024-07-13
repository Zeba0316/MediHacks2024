import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated, Image, Alert } from 'react-native';
import { userType } from '../UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// icon
import { FontAwesome } from '@expo/vector-icons';

const Home = () => {
  const { userId, setUserImage, setUserName, userName, userImage } = useContext(userType);
  const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
  const navigation = useNavigation();
  const focus = useIsFocused();
  const buttonVisibility = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const [blogsArr, setBlogsArr] = useState([]);

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
        const reversedBlogs = res.data.blogs.reverse();
        setBlogsArr(reversedBlogs);
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
  const handleLike = async (liked) => {
    try {

    }
    catch (err) {
      console.log("Error in Liking the Post: ", err);
      Alert.alert("Couldn't Like", "Error in Liking the Post");
    }
  }

  const renderBlogItem = ({ item }) => {
    const userHasLiked = item.likes.some(like => like.likedUser === userName);

    return (
      <View style={{ width: "100%", alignItems: "center", marginBottom: 10 }}>
        <TouchableOpacity activeOpacity={0.85} style={{ minHeight: hp("15%"), width: "90%", marginBottom: 10 }}>
          {/* Post creator info */}
          <View style={{ minHeight: hp("6%"), flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <View style={{ height: 52, width: 52, alignItems: "center", justifyContent: "center", borderRadius: 100, backgroundColor: "transparent", borderWidth: 1.8, borderColor: "pink" }}>
              <Image
                style={{ height: 45, width: 45, borderRadius: 100, backgroundColor: "lightgrey" }}
                source={item.isAnonymous ? require("../assets/anonymous.jpg") : { uri: `${serverUrl}/images/${item.userImageName}` }}
              />
            </View>
            <Text style={{ color: 'pink', fontSize: 16, fontWeight: "600", marginLeft: 10 }}>
              {item.isAnonymous ? "Anonymous" : item.name}
            </Text>
          </View>
          {/* end of post creator info */}
          {/* Title */}
          <Text numberOfLines={2} ellipsizeMode='tail' style={{ color: "white", fontSize: 22, fontWeight: "600", marginBottom: 5 }}>
            {item.title}
          </Text>
          {/* end of title */}
          {/* Description */}
          <Text numberOfLines={2} ellipsizeMode='tail' style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, marginBottom: 10 }}>
            {item.description}
          </Text>
          {/* end of description */}
          {/* ImagePost */}
          {item.imageSent && (
            <Image
              style={{ height: 250, width: "100%", borderRadius: 10, backgroundColor: "rgba(255,255,255,0.1)", overflow: "hidden", }}
              source={{ uri: `${serverUrl}/blogImage/${item.image.name}` }}
            />
          )}
        </TouchableOpacity>
        {/* like and comments area */}
        <View style={{ height: 38, width: "92%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 10, marginVertical: 5, overflow: "hidden" }}>
          {/* Like Button */}
          <TouchableOpacity
            onPress={() => { console.log("user has liked? : ", userHasLiked); }}
            style={{
              height: 38,
              width: 38,
              borderRadius: 100,
              backgroundColor: userHasLiked ? "rgba(255,0,0,0.5)" : "rgba(255,255,255,0.15)",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image style={{ width: "50%", height: "50%", resizeMode: "contain", marginTop: 3 }} source={require('../assets/like.png')} />
          </TouchableOpacity>
          {/* end of Like button */}
          {/* Comment Area */}
          <TouchableOpacity activeOpacity={0.75} style={{ height: 35, width: "65%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", borderWidth: 1.5, borderRadius: 50, borderColor: "rgba(255,255,255,0.15)", paddingHorizontal: 3 }}>
            <Image style={{ height: 26, width: 26, borderRadius: 100, borderWidth: 1, borderColor: "grey" }} source={{ uri: `${serverUrl}/images/${item.userImageName}` }} />
            <Text style={{ color: "rgba(255,255,255,0.82)", fontSize: 13.5 }}> Add your reply...</Text>
          </TouchableOpacity>
          <FontAwesome name="comment-o" size={23} color="rgba(255,255,255,0.4)" />
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginLeft: -5 }}>{item.comments.length}</Text>
        </View>
        {/* end of like and comments area */}
        {/* post end line */}
        <View style={{ height: 1.3, width: "100%", backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: 0, marginTop: 5 }}></View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(29,20,21,1)" }}>
      <FlatList
        data={blogsArr}
        renderItem={renderBlogItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 5 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />
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
            backgroundColor: 'pink',
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
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
