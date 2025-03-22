import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Modal } from 'react-native';
import { getAllInventory, openDatabase, deleteData, getInventoryByFilters, getAvailableCategories, getAvailableMarcas } from './database/simple_db';
import AddItemModal from './AddItemModal';
import { Picker } from '@react-native-picker/picker';
import { Button, TextInput as PaperTextInput } from 'react-native-paper';

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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMarca, setSelectedMarca] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableMarcas, setAvailableMarcas] = useState<string[]>([]);
  const [filterDialogVisible, setFilterDialogVisible] = useState(false);

  useEffect(() => {
    loadInventory();
    loadFilters();
  }, []);

  const loadInventory = async () => {
    try {
      await openDatabase();
      const data = await getInventoryByFilters(selectedCategory, selectedMarca, selectedQuantity);
      setInventory(data);
    } catch (error) {
      console.error('Erro ao carregar o inventário:', error);
    }
  };

  const loadFilters = async () => {
    try {
      await openDatabase();
      // Assuming you have functions to fetch available categories and marcas
      const categories = await getAvailableCategories();
      const marcas = await getAvailableMarcas();
      setAvailableCategories(categories);
      setAvailableMarcas(marcas);
    } catch (error) {
      console.error('Erro ao carregar os filtros:', error);
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
      <Button mode="contained" onPress={() => handleDeleteItem(item.id)}>Deletar</Button>
    </TouchableOpacity>
  );

  const showFilterDialog = () => setFilterDialogVisible(true);

  const hideFilterDialog = () => setFilterDialogVisible(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Inventário</Text>
        <PaperTextInput
          style={styles.searchInput}
          placeholder="Pesquisar item..."
          value={search}
          onChangeText={setSearch}
          mode="outlined"
        />

        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={showFilterDialog}>Filtros</Button>
          <Button mode="contained" onPress={handleAddItem}>Adicionar Item</Button>
        </View>

        { <View style={styles.filterInfoContainer}>
          {selectedCategory !== '' && (
            <Text>Categoria: {selectedCategory}</Text>
          )}
          {selectedMarca !== '' && (
            <Text>Marca: {selectedMarca}</Text>
          )}
          {selectedQuantity !== '' && (
            <Text>Quantidade: {selectedQuantity}</Text>
          )}
        </View> }

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

        <Modal
          animationType="slide"
          transparent={true}
          visible={filterDialogVisible}
          onRequestClose={hideFilterDialog}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Filtros</Text>
              <Picker
                selectedValue={selectedCategory}
                style={styles.picker}
                onValueChange={(itemValue: string) => {
                  setSelectedCategory(itemValue);
                }}
              >
                <Picker.Item label="Todas as Categorias" value="" />
                {availableCategories.map((category) => (
                  <Picker.Item key={category} label={category} value={category} />
                ))}
              </Picker>

              <Picker
                selectedValue={selectedMarca}
                style={styles.picker}
                onValueChange={(itemValue: string) => {
                  setSelectedMarca(itemValue);
                }}
              >
                <Picker.Item label="Todas as Marcas" value="" />
                {availableMarcas.map((marca) => (
                  <Picker.Item key={marca} label={marca} value={marca} />
                ))}
              </Picker>

              <PaperTextInput
                style={styles.filterTextInput}
                placeholder="Quantidade"
                value={selectedQuantity}
                onChangeText={(text) => {
                  setSelectedQuantity(text);
                }}
                keyboardType="numeric"
                mode="outlined"
              />
              <View style={styles.buttonContainer}>
                <Button onPress={hideFilterDialog}>Cancelar</Button>
                <Button onPress={() => {
                  loadInventory();
                  hideFilterDialog();
                }}>Aplicar</Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
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
    marginBottom: 10,
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
  filterContainer: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  quantityInput: {
    height: 40,
    marginBottom: 10,
  },
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
  filterTextInput: {
    height: 40,
    width: '100%',
    marginBottom: 10,
  },
  filterInfoContainer: {
    marginBottom: 20,
  },
});

export default HomeScreen; 