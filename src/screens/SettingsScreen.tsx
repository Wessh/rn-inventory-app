import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, StatusBar, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/styles'; // Importe os estilos do arquivo styles.ts

const SettingsScreen = () => {
  const [appName, setAppName] = useState('Inventário'); // Nome padrão do app
  const [newAppName, setNewAppName] = useState(appName);

  const handleSaveAppName = () => {
    // Aqui você pode adicionar a lógica para salvar o novo nome do app
    // Por exemplo, você pode salvar o nome em AsyncStorage ou em um arquivo de configuração
    setAppName(newAppName);
    Alert.alert('Nome do app alterado para: ' + newAppName);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
        <Text style={[styles.title, { textAlign: 'center' }]}>Configurações</Text>
        <Text style={styles.label}>Nome do App:</Text>
        <TextInput
          style={styles.input}
          placeholder="Novo nome do App"
          value={newAppName}
          onChangeText={setNewAppName}
        />
        <View style={styles.buttonContainer}>
          <Button mode="contained" buttonColor="#e0daf7" textColor="#000" onPress={handleSaveAppName}>
            Salvar Nome
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen; 