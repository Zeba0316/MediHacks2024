
import React from 'react'
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// importing Screens:
import WelcomeScreen from '../Screens/Welcome'
import Login from '../Screens/Login'
import SignUp from '../Screens/SignUp'
import Verification from "../Screens/Verification";
import ProfileBuild from "../Screens/ProfileBuild";
import Home from '../Screens/Home'
import Post from '../Screens/Post'
import PostScreen from '../Screens/PostScreen'
import ChatHome from '../Screens/ChatHome'
import UserProfile from '../Screens/UserProfile'
// importing Icons:
import { Entypo } from '@expo/vector-icons';

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
          <Stack.Screen name="MainTabs" component={TabNavigation} options={{
            headerShown: false
          }} />
          <Stack.Screen name="Post" component={Post} />
          <Stack.Screen name="PostScreen" component={PostScreen} />
          <Stack.Screen name="UserProfile" component={UserProfile} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const TabNavigation = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator initialRouteName='ChatHome'
      screenOptions={{ tabBarShowLabel: false, tabBarStyle: { backgroundColor: "rgba(29,20,21,0.98)" } }}
    >
      <Tab.Screen options={{
        headerShown: false, tabBarIcon: ({ focused }) => {
          return (
            <View style={{ justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
              <Entypo name="home" size={focused ? 32 : 24} color={focused ? "pink" : "grey"} />
              {focused ? null : <Text style={{ fontSize: 12, color: focused ? "pink" : "grey" }}>Home</Text>}
            </View>
          )
        }
      }} name="Home" component={Home} />
      <Tab.Screen options={{
        headerShown: true, tabBarIcon: ({ focused }) => {
          return (
            <View style={{ justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
              <Entypo name="chat" size={focused ? 32 : 24} color={focused ? "pink" : "grey"} />
              {focused ? null : <Text style={{ fontSize: 12, color: focused ? "pink" : "grey" }}>Chat</Text>}
            </View>
          )
        }
      }} name='ChatHome' component={ChatHome} />
    </Tab.Navigator>
  )
}

export default Navigation;
