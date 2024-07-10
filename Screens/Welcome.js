import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, Animated } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = () => {
    // navigation hook:
    const navigation = useNavigation();

    // for focus:
    const focus = useIsFocused();

    // State for animated value
    const [animatedWidth] = useState(new Animated.Value(wp("1%")));

    useEffect(() => {
        if (focus) {
            // Reset animated value to initial state
            animatedWidth.setValue(wp("1%"));
            // Animate the width from 1% to 80%
            Animated.timing(animatedWidth, {
                toValue: wp("75%"),
                duration: 1500,
                useNativeDriver: false,
            }).start(() => {
                // Navigate to Login screen after the animation ends
                setTimeout(async () => {
                    // AsyncStorage.clear();
                    const token = await AsyncStorage.getItem("authToken");
                    if (token) {
                        navigation.navigate("Home");
                    }
                    else {
                        navigation.navigate("Login");
                    }
                }, 100);
            });
        }
    }, [focus]);

    return (
        <View style={styles.container}>
            <Image source={require('../assets/welcomelogo.png')} style={styles.logo} />
            <Text style={styles.title}>MomsConnect</Text>
            <Animated.View style={[styles.animatedView, { width: animatedWidth }]}></Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(29,20,21,1)",
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: "contain",
        opacity: 0.8
    },
    title: {
        color: "rgba(241,194,224,0.70)",
        fontSize: wp("10%"),
        opacity: 1
    },
    animatedView: {
        height: "0.5%",
        backgroundColor: "rgba(241,194,224,0.75)",
        marginTop: 15,
        marginLeft: 1,
        borderRadius: 100
    }
});

export default WelcomeScreen;
