import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native'
import React, { useContext } from 'react'
import { userType } from "../UserContext"
import axios from 'axios';

const FriendReqUser = ({ req, reqArr, setReqArr }) => {
    const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
    const { userId } = useContext(userType);
    const acceptRequestHandle = async (friendRequestId) => {
        try {
            const payload = {
                senderId: friendRequestId,
                receiverId: userId
            }
            await axios.post(`${serverUrl}/friend-request/accept`, payload).then((res) => {
                setReqArr(reqArr.filter((friend) => friend._id != friendRequestId));
            })
        }
        catch (err) {
            console.log("Error Accepting the friend's request : ", err);
        }
    }
    return (
        <View style={{ minHeight: 60, width: "95%", alignSelf: "center", flexDirection: 'row', justifyContent: "flex-end", alignItems: "center", paddingVertical: 7, marginVertical: 5 }}>
            {/* name dp and email */}
            <View
                style={{ flex: 1, height: "100%", flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", gap: 15, marginRight: 15 }}>
                <View style={{ justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "pink", borderRadius: 100, padding: 2.5 }}>
                    <Image style={{ height: 45, width: 45, borderRadius: 100, }} source={{ uri: `${serverUrl}/images/${req.image.name}` }} />
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text style={{ color: "pink", flexShrink: 1, fontSize: 16, fontWeight: "600" }}>{req.name}</Text>
                    <Text style={{ color: "white", flexShrink: 1, fontSize: 13, fontWeight: "500" }}>{req.email}</Text>
                </View>
            </View>
            {/* end of name dp and email */}
            <TouchableOpacity
                onPress={() => { acceptRequestHandle(req._id) }}
                style={{ borderRadius: 6, backgroundColor: "pink", padding: 10 }}>
                <Text style={{ textAlign: "center", color: "white", fontSize: 16 }}>Accept</Text>
            </TouchableOpacity>
        </View>
    )
}

export default FriendReqUser