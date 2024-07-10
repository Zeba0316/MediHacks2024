import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Login from './Login';

const WelcomeScreen = () => {
    // navigation hook
    const navigation =useNavigation();
    useEffect(()=>{
        setTimeout(()=>{
        navigation.navigate("Login");
        },2000)

    },[])

    return (
        <View style={{ flex: 1, backgroundColor: "rgba(29,20,21,1)", justifyContent: "center", alignItems: "center" }}>
            <Image source={require('../assets/welcomelogo.png')} style={{ width: 200, height: 200, resizeMode: "contain",opacity:0.8 }} />
            <Text style={{ color: "rgba(241,194,224,0.70)", fontSize: wp("10%"),opacity:1 }}>MomsConnect</Text>
        </View>
    );
}


export default WelcomeScreen;