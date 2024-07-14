import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';
import FriendReqUser from "../Components/FriendReqUser"
import { userType } from "../UserContext"
import axios from 'axios';

const FriendReq = () => {
  const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
  const navigation = useNavigation();
  const { userId } = useContext(userType);
  const [friendsReqArr, setFriendsReqArr] = useState([])
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => {
        return (
          <View style={{ flexDirection: "row", gap: 10, justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              style={{ marginRight: 15 }} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-sharp" size={30} color="pink" />
            </TouchableOpacity>
            <Text style={{ color: "pink", fontSize: 23, fontWeight: "500" }}>Friend Requests</Text>
          </View>
        )
      }
    })
  }, [])

  useEffect(() => {
    fetchFriendRequest();
  }, [])
  const fetchFriendRequest = async () => {
    try {
      const res = await axios.get(`${serverUrl}/friendsReqData/${userId}`);
      if (res.status === 200) {
        setFriendsReqArr(res.data);
        console.log("friendreq data: ", res.data);
      }
    }
    catch (err) {
      console.log(("Error in fetching friends: ", err));
    }
  }
  return (
    <ScrollView style={{ flexGrow: 1, backgroundColor: "rgba(29,20,21,1)" }}>
      {
        friendsReqArr.map((request, index) => {
          return (
            <FriendReqUser key={index} req={request} reqArr={friendsReqArr} setReqArr={setFriendsReqArr} />
          )
        })
      }
    </ScrollView>
  )
}

export default FriendReq