import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
// importing icons:
import { Ionicons } from '@expo/vector-icons';

const UserProfile = () => {
  const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
  const navigation = useNavigation();
  const route = useRoute();
  const { id, name, email, userImage } = route.params;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => {
        return (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, }}>
            <TouchableOpacity onPress={() => { navigation.goBack(); }}>
              <Ionicons name="arrow-back-sharp" size={26} color="white" />
            </TouchableOpacity>
            <View style={{ alignItems: "center", justifyContent: "center", borderRadius: 100, borderWidth: 1.3, borderColor: "pink", padding: 3 }}>
              <Image style={{ height: 32, width: 32, borderRadius: 100 }} source={{ uri: `${serverUrl}/images/${userImage}` }} />
            </View>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>{name}</Text>
          </View>
        )
      },
      headerStyle: {
        backgroundColor: "rgba(40,40,40,0.98)",
      },
    })
  }, [])
  return (
    <View style={{ flex: 1 ,backgroundColor:"rgba(29,20,21,1)"}}>
      <Text>UserProfile</Text>
    </View>
  )
}

export default UserProfile