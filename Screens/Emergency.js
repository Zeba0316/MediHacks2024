import React from "react";
import { View, Image, Text, TouchableOpacity, Vibration } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Alert } from "react-native";
import * as SMS from 'expo-sms';

const Emergency = () => {
  const handlePress = () => {
    Vibration.vibrate(500);

    Alert.alert(
      "Send Emergency Message",
      "Are you sure you want to send an emergency message?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: sendEmergencyMessage },
      ],
      { cancelable: false }
    );
  };

  const sendEmergencyMessage = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync(
        ["9717838988","8287770740"], 
        "This is an emergency message from MomsConnect. Please respond immediately!"
      );
      console.log(result);
    } else {
      Alert.alert("SMS is not available on this device");
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(29,20,21,1)",
        alignItems: "center",
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: hp("10%"),
        }}
      >
        <Text
          style={{ color: "lightpink", fontSize: wp("9%"), fontWeight: "bold" }}
        >
          Emergency Alert
        </Text>
      </View>
      <Text
        style={{ color: "lightpink", fontSize: wp("6%"), marginTop: "20%" }}
      >
        Tap the bell to alert
      </Text>
      <TouchableOpacity onPress={handlePress}>
        <Image
          style={{ width: wp("80%"), height: hp("50%") }}
          source={require("../assets/bell.png")}
        />
      </TouchableOpacity>
      <Text
        style={{
          color: "lightpink",
          fontSize: wp("4.5%"),
          marginTop: "5%",
          width: "85%",
        }}
      >
        Your emergency contacts will be alerted. A Text message will be shared
        to them.
      </Text>
      <Text
        style={{ color: "lightpink", fontSize: wp("3.5%"), marginTop: "5%" }}
      >
        Use it wisely!
      </Text>
    </View>
  );
};

export default Emergency;
