import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const UserSection = ({ friend }) => {
    const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
    const navigation = useNavigation();
    return (
        <Pressable
            onPress={() => { navigation.navigate("Messages", { friendId: friend._id,friendName:friend.name,friendImage:friend.image.name }) }}
            style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 0.8,
                borderLeftWidth: 0,
                borderTopWidth: 0,
                borderRightWidth: 0,
                borderColor: "#D0D0D0",
                padding: 10
            }}>
                <View style={{borderRadius:100,borderWidth:1.2,borderColor:"pink",justifyContent:"center",alignItems:"center",padding:3}}>
            <Image style={{ borderRadius: 25, width: 45, height: 45, resizeMode: "cover", }} source={{ uri: `${serverUrl}/images/${friend.image.name}` }} />
                </View>
            <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={{ color:"pink",fontSize: 15, fontWeight: 500, marginRight: 3 }}>{friend.name}</Text>
                <Text style={{ color: "gray", fontWeight: 500, marginTop: 3 }}>last msg sent</Text>
            </View>
            <View>
                <Text style={{ fontSize: 12, fontWeight: 400, color: "#585858" }}>5:00 pm</Text>
            </View>
        </Pressable>
    )
}

export default UserSection