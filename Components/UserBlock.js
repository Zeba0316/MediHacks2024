import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
// importing icons:
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const UserBlock = ({ id, name, email, userImage }) => {
    const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
    const navigation = useNavigation();
    useEffect(() => {

    }, [])
    return (
        <View style={{ minHeight: 60, width: "100%", flexDirection: 'row', justifyContent: "flex-end", alignItems: "center", paddingVertical: 7 }}>
            {/* name dp and email */}
            <TouchableOpacity
                onPress={() => { navigation.navigate("UserProfile", {id,name,email,userImage}) }}
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
            <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", gap: 3, paddingHorizontal: 10 }}>
                <FontAwesome5 name="hands-helping" size={35} color="pink" />
                <Text style={{ color: "lightgreen", fontSize: 15, fontWeight: "500" }}>Friend</Text>
            </TouchableOpacity>
        </View>
    )
}

export default UserBlock