import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { getAllInventory, openDatabase, deleteData } from './database/simple_db';
import AddItemModal from './AddItemModal';

interface InventoryItem {
  id: number;
  nome: string;
  marca: string;
  categoria: string;
  quantidade: number;
}

const HomeScreen = () => {
  const [search, setSearch] = useState('');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      await openDatabase();
      const data = await getAllInventory();
      setInventory(data);
    } catch (error) {
      console.error('Erro ao carregar o inventário:', error);
    }
  };

  const handleAddItem = () => {
    setSelectedItem(null); // Reset selected item when adding a new item
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleItemAdded = () => {
    loadInventory(); // Recarrega os itens após adicionar um novo
  };

  const handleSelectItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleDeleteItem = async (id: number) => {
    Alert.alert(
      "Deletar Item",
      "Tem certeza que deseja deletar este item?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Deletar",
          onPress: async () => {
            try {
              await openDatabase();
              await deleteData(id);
              loadInventory();
            } catch (error) {
              console.error('Erro ao deletar o item:', error);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleSelectItem(item)}>
      <View>
        <Text>Nome: {item.nome}</Text>
        <Text>Marca: {item.marca}</Text>
        <Text>Categoria: {item.categoria}</Text>
        <Text>Quantidade: {item.quantidade}</Text>
      </View>
      <Button title="Deletar" onPress={() => handleDeleteItem(item.id)} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventário</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar item..."
        value={search}
        onChangeText={setSearch}
      />
      <View style={styles.buttonContainer}>
        <Button title="Filtros" onPress={() => Alert.alert('Filtros', 'Implementar filtros de categoria e marca')} />
        <Button title="Adicionar Item" onPress={handleAddItem} />
      </View>
      <FlatList
        data={inventory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <AddItemModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onAddItem={handleItemAdded}
        selectedItem={selectedItem} // Pass the selected item to the modal
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100, // Ajuste a altura aqui
  },
  deleteIcon: {
    fontSize: 20,
    color: 'red',
  },
});

export default HomeScreen; 