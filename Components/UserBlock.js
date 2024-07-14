import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
// importing icons:
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { userType } from '../UserContext';

const UserBlock = ({ id, name, email, userImage }) => {
    const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { userId } = useContext(userType);
    const [userFriends, setUserFriends] = useState([]);
    const [friendRequest, setFriendRequest] = useState([]);
    const [sentReq, setSentReq] = useState(false);

    useEffect(() => {
        const fetchUserFriends = async () => {
            try {
                const response = await axios.get(`${serverUrl}/friends/${userId}`);
                if (response.status === 200) {
                    setUserFriends(response.data);
                } else {
                    console.log("Error fetching friends:", response.status);
                }
            } catch (err) {
                console.log("Error fetching friends array:", err);
            }
        };

        const fetchFriendRequest = async () => {
            try {
                const response = await axios.get(`${serverUrl}/friend-requests/sent/${userId}`);
                if (response.status === 200) {
                    setFriendRequest(response.data);
                } else {
                    console.log("Error fetching friend requests:", response.status);
                }
            } catch (err) {
                console.log("Error fetching friend requests:", err);
            }
        };

        if (isFocused) {
            fetchUserFriends();
            fetchFriendRequest();
        }
    }, [isFocused]);

    const sendFriendRequest = async (currentUserId, selectedUserId) => {
        const payload = {
            currentUserId: currentUserId,
            selectedUserId: selectedUserId
        };
        try {
            const res = await axios.post(`${serverUrl}/friend-request`, payload);
            console.log("Sent request successfully!");
            setSentReq(true);
        } catch (err) {
            console.log("Error in sending request:", err);
            Alert.alert("Failed to send request", "Check your connection");
        }
    };

    let friendStatus = 'none';
    if (userFriends.includes(id)) {
        friendStatus = 'friend';
    } else if (sentReq || friendRequest.some((friend) => friend._id === id)) {
        friendStatus = 'sent';
    }

    return (
        <View style={{ minHeight: 60, width: "100%", flexDirection: 'row', justifyContent: "flex-end", alignItems: "center", paddingVertical: 7 }}>
            {/* name dp and email */}
            <TouchableOpacity
                onPress={() => { navigation.navigate("UserProfile", { id, name, email, userImage }) }}
                style={{ flex: 1, height: "100%", flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", gap: 15, marginRight: 15 }}>
                <View style={{ justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "pink", borderRadius: 100, padding: 2.5 }}>
                    <Image style={{ height: 45, width: 45, borderRadius: 100, }} source={{ uri: `${serverUrl}/images/${userImage}` }} />
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text style={{ color: "pink", flexShrink: 1, fontSize: 16, fontWeight: "600" }}>{name}</Text>
                    <Text style={{ color: "white", flexShrink: 1, fontSize: 13, fontWeight: "500" }}>{email}</Text>
                </View>
            </TouchableOpacity>
            {/* end of name dp and email */}
            {/* Handshake for friend request */}
            <TouchableOpacity
                onPress={() => friendStatus === 'none' && sendFriendRequest(userId, id)}
                style={{ justifyContent: "center", alignItems: "center", gap: 3, paddingHorizontal: 10 }}>
                <FontAwesome5 name="hands-helping" size={35} color={friendStatus === 'friend' ? "pink" : friendStatus === 'sent' ? "gray" : "white"} />
                <Text style={{ color: "lightgreen", fontSize: 15, fontWeight: "500" }}>{friendStatus === 'friend' ? "Friend" : friendStatus === 'sent' ? "Sent Request" : "Follow"}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default UserBlock;
