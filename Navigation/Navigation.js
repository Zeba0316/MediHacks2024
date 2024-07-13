
import React from 'react'
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import WelcomeScreen from '../Screens/Welcome'
import Login from '../Screens/Login'
import SignUp from '../Screens/SignUp'
import Verification from "../Screens/Verification";
import ProfileBuild from "../Screens/ProfileBuild";
import Home from '../Screens/Home'
import Post from '../Screens/Post'
import PostScreen from '../Screens/PostScreen'

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
          <Stack.Screen
            name="ProfileBuild"
            component={ProfileBuild}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Home" component={Home} options={{
            headerShown: false
          }} />
          <Stack.Screen name="Post" component={Post} />
          <Stack.Screen name="PostScreen" component={PostScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default Navigation;
