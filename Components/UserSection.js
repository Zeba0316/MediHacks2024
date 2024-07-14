import { View, Text, Pressable, Image, Vibration } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { userType } from "../UserContext";
import axios from "axios";

const UserSection = ({ friend }) => {
  const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
  const navigation = useNavigation();
  const { userId } = useContext(userType);
  const [lastMsg, setLastMsg] = useState("");
  const isFocused = useIsFocused();

  const GetTimeOfMsg = (time) => {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return hours + ":" + minutes;
  }

  const fetchLastMsg = async () => {
    try {
      const res = await axios.get(`${serverUrl}/messages/${userId}/${friend._id}`);
      const n = res.data.length;
      if (n != 0) {
        setLastMsg(res.data[n - 1]);
      } else {
        setLastMsg("No Last Message");
      }
    } catch (error) {
      console.error("Error fetching last message:", error);
    }
  }

  useEffect(() => {
    if (isFocused) {
      fetchLastMsg();
    }
  }, [isFocused]);

  return (
    <Pressable
      onPress={() => { navigation.navigate("Messages", { friendId: friend._id, friendName: friend.name, friendImage: friend.image.name }); Vibration.vibrate(50); }}
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
      <View style={{ borderRadius: 100, borderWidth: 1.2, borderColor: "pink", justifyContent: "center", alignItems: "center", padding: 3 }}>
        <Image style={{ borderRadius: 25, width: 45, height: 45, resizeMode: "cover" }} source={{ uri: `${serverUrl}/images/${friend.image.name}` }} />
      </View>
      <View style={{ flex: 1, paddingLeft: 10 }}>
        <Text style={{ color: "pink", fontSize: 15, fontWeight: 500, marginRight: 3 }}>{friend.name}</Text>
        <Text style={{ color: "gray", fontWeight: 500, marginTop: 3 }}>{lastMsg?.message || "No Last Message"}</Text>
      </View>
      <View>
        <Text style={{ fontSize: 12, fontWeight: 400, color: "#585858" }}>{lastMsg.timeStamp ? GetTimeOfMsg(lastMsg.timeStamp) : "---"}</Text>
      </View>
    </Pressable>
  )
}

export default UserSection;
