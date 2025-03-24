import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, StatusBar, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/styles'; // Importe os estilos do arquivo styles.ts
import { getAppName, openDatabase, updateAppName } from '../database/simple_db';
import { AppContext } from '../AppContext';
import { useNavigation } from '@react-navigation/native';
import * as Updates from 'expo-updates';

const SettingsScreen: React.FC = () => {
  const { setAppName } = useContext(AppContext);
  const [newAppName, setNewAppName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loadAppName = async () => {
      await openDatabase();
      const storedAppName = await getAppName();
      console.log(`App Name SettingsScreen: ${storedAppName}`);
      setNewAppName(storedAppName);
      setAppName(storedAppName);
    };

    loadAppName();
  }, []);

  const handleSaveAppName = async () => {
    await openDatabase();
    await updateAppName(newAppName);
    setAppName(newAppName);
    Alert.alert('Nome do App', 'O nome do app foi salvo com sucesso! Ao clicar em OK, o app será recarregado!',
      [
        { text: 'OK', onPress: () => {
        Updates.reloadAsync();
      }},
      { text: 'Cancelar', onPress: () => {
        navigation.navigate('Home' as never);
      }}
    ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
        <Text style={styles.label}>Nome do App:</Text>
        <TextInput
          style={styles.input}
          placeholder="Novo nome do App"
          value={newAppName}
          onChangeText={setNewAppName}
        />
        <View style={styles.buttonContainer}>
          <Button mode="contained" buttonColor="#e0daf7" textColor="#000" onPress={handleSaveAppName}>
            Salvar
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen; 