import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { userType } from "../UserContext"
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const Verification = () => {
    // states , context , navigation and server url:
    const serverUrl = process.env.EXPO_PUBLIC_SERVERURL;
    const navigation = useNavigation();
    const { userId, } = useContext(userType);
    const [imageUri, setImageUri] = useState(null);

    console.log("verification screen : ", userId);

    const pickImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
        return;
    };

    const handleRetake = () => {
        setImageUri(null);
    };

    const postImage = async () => {
        const formData = new FormData();
        formData.append("image", {
            uri: imageUri,
            name: 'photo.jpg',
            type: 'image/jpeg',
        });
        formData.append("flag", true);
        const res = await axios.post(`${serverUrl}/verification/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (res.status === 200) {
            console.log("verification image submitted successfully!");
            navigation.navigate("ProfileBuild");
        } else {
            Alert.alert("Error In Submitting Image", res.data.message);
        }
    }

    const handleSubmit = () => {
        if (imageUri) {
            console.log('Submitted:', imageUri);
            postImage();
        } else {
            console.log('No image to submit');
            Alert.alert("Take A Selfie", "Please Take A Selfie To Verify  ")
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, width: "100%", backgroundColor: "rgba(29,20,21,1)", paddingVertical: 30 }}>
            <View style={styles.container}>
                <View style={{ gap: 5 }}>
                    <Text style={{ ...styles.text, marginBottom: 10 }}>Verify your identity</Text>
                    <Text style={styles.instructions}>Make sure your face is clearly visible</Text>
                    <Text style={styles.instructions}>Take a slefie</Text>
                </View>
                <View style={styles.oval}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.image} />
                    ) : (
                        <MaterialIcons name="camera-alt" size={75} color="white" />
                    )}
                </View>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
                        <Text style={styles.buttonText}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.captureButton} onPress={pickImage}>
                        <View style={styles.innerCircle} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(29,20,21,1)",
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    text: {
        fontSize: 25,
        fontWeight: '500',
        color: 'white',
        textAlign: 'center',
        textShadowRadius: 8,
        textShadowColor: 'rgba(255,255,255,0.5)'
    },
    instructions: {
        fontSize: 15,
        fontWeight: '400',
        color: 'white',
        textAlign: 'center',
    },
    oval: {
        width: '60%',
        height: 300,
        borderRadius: 150,
        borderWidth: 2,
        borderColor: 'white',
        backgroundColor: "gray",
        marginBottom: 50,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    retakeButton: {
        width: 100,
        height: 40,
        backgroundColor: 'lightpink',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(29,20,21,1)',
    },
    submitButton: {
        width: 100,
        height: 40,
        backgroundColor: 'lightpink',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});

export default Verification;
