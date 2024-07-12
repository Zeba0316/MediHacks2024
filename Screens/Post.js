import React, { useLayoutEffect, useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as ImagePicker from 'expo-image-picker';
import { userType } from "../UserContext";
import axios from 'axios';

const Post = () => {
    const { userId, userName, userImage } = useContext(userType);
    const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
    const navigation = useNavigation();
    const [img, setImg] = useState(null);
    const [you, setYou] = useState(true);
    const [anonymous, setAnonymous] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "New Post",
            headerTitleStyle: {
                color: "white",
                fontSize: 20,
                fontWeight: "bold"
            },
            headerLeft: () => (
                <TouchableOpacity style={{ marginRight: 15 }} onPress={() => navigation.goBack()}>
                    <Entypo name="cross" size={30} color="white" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 10 }} onPress={handleSubmit}>
                    <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>Submit</Text>
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: "rgba(40,40,40,0.98)",
            },
        });
    }, [navigation]);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work.');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.6,
        });

        if (!result.canceled) {
            setImg(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();

        if (!trimmedTitle || !trimmedDescription || !img) {
            Alert.alert("Fill all fields", "Please fill the Title and Description!");
            return;
        }

        const formData = new FormData();
        formData.append('image', {
            uri: img,
            name: 'photo.jpg',
            type: 'image/jpeg',
        });
        formData.append('userId', userId);
        formData.append('title', trimmedTitle);
        formData.append('description', trimmedDescription);
        formData.append('isAnonymous', anonymous);

        try {
            const res = await axios.post(`${serverUrl}/postBlog`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.status === 200) {
                setTitle('');
                setDescription('');
                setImg(null);
                Alert.alert("Success", res.data.message);
                navigation.goBack();
            } else {
                Alert.alert("Error in Posting", res.data.message);
            }
        } catch (error) {
            Alert.alert("Error in Posting, Please Try Again Later");
            console.error("Error:", error);
        }
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, backgroundColor: "rgba(29,20,21,1)", paddingVertical: 15, paddingHorizontal: 15, gap: 10 }}
        >
            <View style={{ height: hp("7%"), width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ height: "80%", borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)', borderRadius: 20, justifyContent: "center", alignItems: "center", paddingHorizontal: 15 }}>
                    <Text style={{ color: "rgba(241,195,224,1)", fontSize: 18, fontWeight: "400" }}>{you ? userName : "Anonymous"}</Text>
                </View>
                <View style={{ flexDirection: "row", flex: 1, height: "100%", justifyContent: "flex-end", alignItems: "center", gap: 15 }}>
                    <TouchableOpacity onPress={() => { setYou(true); setAnonymous(false); }} style={{ height: 55, width: 55, justifyContent: "center", alignItems: "center", borderRadius: 100, borderWidth: you ? 2 : 0, borderColor: "rgba(241,195,214,1)", padding: 2, overflow: "hidden" }}>
                        <Image source={{ uri: `${serverUrl}/images/${userImage.name}` }} style={{ height: "85%", width: "85%", resizeMode: "cover",borderRadius:100 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setYou(false); setAnonymous(true); }} style={{ height: 55, width: 55, justifyContent: "center", alignItems: "center", borderRadius: 100, borderWidth: anonymous ? 2 : 0, borderColor: "rgba(241,195,214,1)", padding: 2, overflow: "hidden" }}>
                        <Image source={require('../assets/anonymous.jpg')} style={{ height: "85%", width: "85%", resizeMode: "cover", borderRadius: 100 }} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Title Input */}
            <View style={{ width: "100%", alignSelf: "center", marginTop: 20 }}>
                <Text style={{ color: 'white', fontSize: 21, fontWeight: "600" }}>Title *</Text>
                <TextInput
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 10,
                        padding: 15,
                        color: 'white',
                        fontSize: 18,
                        marginTop: 10
                    }}
                    placeholder="Enter title..."
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={title}
                    onChangeText={setTitle}
                />
            </View>

            {/* Description Textarea */}
            <View style={{ width: "100%", alignSelf: "center", marginTop: 20 }}>
                <Text style={{ color: 'white', fontSize: 21, fontWeight: "600" }}>Description *</Text>
                <TextInput
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 10,
                        padding: 15,
                        color: 'white',
                        fontSize: 18,
                        marginTop: 10,
                        height: 150,
                        textAlignVertical: 'top'
                    }}
                    multiline
                    numberOfLines={4}
                    placeholder="Enter description..."
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={description}
                    onChangeText={setDescription}
                />
            </View>

            {/* Add Image Button */}
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", alignSelf: "center", marginTop: 20 }} onPress={pickImage}>
                <Text style={{ color: "white", fontSize: 18, fontWeight: "600", marginRight: 10 }}>Add an Image</Text>
                <MaterialIcons name="insert-photo" size={hp("5%")} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>

            {/* Display Selected Image */}
            {img && (
                <Image source={{ uri: `${serverUrl}/images/${userImage.name}` }} style={{ height: 160, width: "88%", alignSelf: "center", resizeMode: "cover", borderWidth: 1.5, borderColor: "rgba(241,195,224,1)" }} />
            )}
        </ScrollView>
    );
};

export default Post;
