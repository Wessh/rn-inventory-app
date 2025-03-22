import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { openDatabase, insertData, closeDatabase, dropInventoryTable } from './database/simple_db'; // Importando a conexão com o banco de dados

export default function App(): JSX.Element {
let nome = 'LaParfun';
let marca = 'Pernejo';
let categoria = 'Perfume';

  return (
    <View style={styles.container}>
      <Text>Tudo é uma mentira</Text>
      <Button 
      title="Clique aqui" 
      onPress={async () => {
        await openDatabase();
        await insertData(nome, marca, categoria, 2);
        await dropInventoryTable();
        await closeDatabase();
        }} />
      <StatusBar style="auto" />
    </View>
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