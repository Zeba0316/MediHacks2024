import { View, StatusBar, Platform, UIManager } from 'react-native'
import React from 'react'
// safe area
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Navigation component import 
import Navigation from './Navigation/Navigation'

//enabling for smooth layout animation
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const App = () => {
  return (
    <SafeAreaProvider >
      <StatusBar translucent={true} barStyle="light-content" backgroundColor="transparent" />
      <View style={{ flex: 1 }}>
        <Navigation />
      </View>
    </SafeAreaProvider>
  )
}

export default App