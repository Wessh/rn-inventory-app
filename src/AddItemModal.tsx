import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, Alert } from 'react-native';
import { insertData, updateData } from './database/simple_db';
import { Button } from 'react-native-paper';

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAddItem: () => void;
  selectedItem: {
    id: number;
    nome: string;
    marca: string;
    categoria: string;
    quantidade: number;
  } | null;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ visible, onClose, onAddItem, selectedItem }) => {
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [quantidade, setQuantidade] = useState(0);

  useEffect(() => {
    if (visible) {
      if (selectedItem) {
        setNome(selectedItem.nome);
        setMarca(selectedItem.marca);
        setCategoria(selectedItem.categoria);
        setQuantidade(selectedItem.quantidade);
      } else {
        setNome('');
        setMarca('');
        setCategoria('');
        setQuantidade(0);
      }
    }
  }, [visible, selectedItem]);

  const handleIncrement = () => {
    setQuantidade(quantidade + 1);
  };

  const handleDecrement = () => {
    if (quantidade > 0) {
      setQuantidade(quantidade - 1);
    }
  };

  const handleQuantidadeChange = (text: string) => {
    // Remove caracteres não numéricos
    const numericValue = text.replace(/[^0-9]/g, '');
    // Converte para número
    const parsedValue = parseInt(numericValue, 10);
  
    // Define o estado, garantindo que seja um número ou 0 se não for válido
    setQuantidade(isNaN(parsedValue) ? 0 : parsedValue);
  };

  const handleSaveItem = async () => {
    if (!nome || !marca || !categoria) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const trimmedNome = nome.trim();
    const trimmedMarca = marca.trim();
    const trimmedCategoria = categoria.trim();

    try {
      if (selectedItem) {
        // Se selectedItem existe, estamos editando um item existente
        await updateData(selectedItem.id, trimmedNome, trimmedMarca, trimmedCategoria, quantidade);
        onAddItem(); // Chama a função para recarregar os itens
        onClose(); // Fecha o modal
      } else {
        // Se selectedItem não existe, estamos adicionando um novo item
        const result = await insertData(trimmedNome, trimmedMarca, trimmedCategoria, quantidade);
        
        if (result && result.id) {
          // Item duplicado encontrado
          Alert.alert(
            'Item Duplicado',
            'Já existe um item com as mesmas características. Deseja somar a quantidade digitada com a quantidade existente?',
            [
              {
                text: 'Cancelar',
                style: 'cancel',
              },
              {
                text: 'Somar',
                onPress: async () => {
                  const newQuantity = result.quantidade + quantidade;
                  await updateData(result.id, trimmedNome, trimmedMarca, trimmedCategoria, newQuantity);
                  onAddItem();
                  onClose();
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          onAddItem(); // Chama a função para recarregar os itens
          onClose(); // Fecha o modal
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar/atualizar item:', error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{selectedItem ? 'Editar Item' : 'Adicionar Item'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            style={styles.input}
            placeholder="Marca"
            value={marca}
            onChangeText={setMarca}
          />
          <TextInput
            style={styles.input}
            placeholder="Categoria"
            value={categoria}
            onChangeText={setCategoria}
          />
          <View style={styles.quantityContainer}>
            <Button mode="contained" onPress={handleDecrement}>-</Button>
            <TextInput
              style={styles.quantityInput}
              value={quantidade.toString()}
              onChangeText={handleQuantidadeChange}
              keyboardType="number-pad"
            />
            <Button mode="contained" onPress={handleIncrement}>+</Button>
          </View>
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleSaveItem}>Salvar</Button>
            <Button mode="contained" onPress={onClose}>Cancelar</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  quantityInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: 60,
    textAlign: 'center',
  },
});

export default AddItemModal; 