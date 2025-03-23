import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import { openDatabase } from './database/simple_db';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from './screens/SettingsScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    const loadDatabase = async () => {
      try {
        await openDatabase();
        console.log('Banco de dados inicializado com sucesso!');
      } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
      }
    };

    loadDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'Inventário',
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