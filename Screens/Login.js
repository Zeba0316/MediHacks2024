import { View, Text, TouchableOpacity, TextInput, LayoutAnimation, Animated, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useNavigation } from '@react-navigation/native'
// icons import
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Video } from 'expo-av'
import axios from 'axios'
import { BackdropBlur, BackdropFilter, Blur, BlurMask, Canvas, ColorMatrix, Fill, Image, useImage } from '@shopify/react-native-skia'
const Login = () => {
    // navigation: 
    const navigation = useNavigation();
    // SERVER URL:
    const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;

    const [manageField, setManageField] = useState({
        usernameField: false,
        passField: false,
    })
    const [loginDetails, setloginDetails] = useState({
        username: '',
        pass: '',
    })
    const animatedUser = useRef(new Animated.Value(0)).current;
    const animatedPass = useRef(new Animated.Value(0)).current;

    // Login button press function:
    const sendDetails = async () => {
        const username = loginDetails.username.trim();
        const pass = loginDetails.pass.trim();

        if (!username || !pass) {
            Alert.alert("Fill all fiedls", "All fields are required!");
            return;
        }

        try {
            const res = await axios.post(`${serverUrl}/login`, { username, pass });
            if (res.status === 200) {
                navigation.navigate("Home");
            } else {
                Alert.alert("Error in Signing In", res.data.message);
            }
        } catch (error) {
            Alert.alert("Error in Signing In, Please Try Again Later");
            console.log("error: ", error);
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
                        source={require("../assets/loginbg2.mp4")}
                        rate={1.0}
                        volume={0}
                        isMuted={true}
                        resizeMode="cover"
                        shouldPlay
                        isLooping
                        style={{ height: "100%", width: "100%", zIndex: -2, position: "absolute", top: 0, left: 0, opacity: 0.95 }}
                    />
                    <View style={{ height: "100%", width: "100%", position: "absolute", backgroundColor: "rgba(214,154,156, 0.25)", zIndex: -2 }}></View>
                    <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center", gap: 15, marginTop: hp("7%") }}>
                        {/* Heading */}
                        <Text style={{ color: "white", fontSize: hp("5%"), fontWeight: '400', textShadowColor: 'rgba(255,255,255,0.8)', textShadowRadius: 10 }}>Login</Text>
                        {/* Info Container */}

                        <View style={{ minHeight: hp("26%"), width: "88%", alignItems: "center", backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 15, paddingVertical: "5%", borderWidth: 1.6, borderColor: "rgba(255,255,255,0.37)", gap: 10, position: 'relative', overflow: "hidden" }}>
                            <Canvas style={{ position: "absolute", height: "150%", width: "100%", overflow: "hidden" }}>
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
                                <TextInput onChangeText={text => setloginDetails(prev => ({ ...prev, username: text }))}
                                    value={loginDetails.username}
                                    placeholder='Enter Username ' placeholderTextColor="rgba(255,255,255,0.9)" style={{ height: hp("5%"), width: "85%", color: 'white', borderBottomWidth: 1, borderColor: "white", paddingHorizontal: 10, alignSelf: "center" }} />
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
                                <TextInput secureTextEntry={true} onChangeText={text => setloginDetails(prev => ({ ...prev, pass: text }))} placeholder='Enter Password'
                                    value={loginDetails.pass}
                                    placeholderTextColor="rgba(255,255,255,0.9)" style={{ height: hp("5%"), width: "85%", color: 'white', alignSelf: "center", borderBottomWidth: 1, borderColor: "white", paddingHorizontal: 10, }} />
                            </TouchableOpacity>
                            {/* Button for Register */}
                            <TouchableOpacity
                                onPress={() => { sendDetails(); }}
                                style={{ height: hp("5%"), width: 100, backgroundColor: "rgba(255,255,255,0.9)", justifyContent: "center", alignItems: "center", borderRadius: 7 }}>
                                <Text style={{ color: "rgba(0,0,0,0.4)", fontSize: hp("2%"), fontWeight: '500' }}>Login</Text>
                            </TouchableOpacity>
                            {/* end of the components */}
                        </View>
                        {/* Navigation to Login screen */}
                        <TouchableOpacity onPress={() => { navigation.navigate("Sign-Up") }}>
                            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: hp("2.1%"), fontWeight: "500", textShadowColor: "rgba(255,255,255,0.85)", textShadowRadius: 10 }}>Don't have an account yet?</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default Login