import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BackgroundService from 'react-native-background-actions';
import { requestOverlayPermission } from 'react-native-overlay-permission';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { View, Text, StyleSheet, Alert } from 'react-native';

const Tab = createBottomTabNavigator();

// Background task options
const options = {
  taskName: 'EyeHealth',
  taskTitle: '20-20-20 Rule',
  taskDesc: 'Taking care of your eyes',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'eyehealth://',
  parameters: {
    delay: 1200000, // 20 minutes in milliseconds
  },
};

// Background task
const backgroundTask = async () => {
  await new Promise(async () => {
    while (BackgroundService.isRunning()) {
      await SystemNavigationBar.showOverlay();
      // Show overlay for 20 seconds
      await new Promise(resolve => setTimeout(resolve, 20000));
      await SystemNavigationBar.hideOverlay();
      // Wait for 20 minutes
      await new Promise(resolve => setTimeout(resolve, 1200000));
    }
  });
};

// Timer Screen
function TimerScreen() {
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 1200));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}</Text>
    </View>
  );
}

// Settings Screen
function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
    </View>
  );
}

// Stats Screen
function StatsScreen() {
  return (
    <View style={styles.container}>
      <Text>Statistics</Text>
    </View>
  );
}

function App() {
  useEffect(() => {
    const setupPermissions = async () => {
      try {
        await requestOverlayPermission();
        await BackgroundService.start(backgroundTask, options);
      } catch (e) {
        Alert.alert('Permission Error', 'Please grant all required permissions for the app to work properly.');
      }
    };

    setupPermissions();
    return () => {
      BackgroundService.stop();
    };
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Timer" component={TimerScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});

export default App;