import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';
import UserSection from "../Components/UserSection"
import { userType } from "../UserContext"
import axios from 'axios';

const Friends = () => {
    const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
    const navigation = useNavigation();
    const { userId } = useContext(userType);
    const [friendsArr, setFriendsArr] = useState([])
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
                        <Text style={{ color: "pink", fontSize: 23, fontWeight: "500" }}>Friends</Text>
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
            const res = await axios.get(`${serverUrl}/friends/${userId}`);
            if (res.status === 200) {
                setFriendsArr(res.data);
                console.log("friend data: ", res.data);
            }
        }
        catch (err) {
            console.log(("Error in fetching friends: ", err));
        }
    }
    return (
        <ScrollView style={{ flexGrow: 1, backgroundColor: "rgba(29,20,21,1)" }}>
            {
                friendsArr.map((friend, index) => {
                    return (
                        <UserSection key={index} friend={friend} />
                    )
                })
            }
        </ScrollView>
    )
}

export default Friends