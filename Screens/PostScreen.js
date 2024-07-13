import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect, useLayoutEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// icons:
import { Ionicons } from '@expo/vector-icons';

const PostScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { id, name, userImageName, title, description, isAnonymous, imageSent, imageName } = route.params;
    const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
    const displayedTitle = title.length > 18 ? `${title.substring(0, 18)}...` : title;
    useLayoutEffect(() => {
        navigation.setOptions({
            title: `${displayedTitle}`,
            headerTitleStyle: {
                color: "white",
                fontSize: 20,
                fontWeight: "bold"
            },
            headerLeft: () => (
                <TouchableOpacity style={{ marginRight: 15 }} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-sharp" size={30} color="white" />
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: "rgba(40,40,40,0.98)",
            },
        });
    }, []);
    return (
        <View style={{ flex: 1, backgroundColor: "rgba(29,20,21,1)" }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}>
                <View style={{ minHeight: hp("15%"), width: "90%",marginTop:10 }}>
                    {/* Post creator info */}
                    <View style={{ minHeight: hp("4%"), flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                        <View style={{ height: 37, width: 37, alignItems: "center", justifyContent: "center", borderRadius: 100, backgroundColor: "transparent", borderWidth: 1.8, borderColor: "pink" }}>
                            <Image
                                style={{ height: 30, width: 30, borderRadius: 100, backgroundColor: "lightgrey" }}
                                source={isAnonymous ? require("../assets/anonymous.jpg") : { uri: `${serverUrl}/images/${userImageName}` }}
                            />
                        </View>
                        <Text style={{ color: 'pink', fontSize: 16, fontWeight: "600", marginLeft: 10 }}>
                            {isAnonymous ? "Anonymous" : name}
                        </Text>
                    </View>
                    {/* end of post creator info */}
                    {/* Title */}
                    <Text style={{ color: "white", fontSize: 25, fontWeight: "600", marginBottom: 5 }}>
                        {title}
                    </Text>
                    {/* end of title */}
                    {/* ImagePost */}
                    {imageSent && (
                        <Image
                            style={{ height: 250, width: "100%", borderRadius: 10, backgroundColor: "rgba(255,255,255,0.1)", overflow: "hidden", marginVertical: 10 }}
                            source={{ uri: `${serverUrl}/blogImage/${imageName}` }}
                        />
                    )}
                    {/* Description */}
                    <Text style={{ color: "rgba(255,255,255,0.95)", fontSize: 18.5, marginBottom: 10, fontWeight: "400" }}>
                        {description}
                    </Text>
                    {/* end of description */}
                </View>
                {/* Comment Section */}
                <Text style={{color:"pink",fontSize:23,fontWeight:"500"}}>Comments</Text>
            </ScrollView>
        </View>
    )
}

export default PostScreen