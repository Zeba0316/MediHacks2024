import { View, Text, Alert, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import axios from 'axios';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { userType } from "../UserContext";
import UserBlock from '../Components/UserBlock';
import { useIsFocused, useNavigation } from '@react-navigation/native';
// importing icons:
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const ChatHome = () => {
  const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
  const navigation = useNavigation();
  const focus = useIsFocused();
  const { userId, setLogin, login } = useContext(userType);
  const [userArr, setUserArr] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: {
        backgroundColor: "rgba(40,40,40,0.98)",
      },
      headerLeft: () => {
        return (
          <View style={{ height: "100%", width: wp("100%"), flexDirection: 'row', justifyContent: "space-around", alignItems: "center", paddingHorizontal: 15 }}>
            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => { navigation.navigate("FriendReq") }}>
              <Ionicons name="people-sharp" size={30} color="pink" />
              <Text style={{ color: 'white', fontSize: 12 }}>Requests</Text>
            </TouchableOpacity>
            <Text style={{ color: "pink", fontSize: 25, fontWeight: "500" }}>Chat Room</Text>
            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => { navigation.navigate("Friends") }}>
              <MaterialIcons name="chat-bubble" size={30} color="pink" />
              <Text style={{ color: 'white', fontSize: 12 }}>Chat</Text>
            </TouchableOpacity>
          </View>
        )
      }
    })
  }, [])

  useEffect(() => {
    if (focus) {
      if (login) {
        const emptyArr = []
        setUserArr(prev => [...emptyArr]);
        setHasMore(true);
        setPage(1);
        fetchUsers(page, 4).then(async () => {
          console.log("login again");
          await setLogin(false);
        });
      }
    }
  }, [focus])

  useEffect(() => {
    if (!login){
      fetchUsers(page,4);
    }

  }, [page]);

  const fetchUsers = async (page, limit) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/users/${userId}?page=${page}&limit=${limit}`);
      if (res.status === 200) {
        setUserArr((prevUsers) => [...prevUsers, ...res.data.users]);
        setHasMore(res.data.users.length > 0);
      }
    } catch (err) {
      console.log("Error in retrieving Users: ", err);
      Alert.alert("Retrieval Failed", "Please make sure you're connected to some wifi or network");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreUsers = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(29,20,21,1)" }}>
      <Text style={{ color: "pink", fontSize: 25, fontWeight: "500", textAlign: "center", marginBottom: 3, padding: 5, textShadowColor: "rgba(255,255,255,0.6)", textShadowRadius: 8 }}>All Users</Text>
      <FlatList
        data={userArr}
        keyExtractor={(user) => user._id}
        renderItem={({ item }) => (
          <View style={{ width: "92%", alignSelf: "center" }}>
            <UserBlock user={item} id={item._id} name={item.name} email={item.email} userImage={item.image.name} />
          </View>
        )}
        onEndReached={loadMoreUsers}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <ActivityIndicator color={"pink"} size={"large"} />}
      />
    </View>
  );
};

export default ChatHome;
