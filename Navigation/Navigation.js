import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SignUp from '../Screens/SignUp'

const Navigation = () => {
    const Stack = createNativeStackNavigator();
    return (
        <View style={{ flex: 1 }}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Sign-Up'>
                    <Stack.Screen name="Sign-Up" component={SignUp} options={{
                        headerShown:false
                    }} />
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    )
}

export default Navigation