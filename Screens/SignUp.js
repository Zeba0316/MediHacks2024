import { View, Text, TouchableOpacity, TextInput, LayoutAnimation, Animated, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { Video } from 'expo-av'
import * as ImagePicker from 'expo-image-picker';
import { BackdropBlur, BackdropFilter, Blur, BlurMask, Canvas, ColorMatrix, Fill, Image, useImage } from '@shopify/react-native-skia'
// icons import
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const SignUp = () => {
    // navigation 
    const navigation = useNavigation();
    // SERVER URL:
    const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;

    const [manageField, setManageField] = useState({
        usernameField: false,
        emailField: false,
        passField: false,
    })
    const [signUpDetails, setSignUpDetails] = useState({
        username: '',
        email: '',
        pass: '',
        img: ''
    })
    const animatedUser = useRef(new Animated.Value(0)).current;
    const animatedEmail = useRef(new Animated.Value(0)).current;
    const animatedPass = useRef(new Animated.Value(0)).current;

    // signUp button press function:
    const sendDetails = async () => {
        const username = signUpDetails.username.trim();
        const email = signUpDetails.email.trim();
        const pass = signUpDetails.pass.trim();
        const img = signUpDetails.img;

        if (!username || !email || !pass || !img) {
            Alert.alert("Fill all fiedls", "All fields are required!");
            return;
        }
        const formData = new FormData();
        formData.append('image', {
            uri: img,
            name: 'photo.jpg',
            type: 'image/jpeg',
        });
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', pass);

        try {
            const res = await axios.post(`${serverUrl}/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.status === 200) {
                setSignUpDetails({ username: '', email: '', pass: '', img: '' });
                Keyboard.dismiss();
                Alert.alert("Success", res.data.message);
            } else {
                Alert.alert("Error In Sign Up", res.data.message);
            }
        } catch (error) {
            Alert.alert("Error in Signing up, Please Try Again Later");
            console.log("error: ", error);
        }
    }

    //Image Pick Function:
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
            if (result.assets && result.assets.length > 0) {
                setSignUpDetails(prev => ({ ...prev, img: result.assets[0].uri }));
            } else {
                console.log("No assets found in the result");
                Alert.alert("Error", "No image selected. Please try again.");
            }
        }
    }

    // toggle field select function:
    const toggleField = (fieldname) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setManageField(prev => { return { ...prev, [fieldname]: !prev[fieldname] } });
        // for Username animation
        if (fieldname == "usernameField") {
            if (!manageField.usernameField) {
                Animated.timing(animatedUser, {
                    toValue: wp("19%"),
                    duration: 400,
                    useNativeDriver: true
                }).start();
            }
            else {
                Animated.timing(animatedUser, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true
                }).start();
            }
        }
        // for email animation
        if (fieldname == "emailField") {
            if (!manageField.emailField) {
                Animated.timing(animatedEmail, {
                    toValue: wp("22.5%"),
                    duration: 400,
                    useNativeDriver: true
                }).start();
            }
            else {
                Animated.timing(animatedEmail, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true
                }).start();
            }
        }
        // for Password animation
        if (fieldname == "passField") {
            if (!manageField.passField) {
                Animated.timing(animatedPass, {
                    toValue: wp("20%"),
                    duration: 400,
                    useNativeDriver: true
                }).start();
            }
            else {
                Animated.timing(animatedPass, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true
                }).start();
            }
        }
    }
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    }

    return (
        <SafeAreaView style={{ flex: 1, width: "100%", backgroundColor: 'black' }}>
            <TouchableWithoutFeedback onPress={() => { dismissKeyboard(); }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    {/* Background Video */}
                    <Video
                        source={require("../assets/videoBgmother.mp4")}
                        rate={1.0}
                        volume={0}
                        isMuted={true}
                        resizeMode="cover"
                        shouldPlay
                        isLooping
                        style={{ height: "100%", width: "100%", zIndex: -2, position: "absolute", top: 0, left: 0, opacity: 0.95 }}
                    />
                    <View style={{ height: "100%", width: "100%", position: "absolute", backgroundColor: "rgba(29,20,21,0.2)", zIndex: -2 }}></View>
                    <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center", gap: 15, marginTop: hp("4%") }}>
                        {/* Heading */}
                        <Text style={{ color: "white", fontSize: hp("5%"), fontWeight: '400', textShadowColor: 'rgba(255,255,255,0.8)', textShadowRadius: 10 }}>Sign Up</Text>
                        {/* Info Container */}

                        <View style={{ minHeight: hp("33%"), width: "88%", alignItems: "center", backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 15, paddingVertical: "5%", borderWidth: 1.6, borderColor: "rgba(255,255,255,0.37)", gap: 10, position: 'relative', overflow: "hidden" }}>
                            <Canvas style={{ position: "absolute", height: "120%", width: "100%", overflow: "hidden" }}>
                                <BackdropBlur blur={5} clip={{ x: 0, y: 0, width: 656, height: 628 }}>
                                    <Fill color="rgba(0,0,0, 0.1)" />
                                </BackdropBlur>
                            </Canvas>
                            {/* start of the components */}
                            {/* Username */}
                            <TouchableOpacity style={{ height: manageField.usernameField ? hp("12.5%") : hp("6%"), width: "88%", justifyContent: "flex-start", backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 10, paddingHorizontal: 10, gap: hp("0.1%"), overflow: 'hidden' }}
                                onPress={() => { toggleField("usernameField"); }}
                            >
                                {/* icon and heading */}
                                <Animated.View style={{ height: hp("6%"), flexDirection: 'row', alignItems: "center", gap: 10, transform: [{ translateX: animatedUser }] }}>
                                    <FontAwesome name="user" size={hp("3%")} color="rgba(255,255,255,1)" />
                                    <Text style={{ color: "rgba(255,255,255,1)", fontSize: hp("2%"), fontWeight: "500", textShadowColor: "rgba(255,255,255,0.8)", textShadowRadius: 10 }}>Username</Text>
                                </Animated.View>
                                {/* input area */}
                                <TextInput onChangeText={text => setSignUpDetails(prev => ({ ...prev, username: text }))}
                                    value={signUpDetails.username}
                                    placeholder='Enter Username' placeholderTextColor="rgba(255,255,255,0.9)" style={{ height: hp("5%"), width: "85%", color: 'white', borderBottomWidth: 1, borderColor: "white", paddingHorizontal: 10, alignSelf: "center" }} />
                            </TouchableOpacity>
                            {/* Email */}
                            <TouchableOpacity style={{ height: manageField.emailField ? hp("12.5%") : hp("6%"), width: "88%", justifyContent: "flex-start", backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 10, paddingHorizontal: 10, gap: hp("0.1%"), overflow: 'hidden' }}
                                onPress={() => { toggleField("emailField"); }}
                            >
                                {/* icon and heading */}
                                <Animated.View style={{ height: hp("6%"), flexDirection: 'row', alignItems: "center", gap: 10, transform: [{ translateX: animatedEmail }] }}>
                                    <MaterialCommunityIcons name="email" size={hp("3%")} color="rgba(255,255,255,1)" />
                                    <Text style={{ color: "rgba(255,255,255,1)", fontSize: hp("2%"), fontWeight: "500", textShadowColor: "rgba(255,255,255,0.8)", textShadowRadius: 10 }}>Email</Text>
                                </Animated.View>
                                {/* input area */}
                                <TextInput onChangeText={text => setSignUpDetails(prev => ({ ...prev, email: text }))}
                                    value={signUpDetails.email}
                                    placeholder='Enter Email Id' placeholderTextColor="rgba(255,255,255,0.9)" style={{ height: hp("5%"), width: "85%", color: 'white', alignSelf: "center", borderBottomWidth: 1, borderColor: "white", paddingHorizontal: 10, }} />
                            </TouchableOpacity>
                            {/* Password */}
                            <TouchableOpacity style={{ height: manageField.passField ? hp("12.5%") : hp("6%"), width: "88%", justifyContent: "flex-start", backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 10, paddingHorizontal: 10, gap: hp("0.1%"), overflow: 'hidden' }}
                                onPress={() => { toggleField("passField"); }}
                            >
                                {/* icon and heading */}
                                <Animated.View style={{ height: hp("6%"), flexDirection: 'row', alignItems: "center", gap: 10, transform: [{ translateX: animatedPass }] }}>
                                    <MaterialCommunityIcons name="key" size={hp("3%")} color="rgba(255,255,255,1)" />
                                    <Text style={{ color: "rgba(255,255,255,1)", fontSize: hp("2%"), fontWeight: "500", textShadowColor: "rgba(255,255,255,0.8)", textShadowRadius: 10 }}>Password</Text>
                                </Animated.View>
                                {/* input area */}
                                <TextInput secureTextEntry={true} onChangeText={text => setSignUpDetails(prev => ({ ...prev, pass: text }))}
                                    value={signUpDetails.pass}
                                    placeholder='Enter Password' placeholderTextColor="rgba(255,255,255,0.9)" style={{ height: hp("5%"), width: "85%", color: 'white', alignSelf: "center", borderBottomWidth: 1, borderColor: "white", paddingHorizontal: 10, }} />
                            </TouchableOpacity>
                            {/* Image selection */}
                            <View style={{ height: hp("6%"), width: "85%", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", overflow: 'hidden', gap: 10 }}>
                                <TouchableOpacity onPress={() => { pickImage(); }}>
                                    <MaterialIcons name="insert-photo" size={hp("5%")} color="rgba(255,255,255,0.9)" />
                                </TouchableOpacity>
                                <Text style={{ color: "rgba(255,255,255,1)", fontSize: hp("2%"), fontWeight: "500", textShadowColor: "rgba(255,255,255,0.8)", textShadowRadius: 10 }}>Choose Your Image</Text>
                                {signUpDetails.img && <FontAwesome name="check" size={hp("3%")} color="rgba(0,215,0,0.85)" style={{marginLeft:"auto"}} />}
                            </View>
                            {/* Button for Register */}
                            <TouchableOpacity
                                onPress={() => { sendDetails(); }}
                                style={{ height: hp("5%"), width: 100, backgroundColor: "rgba(255,255,255,0.9)", justifyContent: "center", alignItems: "center", borderRadius: 7 }}>
                                <Text style={{ color: "rgba(0,0,0,0.4)", fontSize: hp("2%"), fontWeight: '500' }}>Sign Up</Text>
                            </TouchableOpacity>
                            {/* end of the components */}
                        </View>
                        {/* Navigation to Login screen */}
                        <TouchableOpacity onPress={() => { navigation.navigate("Login") }}>
                            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: hp("2.1%"), fontWeight: "500", textShadowColor: "rgba(255,255,255,0.85)", textShadowRadius: 10 }}>Already have an account?</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default SignUp