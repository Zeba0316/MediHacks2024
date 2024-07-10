import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const WelcomeScreen = () => {
    return (
        <View style={{ flex: 1, backgroundColor: "rgba(29,20,21,1)", justifyContent: "center", alignItems: "center" }}>
            <Image source={require('../assets/welcomelogo.png')} style={{ width: 200, height: 200, resizeMode: "contain",opacity:0.8 }} />
            <Text style={{ color: "lightpink", fontSize: wp("10%"),opacity:0.6 }}>MomsConnect</Text>
        </View>
    );
}


export default WelcomeScreen;