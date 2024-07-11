import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, Animated } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as atob } from 'base-64';
import axios from 'axios';
import { userType } from '../UserContext';

const WelcomeScreen = () => {
    const navigation = useNavigation();
    const focus = useIsFocused();
    const { userId, setUserId } = useContext(userType);
    const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;

    const [animatedWidth] = useState(new Animated.Value(wp("1%")));
    const [sent, setSent] = useState(null);
    const [profile, setProfile] = useState(null);

    const checkSentVerificationImage = async (userId) => {
        try {
            const res = await axios.get(`${serverUrl}/hasSent/${userId}`);
            if (res.status === 200) {
                setProfile(res.data.profileBuilt);
                setSent(res.data.sentVerificationImage);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("User ID not found for verification image check.");
            } else {
                console.error("Error checking verification image:", error);
            }
            setSent(false);
        }
    };

    const decodeToken = async (token) => {
        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setUserId(decodedToken.userId);
                console.log("Decoding done on welcome screen", decodedToken.userId);
                return decodedToken.userId;
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
        return null;
    };

    useEffect(() => {
        const handleNavigation = async () => {
            // AsyncStorage.clear();
            try {
                const token = await AsyncStorage.getItem("authToken");
                const decodedUserId = await decodeToken(token);
                if (decodedUserId) {
                    await checkSentVerificationImage(decodedUserId);
                } else {
                    navigation.navigate("Login");
                }
            } catch (error) {
                console.error("Error in navigation logic:", error);
            }
        };

        if (focus) {
            console.log("Welcome:", userId);
            animatedWidth.setValue(wp("1%"));
            Animated.timing(animatedWidth, {
                toValue: wp("75%"),
                duration: 1500,
                useNativeDriver: false,
            }).start(() => {
                handleNavigation();
            });
        }
    }, [focus]);

    useEffect(() => {
        if (sent !== null) {
            console.log('val:', sent);
            if (sent) {
                if(profile){
                    navigation.navigate("Home");
                }
                else{
                    navigation.navigate("ProfileBuild");
                }
            } else {
                navigation.navigate("Verification");
            }
            setSent(null);
        }
    }, [sent]);

    return (
        <View style={styles.container}>
            <Image source={require('../assets/welcomelogo.png')} style={styles.logo} />
            <Text style={styles.title}>MomsConnect</Text>
            <Animated.View style={[styles.animatedView, { width: animatedWidth }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(29,20,21,1)",
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: "contain",
        opacity: 0.8,
    },
    title: {
        color: "rgba(241,194,224,0.70)",
        fontSize: wp("10%"),
        opacity: 1,
    },
    animatedView: {
        height: "0.5%",
        backgroundColor: "rgba(241,194,224,0.75)",
        marginTop: 15,
        borderRadius: 100,
    },
});

export default WelcomeScreen;
