import { View, Text, TouchableOpacity, TextInput, LayoutAnimation, Animated, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
// icons import
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SignUp = () => {
    const [manageField, setManageField] = useState({
        usernameField: false,
        emailField: false,
        passField: false,
    })
    const [signUpDetails, setSignUpDetails] = useState({
        username: null,
        email: null,
        pass: null,
    })
    const animatedUser = useRef(new Animated.Value(0)).current;
    const animatedEmail = useRef(new Animated.Value(0)).current;
    const animatedPass = useRef(new Animated.Value(0)).current;

    useEffect(() => {

    })

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

                    <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center", gap: 15, marginTop: hp("-2.5%") }}>
                        {/* Heading */}
                        <Text style={{ color: "white", fontSize: hp("5%"), fontWeight: '400' }}>Sign Up</Text>
                        {/* Info Container */}
                        <View style={{ minHeight: hp("30%"), width: "88%", alignItems: "center", backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 15, paddingVertical: "5%", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.2)", gap: 10 }}>
                            {/* start of the components */}
                            {/* Username */}
                            <TouchableOpacity style={{ height: manageField.usernameField ? hp("12.5%") : hp("6%"), width: "88%", justifyContent: "flex-start", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, paddingHorizontal: 10, gap: hp("0.1%"), overflow: 'hidden' }}
                                onPress={() => { toggleField("usernameField"); }}
                            >
                                {/* icon and heading */}
                                <Animated.View style={{ height: hp("6%"), flexDirection: 'row', alignItems: "center", gap: 10, transform: [{ translateX: animatedUser }] }}>
                                    <FontAwesome name="user" size={hp("3%")} color="rgba(255,255,255,0.5)" />
                                    <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: hp("2%"), fontWeight: "500" }}>Username</Text>
                                </Animated.View>
                                {/* input area */}
                                <TextInput onChangeText={text => setSignUpDetails(prev => ({ ...prev, username: text }))} placeholder='Enter Username' placeholderTextColor="rgba(255,255,255,0.5)" style={{ height: hp("5%"), width: "85%", color: 'white', borderBottomWidth: 1, borderColor: "grey", paddingHorizontal: 10, alignSelf: "center" }} />
                            </TouchableOpacity>
                            {/* Email */}
                            <TouchableOpacity style={{ height: manageField.emailField ? hp("12.5%") : hp("6%"), width: "88%", justifyContent: "flex-start", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, paddingHorizontal: 10, gap: hp("0.1%"), overflow: 'hidden' }}
                                onPress={() => { toggleField("emailField"); }}
                            >
                                {/* icon and heading */}
                                <Animated.View style={{ height: hp("6%"), flexDirection: 'row', alignItems: "center", gap: 10, transform: [{ translateX: animatedEmail }] }}>
                                    <MaterialCommunityIcons name="email" size={hp("3%")} color="rgba(255,255,255,0.5)" />
                                    <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: hp("2%"), fontWeight: "500" }}>Email</Text>
                                </Animated.View>
                                {/* input area */}
                                <TextInput onChangeText={text => setSignUpDetails(prev => ({ ...prev, email: text }))} placeholder='Enter Email Id' placeholderTextColor="rgba(255,255,255,0.5)" style={{ height: hp("5%"), width: "85%", color: 'white', alignSelf: "center", borderBottomWidth: 1, borderColor: "grey", paddingHorizontal: 10, }} />
                            </TouchableOpacity>
                            {/* Password */}
                            <TouchableOpacity style={{ height: manageField.passField ? hp("12.5%") : hp("6%"), width: "88%", justifyContent: "flex-start", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, paddingHorizontal: 10, gap: hp("0.1%"), overflow: 'hidden' }}
                                onPress={() => { toggleField("passField"); }}
                            >
                                {/* icon and heading */}
                                <Animated.View style={{ height: hp("6%"), flexDirection: 'row', alignItems: "center", gap: 10, transform: [{ translateX: animatedPass }] }}>
                                    <MaterialCommunityIcons name="key" size={hp("3%")} color="rgba(255,255,255,0.5)" />
                                    <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: hp("2%"), fontWeight: "500" }}>Password</Text>
                                </Animated.View>
                                {/* input area */}
                                <TextInput secureTextEntry={true} onChangeText={text => setSignUpDetails(prev => ({ ...prev, pass: text }))} placeholder='Enter Password' placeholderTextColor="rgba(255,255,255,0.5)" style={{ height: hp("5%"), width: "85%", color: 'white', alignSelf: "center", borderBottomWidth: 1, borderColor: "grey", paddingHorizontal: 10, }} />
                            </TouchableOpacity>
                            {/* Button for Register */}
                            <TouchableOpacity style={{ height: hp("5%"), width: 100, backgroundColor: "rgba(255,255,255,0.9)", justifyContent: "center", alignItems: "center", borderRadius: 7 }}>
                                <Text style={{ color: "rgba(0,0,0,0.6)", fontSize: hp("2%"), fontWeight: '500' }}>Sign Up</Text>
                            </TouchableOpacity>
                            {/* end of the components */}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default SignUp