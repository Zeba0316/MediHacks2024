import { View, Text, Alert, FlatList } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import axios from 'axios';
import { userType } from "../UserContext";
import UserBlock from '../Components/UserBlock';
import { useNavigation } from '@react-navigation/native';

const ChatHome = () => {
  const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
  const navigation = useNavigation();
  const { userId } = useContext(userType);
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
          <></>
        )
      }
    })
  }, [])

  useEffect(() => {
    fetchUsers(page, 10);
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
        ListFooterComponent={loading && <Text style={{ color: 'white', textAlign: 'center' }}>Loading...</Text>}
      />
    </View>
  );
};

export default ChatHome;
