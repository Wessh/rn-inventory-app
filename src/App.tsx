import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import { openDatabase, getAppName, closeDatabase } from './database/simple_db';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from './screens/SettingsScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppState } from 'react-native';
import { AppProvider } from './AppContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const [appName, setAppName] = useState('');

  useEffect(() => {
    const fetchAppName = async () => {
      try {
        
        await openDatabase();
        const appNameData = await getAppName();
        const name = appNameData ? appNameData : null;
        setAppName(name || 'Inventário');
      } catch (error) {
        setAppName('Inventário');
      }
    };
    fetchAppName();
  }, []);

  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              headerTitle: appName,
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                  <MaterialCommunityIcons name="cog" size={24} color="#000" style={{ marginRight: 15 }} />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configurações' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 