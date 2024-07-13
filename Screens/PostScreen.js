import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, Alert, Keyboard } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import axios from 'axios';
// icons:
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { userType } from '../UserContext';

const PostScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { id, name, userImageName, title, description, isAnonymous, imageSent, imageName, userHasLiked } = route.params;
    const { userName } = useContext(userType);
    const [commentsArr, setCommentsArr] = useState([]);
    const [commentInp, setCommentInp] = useState('');
    const [reload, setReload] = useState(false);
    const [userLiked, setUserLiked] = useState(null);
    const scrollRef = useRef(null);
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

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                if (scrollRef.current) {
                    scrollRef.current.scrollToEnd({ animated: true });
                }
            }
        );
        return () => {
            keyboardDidShowListener.remove();
        }
    }, []);

    useEffect(() => {
        if (userLiked === null) {
            console.log("changed the state");
            setUserLiked(userHasLiked);
        }
    }, [])

    const fetchComments = async () => {
        try {
            const res = await axios.get(`${serverUrl}/fetchComments/${id}`);
            if (res.status === 200) {
                setCommentsArr(res.data.commentsArr.comments);
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
                if (scrollRef.current) {
                    scrollRef.current.scrollToEnd({ animated: true });
                }
            }
        }
        catch (err) {
            console.log("Error sending the comment", err);
            Alert.alert("Failed to send comment", "Error sending the comment");
        }
    }

    const handleLike = async (liked, id) => {
        console.log("user has liked:", liked);
        try {
            const res = await axios.post(`${serverUrl}/liked/${id}`, { liked, userName });
            if (res.status === 200) {
                console.log("like field changed!");
                setReload(!reload);
                setUserLiked(!userLiked);
            }
        }
        catch (err) {
            console.log("Error in Liking the Post: ", err);
            Alert.alert("Couldn't Like", "Error in Liking the Post");
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: "rgba(29,20,21,1)", position: 'relative', paddingBottom: 70 }}>
            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}>
                <View style={{ minHeight: hp("15%"), width: "90%", marginTop: 10, }}>
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

                {/* like and comments area */}
                <View style={{ height: 38, width: "92%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 10, marginVertical: 5, overflow: "hidden" }}>
                    {/* Like Button */}
                    <TouchableOpacity
                        onPress={() => { handleLike(userLiked, id) }}
                        style={{
                            height: 38,
                            width: 38,
                            borderRadius: 100,
                            backgroundColor: userLiked ? "rgba(255,182,203,0.85)" : "rgba(255,255,255,0.15)",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 5
                        }}
                    >
                        <Image style={{ width: "50%", height: "50%", resizeMode: "contain", marginTop: 3 }} source={require('../assets/like.png')} />
                    </TouchableOpacity>
                    {/* end of Like button */}
                    <FontAwesome name="comment-o" size={23} color="rgba(255,255,255,0.4)" />
                    <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginLeft: -5 }}>{commentsArr.length}</Text>
                </View>

                {/* Comment Section */}
                {/* Heading Comments */}
                <Text style={{ color: "pink", fontSize: 23, fontWeight: "500", marginBottom: 10 }}>Comments</Text>
                {/* end of heading comment */}
                {/* Comments Container */}
                <View style={{ width: "90%" }}>
                    {commentsArr.length > 0 ?
                        commentsArr.map((comment, index) => (
                            <View key={index} style={{ marginBottom: 12, alignItems: "center", width: "80%" }}>
                                <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "flex-start", marginBottom: 5 }}>
                                    <View style={{ height: 30, width: 30, borderWidth: 0.8, borderRadius: 100, borderColor: "pink", alignItems: "center", justifyContent: "center" }}>
                                        <Image style={{ height: 25, width: 25, borderRadius: 100 }} source={{ uri: `${serverUrl}/images/${userImageName}` }} />
                                    </View>
                                    <Text style={{ color: "pink", fontSize: 14, fontWeight: "500", marginLeft: 10 }}>{comment.user}</Text>
                                </View>
                                <View style={{ width: "85%", backgroundColor: comment.user === name ? "rgba(241,194,224,0.35)" : "rgba(255,255,255,0.25)", paddingVertical: 10, paddingHorizontal: 15, marginLeft: 28, borderRadius: 14, borderTopLeftRadius: 0, }}>
                                    <Text style={{ color: "white", fontSize: 16, fontWeight: "400" }}>{comment.comment}</Text>
                                </View>
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