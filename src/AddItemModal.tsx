import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Modal } from 'react-native';
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
  const [quantidade, setQuantidade] = useState('');

  useEffect(() => {
    if (visible) {
      if (selectedItem) {
        setNome(selectedItem.nome);
        setMarca(selectedItem.marca);
        setCategoria(selectedItem.categoria);
        setQuantidade(selectedItem.quantidade.toString());
      } else {
        setNome('');
        setMarca('');
        setCategoria('');
        setQuantidade('');
      }
    }
  }, [visible, selectedItem]);

  const handleSaveItem = async () => {
    try {
      if (selectedItem) {
        // Update existing item
        await updateData(selectedItem.id, nome, marca, categoria, parseInt(quantidade, 10));
      } else {
        // Add new item
        await insertData(nome, marca, categoria, parseInt(quantidade, 10));
      }
      onAddItem(); // Chama a função para recarregar os itens
      onClose(); // Fecha o modal
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
          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            value={quantidade}
            onChangeText={setQuantidade}
            keyboardType="numeric"
          />
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
});

export default AddItemModal; 