import { View, Text, KeyboardAvoidingView, ScrollView, TextInput, Pressable, TouchableOpacity, Image, Keyboard } from 'react-native'
import { Entypo, FontAwesome, Feather } from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-selector';
import axios from "axios"
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { userType } from "../UserContext"
import io from 'socket.io-client';

const Message = () => {
  const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
  const navigation = useNavigation();
  const route = useRoute();
  const { friendId, friendImage, friendName } = route.params;
  const [showEmoji, setShowEmoji] = useState(false);
  const [friendData, setFriendData] = useState([]);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const scrollViewRef = useRef();
  const { userId } = useContext(userType);
  const isFocused = useIsFocused();
  const timeStamp = new Date();

  const GetTimeOfMsg = (time) => {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return hours + ":" + minutes;
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-sharp" size={26} color="white" />
          </TouchableOpacity>
          <View style={{ alignItems: "center", justifyContent: "center", borderRadius: 100, borderWidth: 1.3, borderColor: "pink", padding: 3 }}>
            <Image style={{ height: 32, width: 32, borderRadius: 100 }} source={{ uri: `${serverUrl}/images/${friendImage}` }} />
          </View>
          <Text style={{ color: "pink", fontSize: 16, fontWeight: "500" }}>{friendName}</Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: "rgba(40,40,40,0.98)",
      },
    });
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchMessages();
    }
  }, [isFocused]);
  useEffect(() => {
    console.log("current chat friend: ", friendId, " current user : ", userId);
    const fetchFriendData = async () => {
      try {
        const response = await axios.get(`${serverUrl}/friend/${friendId}`);
        setFriendData(response.data);
      }
      catch (err) {
        console.log("error getting the friend data ", err);
      }
    }
    //fetching profile data and scrolling to bottom 
    fetchFriendData();
    scrollToBottom();

    //socket connection 
    const newSocket = io(`${serverUrl}`);
    setSocket(newSocket);

    //keyboard pop ka function 
    const keyBoardActive = Keyboard.addListener('keyboardDidShow', () => {
      setShowEmoji(false);
    })

    //cleanup function listener ko remove karne ke liye and socket disconnect 
    return () => {
      newSocket.disconnect();
      keyBoardActive.remove();
    };
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('message', (data) => {
        if (data.sender == friendId && data.receiver == userId) {
          const time = GetTimeOfMsg(data.timeStamp)
          setMessages((prevMessages) => [...prevMessages, { message: data.message, sentTo: data.senderId, time: time }]);
        }
      });
    }
  }, [socket]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${serverUrl}/messages/${userId}/${friendId}`);
      if (response.status == 200) {
        response.data.forEach(msgData => {
          const time = GetTimeOfMsg(msgData.timeStamp);
          setMessages((prevMessages) => [...prevMessages, { message: msgData.message, sentTo: msgData.receiverId, time: time }])
          console.log(msgData.timeStamp);
        });
      }
      else {
        console.log("error");
      }
    }
    catch (err) {
      console.log(`error fetching the messages ${err}`);
    }

  }

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      const payload = {
        message: messageInput,
        senderId: userId,
        friendId: friendId
      }
      const time = new Date();
      const formattedTime = GetTimeOfMsg(time);
      setMessages((prevMessages) => [...prevMessages, { message: messageInput, sentTo: friendId, time: formattedTime }])
      socket.emit('sendmessage', payload);
      setMessageInput('');
    }
  }

  function handleEmoji() {
    setShowEmoji(!showEmoji);
    Keyboard.dismiss();
  }
  const handleEmojiClick = (emoji) => {
    setMessageInput(prevMessages => prevMessages + emoji);
  }

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd()
    }
  }


  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView style={{ width: "100%", backgroundColor: "rgba(29,20,21,1)", flexDirection: "column", paddingTop: 7 }} ref={scrollViewRef} onContentSizeChange={scrollToBottom}>
        {messages.map((msg, index) => (
          msg.sentTo == friendId ?
            <View key={index} style={{ alignSelf: "flex-end", justifyContent: "center", paddingHorizontal: 11, paddingVertical: 6, backgroundColor: "yellow", maxWidth: "77%", marginBottom: 10, marginRight: 5, borderBottomLeftRadius: 13, borderBottomRightRadius: 15, borderTopLeftRadius: 15 }}>
              <Text style={{ marginRight: "15%", fontSize: 16 }}>{msg.message}</Text>
              <Text style={{ color: "#98979a", fontSize: 12, textAlign: 'right', marginTop: "-4.7%" }}>{msg.time}</Text>

            </View>
            :
            <View key={index} style={{ alignSelf: "flex-start", justifyContent: "center", paddingHorizontal: 11, paddingVertical: 6, backgroundColor: "yellow", maxWidth: "77 %", marginBottom: 10, marginLeft: 5, borderBottomLeftRadius: 15, borderBottomRightRadius: 13, borderTopRightRadius: 15 }}>
              <Text style={{ marginRight: "15%", fontSize: 16 }}>{msg.message}</Text>
              <Text style={{ color: "#98979a", fontSize: 12, textAlign: 'right', marginTop: "-4.7%" }}>{msg.time}</Text>

            </View>

        ))}
      </ScrollView>
      <View style={{ flexDirection: "row", padding: 10, borderTopWidth: 1, borderTopColor: "#dddddd", alignItems: "center", marginBottom: 5 }}>
        <Entypo onPress={handleEmoji} style={{ marginRight: 5 }} name="emoji-happy" size={25} color="#AAA7AD" />
        <TextInput value={messageInput} onChangeText={(text) => setMessageInput(text)} placeholder=" Happy Message.... :) " style={{ flex: 1, height: 40, borderWidth: 1, borderColor: "#dddddd", borderRadius: 22, paddingHorizontal: 10 }} />
        <FontAwesome style={{ marginLeft: 8 }} name="camera" size={25} color="#AAA7AD" />
        <TouchableOpacity onPress={sendMessage}>
          <Feather style={{ marginLeft: 10, borderRadius: 15, backgroundColor: "#dddddd", padding: 9, paddingLeft: 7.5, paddingBottom: 7 }} name="send" size={25} color="gray" />
        </TouchableOpacity>
      </View>
      {showEmoji && (
        <EmojiSelector onEmojiSelected={handleEmojiClick} style={{ height: 280 }} />
      )}
    </KeyboardAvoidingView>
  )
}

export default Message