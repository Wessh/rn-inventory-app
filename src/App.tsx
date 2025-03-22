import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App(): JSX.Element {
let nome = 'João';
let idade = 20;
  return (
    <View style={styles.container}>
      <Text>Tudo é uma mentira</Text>
      <Button 
      title="Clique aqui" 
      onPress={() => 
      alert(`Nome: ${nome} \nIdade: ${idade}`)
      } />
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