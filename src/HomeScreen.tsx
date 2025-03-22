import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Modal, Platform, StatusBar } from 'react-native';
import { getAllInventory, openDatabase, deleteData, getInventoryByFilters, getAvailableCategories, getAvailableMarcas } from './database/simple_db';
import AddItemModal from './AddItemModal';
import { Picker } from '@react-native-picker/picker';
import { Button, TextInput as PaperTextInput, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
  const [selectedQuantityFilter, setSelectedQuantityFilter] = useState('eq');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableMarcas, setAvailableMarcas] = useState<string[]>([]);
  const [filterDialogVisible, setFilterDialogVisible] = useState(false);

  useEffect(() => {
    loadInventory();
    loadFilters();
  }, []);

  useEffect(() => {
    loadInventory();
  }, [search, selectedCategory, selectedMarca, selectedQuantity, selectedQuantityFilter]);

  const loadInventory = async () => {
    try {
      await openDatabase();
      const data = await getInventoryByFilters(selectedCategory, selectedMarca, selectedQuantity, selectedQuantityFilter);
      let filteredData = data;
      if (search) {
        filteredData = data.filter(item =>
          item.nome.toLowerCase().includes(search.toLowerCase()) ||
          item.marca.toLowerCase().includes(search.toLowerCase()) ||
          item.categoria.toLowerCase().includes(search.toLowerCase())
        );
      }
      setInventory(filteredData);
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
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.itemInfo} onPress={() => handleSelectItem(item)}>
        <Text style={styles.itemName}>Nome: {item.nome}</Text>
        <Text style={styles.itemDetails}>Marca: {item.marca}</Text>
        <Text style={styles.itemDetails}>Categoria: {item.categoria}</Text>
        <Text style={styles.itemDetails}>Quantidade: {item.quantidade}</Text>
      </TouchableOpacity>
      <View style={styles.itemButtons}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleSelectItem(item)}>
          <MaterialCommunityIcons name="pencil" size={20} color="#3498db" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
          <MaterialCommunityIcons name="trash-can" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const showFilterDialog = () => setFilterDialogVisible(true);

  const hideFilterDialog = () => setFilterDialogVisible(false);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedMarca('');
    setSelectedQuantity('');
    setSelectedQuantityFilter('eq');
    loadInventory();
    hideFilterDialog();
  };

  const clearCategoryFilter = () => {
    setSelectedCategory('');
    loadInventory();
  };

  const clearMarcaFilter = () => {
    setSelectedMarca('');
    loadInventory();
  };

  const clearQuantityFilter = () => {
    setSelectedQuantity('');
    setSelectedQuantityFilter('eq');
    loadInventory();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
          <Text style={[styles.title, { textAlign: 'center' }]}>Inventário</Text>
          <PaperTextInput
            style={styles.searchInput}
            placeholder="Pesquisar item..."
            value={search}
            onChangeText={setSearch}
            mode="outlined"
          />

          <View style={styles.filterContainer}>
            <Button mode="contained" onPress={showFilterDialog} buttonColor="#e0daf7" textColor="#000">Filtros</Button>
            <View style={styles.filterInfoContainer}>
              {selectedCategory !== '' && (
                <View style={styles.filterItemContainer}>
                  <Text style={styles.filterText}>Categoria: {selectedCategory}</Text>
                  <TouchableOpacity onPress={() => clearCategoryFilter()}>
                    <Text style={styles.clearFilterButton}>X</Text>
                  </TouchableOpacity>
                </View>
              )}
              {selectedMarca !== '' && (
                <View style={styles.filterItemContainer}>
                  <Text style={styles.filterText}>Marca: {selectedMarca}</Text>
                  <TouchableOpacity onPress={() => clearMarcaFilter()}>
                    <Text style={styles.clearFilterButton}>X</Text>
                  </TouchableOpacity>
                </View>
              )}
              {selectedQuantity !== '' && (
                <View style={styles.filterItemContainer}>
                  <Text style={styles.filterText}>Quantidade: {selectedQuantity} ({selectedQuantityFilter})</Text>
                  <TouchableOpacity onPress={() => clearQuantityFilter()}>
                    <Text style={styles.clearFilterButton}>X</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <FlatList
            data={inventory}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContentContainer}
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
                  {availableCategories.map((category: string) => (
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
                  {availableMarcas.map((marca: string) => (
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
                <Picker
                  selectedValue={selectedQuantityFilter}
                  style={styles.picker}
                  onValueChange={(itemValue: string) => {
                    setSelectedQuantityFilter(itemValue);
                  }}
                >
                  <Picker.Item label="Igual a" value="eq" />
                  <Picker.Item label="Maior ou igual a" value="gte" />
                  <Picker.Item label="Menor ou igual a" value="lte" />
                </Picker>
                <View style={styles.buttonContainer}>
                  <Button onPress={hideFilterDialog} buttonColor="#e0daf7" textColor="#000">Cancelar</Button>
                  <Button onPress={() => {
                    loadInventory();
                    hideFilterDialog();
                  }} buttonColor="#e0daf7" textColor="#000">Aplicar</Button>
                </View>
                <View style={styles.clearButtonContainer}>
                  <Button onPress={clearFilters} buttonColor="#e0daf7" textColor="#000">Limpar</Button>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        <FAB
          style={[styles.fab, { backgroundColor: '#e0daf7' }]}
          icon="plus"
          onPress={handleAddItem}
          color="#000"
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6fc', // Cor de fundo geral
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#34495e', // Cor do título
  },
  searchInput: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  filterInfoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10,
  },
  filterItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 5,
  },
  filterText: {
    fontSize: 14,
    color: '#34495e',
  },
  clearFilterButton: {
    color: '#e74c3c',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 12, // Diminui o padding
    borderRadius: 8, // Diminui o borderRadius
    marginBottom: 8, // Diminui o marginBottom
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, // Diminui a sombra
    shadowOpacity: 0.1,
    shadowRadius: 2, // Diminui o raio da sombra
    elevation: 2, // Diminui a elevação
    flexDirection: 'row', // Alinha os itens horizontalmente
    justifyContent: 'space-between', // Espaço entre os itens
    alignItems: 'center', // Centraliza verticalmente
    paddingHorizontal: 20, // Adiciona padding horizontal
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16, // Diminui o tamanho da fonte
    fontWeight: 'bold',
    color: '#2c3e50', // Cor do nome do item
    marginBottom: 3, // Diminui o marginBottom
  },
  itemDetails: {
    fontSize: 14, // Diminui o tamanho da fonte
    color: '#7f8c8d', // Cor dos detalhes do item
  },
  itemButtons: {
    flexDirection: 'row',
    alignItems: 'center', // Centraliza verticalmente
    justifyContent: 'flex-end', // Alinha os ícones à direita
  },
  editButton: {
    marginHorizontal: 6, // Diminui a margem
  },
  deleteIcon: {
    fontSize: 20,
    color: 'red',
  },
  listContainer: {
    backgroundColor: '#ecf0f1', // Cor de fundo da lista
    paddingTop: 10,
    borderRadius: 10,
  },
  listContentContainer: {
    paddingBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  clearButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default HomeScreen;