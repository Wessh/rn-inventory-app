import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, Alert } from 'react-native';
import { insertData, updateData } from '../database/simple_db';
import { Button } from 'react-native-paper';
import styles from '../styles/styles'; // Importe os estilos do arquivo styles.ts

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
        
        if (result && (result as any).id) {
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
                  const newQuantity = (result as any).quantidade + quantidade;
                  await updateData((result as any).id, trimmedNome, trimmedMarca, trimmedCategoria, newQuantity);
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
            <Button mode="contained" buttonColor="#e0daf7" textColor="#000" onPress={handleDecrement}>-</Button>
            <TextInput
              style={styles.quantityInput}
              value={quantidade.toString()}
              onChangeText={handleQuantidadeChange}
              keyboardType="number-pad"
            />
            <Button mode="contained" buttonColor="#e0daf7" textColor="#000" onPress={handleIncrement}>+</Button>
          </View>
          <View style={styles.buttonContainer}>
            <Button mode="contained" buttonColor="#e0daf7" textColor="#000" onPress={handleSaveItem}>Salvar</Button>
            <Button mode="contained" buttonColor="#e0daf7" textColor="#000" onPress={onClose}>Cancelar</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddItemModal; 