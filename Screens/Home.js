import { View, Text, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { userType } from '../UserContext'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

const Home = () => {
  // userId:
  const { userId } = useContext(userType);
  console.log("Home: ", userId);
  const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
  const focus = useIsFocused();
  // state array to store the blogs:
  const [blogsArr, setBlogsArr] = useState([]);
  // fetching all the blogs:
  useEffect(() => {
    if (focus) {
      fetchBlogs();
    }
  }, [focus]);
  // function to retrieve all the blogs from the database:
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${serverUrl}/blogs`);
      if (res.status === 200) {
        setBlogsArr(res.data.blogs);
        console.log("checking the res array on Home: ", res.data.blogs);
      }
    }
    catch (err) {
      console.log("error in retrieving the blogs", err);
      alert("Failed to Retrieve Blogs", "Try refreshing the screen");
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(29,20,21,1)" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10, paddingVertical: 5 }}>
        <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home