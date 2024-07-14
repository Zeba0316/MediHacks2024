import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'

// importing icons:
import { Ionicons } from '@expo/vector-icons';


const Message = () => {
  const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
  const navigation = useNavigation();
  const route = useRoute();
  const { friendId, friendImage, friendName } = route.params;

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
          <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>{friendName}</Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: "rgba(40,40,40,0.98)",
      },
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "rgba(29,20,21,1)" }}>

    </ScrollView>
  )
}

export default Message