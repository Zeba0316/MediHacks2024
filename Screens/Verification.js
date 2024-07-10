import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

const Verification = () => {
    const [imageUri, setImageUri] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            mirrorImage: true,
        });

        if (!result.cancelled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleRetake = () => {
        setImageUri(null);
    };

    const handleSubmit = () => {
        if (imageUri) {
            console.log('Submitted:', imageUri);
        } else {
            console.log('No image to submit');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Verify your identity</Text>
            <Text style={styles.instructions}>Put your face in the oval below</Text>
            <View style={styles.oval}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <MaterialIcons name="camera-alt" size={75} color="white" />
                )}
            </View>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
                    <Text style={styles.buttonText}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.captureButton} onPress={pickImage}>
                    <View style={styles.innerCircle} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(29,20,21,1)",
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 20,
        fontWeight: '500',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    instructions: {
        fontSize: 14,
        fontWeight: '400',
        color: 'white',
        marginBottom: 20,
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
