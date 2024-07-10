import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "../Screens/SignUp";
import Login from "../Screens/Login";
import WelcomeScreen from "../Screens/Welcome";
import Verification from "../Screens/Verification";
import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import WelcomeScreen from '../Screens/Welcome'
import Login from '../Screens/Login'
import SignUp from '../Screens/SignUp'
import Home from '../Screens/Home'

const Navigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Sign-Up"
            component={SignUp}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Verification"
            component={Verification}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};
    const Stack = createNativeStackNavigator();
    return (
        <View style={{ flex: 1 }}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Welcome'>
                    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{
                        headerShown: false
                    }} />
                    <Stack.Screen name="Login" component={Login} options={{
                        headerShown: false
                    }} />
                    <Stack.Screen name="Sign-Up" component={SignUp} options={{
                        headerShown: false
                    }} />
                    <Stack.Screen name="Home" component={Home} options={{
                        headerShown: false
                    }} />
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    )
}

export default Navigation;
