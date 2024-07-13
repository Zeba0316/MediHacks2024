import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import axios from 'axios';
// icons:
import { Ionicons } from '@expo/vector-icons';

const PostScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { id, name, userImageName, title, description, isAnonymous, imageSent, imageName } = route.params;
    const [commentsArr, setCommentsArr] = useState([]);
    const [commentInp, setCommentInp] = useState('');
    const [reload, setReload] = useState(false);
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

    useEffect(() => {
        fetchComments();
    }, [reload]);

    const fetchComments = async () => {
        try {
            const res = await axios.get(`${serverUrl}/fetchComments/${id}`);
            if (res.status === 200) {
                setCommentsArr(res.data.commentsArr.comments);
                console.log(res.data.commentsArr.comments);
                console.log("Successfully retrieved comments!");
            }
        }
        catch (err) {
            console.log("Error in retrieving the comments: ", err);
        }
    }

    const handleSend = async () => {
        try {
            const trimmedComment = commentInp.trim();
            if (trimmedComment == "") {
                console.log("cant send empty msg");
                return;
            }
            const res = await axios.post(`${serverUrl}/comment/${id}`, { name, userImageName, commentInp: trimmedComment });
            if (res.status === 200) {
                console.log("comment sent successfully!");
                setCommentInp('');
                setReload(!reload);
            }
        }
        catch (err) {
            console.log("Error sending the comment", err);
            Alert.alert("Failed to send comment", "Error sending the comment");
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: "rgba(29,20,21,1)", position: 'relative' }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}>
                <View style={{ minHeight: hp("15%"), width: "90%", marginTop: 10 }}>
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
                {/* Heading Comments */}
                <Text style={{ color: "pink", fontSize: 23, fontWeight: "500" }}>Comments</Text>
                {/* end of heading comment */}
                {/* Comments Container */}
                <View style={{ height: 50, width: "100%", padding: 10 }}>
                    {commentsArr.length > 0 ?
                        commentsArr.map((comment, index) => (
                            <View key={index} style={{ backgroundColor: comment.user == name ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)", padding: 10, gap: 10,marginVertical:10 }}>
                                <View style={{ flexDirection: "row", gap: 10 }}>
                                    <Image style={{ height: 25, width: 25, borderRadius: 100, }} source={{ uri: `${serverUrl}/images/${userImageName}` }} />
                                    <Text style={{ color: "pink", fontSize: 14, fontWeight: "500" }}>{comment.user}</Text>
                                </View>
                                <Text style={{ color: "white", fontSize: 18, fontWeight: "400" }}>{comment.comment}</Text>
                            </View>
                        ))
                        :
                        <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 20, fontWeight: "400", marginTop: 10, alignSelf: "center" }}>Be the first to reply...</Text>
                    }
                </View>
            </ScrollView>
            {/* Type Comment  */}
            <View style={{ height: 50, width: "92%", alignSelf: "center", flexDirection: "row", justifyContent: "center", alignItems: "center", position: "absolute", bottom: 15, zIndex: 10, gap: 15, backgroundColor: "rgba(29,20,21,0.95)", borderRadius: 50 }}>
                <TextInput value={commentInp} onChangeText={text => setCommentInp(text)} placeholder='Message...' placeholderTextColor={"pink"} style={{ color: "pink", fontSize: 16, height: "80%", width: "80%", borderRadius: 50, paddingHorizontal: 15, paddingVertical: 10, borderWidth: 1.2, borderColor: "pink" }} />
                <TouchableOpacity onPress={() => { handleSend(); }}>
                    <Ionicons name="send" size={24} color="pink" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default PostScreen