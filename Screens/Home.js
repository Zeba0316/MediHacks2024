import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { userType } from '../UserContext'

const Home = () => {
  // userId:
  const {userId}=useContext(userType);
  console.log(userId);
  return (
    <View>
      <Text>Home</Text>
    </View>
  )
}

export default Home