import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import HomeScreen from './HomeScreen';
import { openDatabase } from './database/simple_db';

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
    <View style={styles.container}>
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 