import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Modal, Platform, StatusBar } from 'react-native';
import { getAllInventory, openDatabase, deleteData, getInventoryByFilters, getAvailableCategories, getAvailableMarcas } from './database/simple_db';
import AddItemModal from './AddItemModal';
import { Picker } from '@react-native-picker/picker';
import { Button, TextInput as PaperTextInput, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import styles from './styles'; // Importe os estilos do arquivo styles.ts
import { Button as PaperButton } from 'react-native-paper';

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
  const [filterQuantity, setFilterQuantity] = useState(0);

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
    setFilterQuantity(0);
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

  const handleFilterIncrement = () => {
    setFilterQuantity(filterQuantity + 1);
  };

  const handleFilterDecrement = () => {
    if (filterQuantity > 0) {
      setFilterQuantity(filterQuantity - 1);
    }
  };

  const handleFilterQuantityChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    const parsedValue = parseInt(numericValue, 10);
    setFilterQuantity(isNaN(parsedValue) ? 0 : parsedValue);
  };

  const clearQuantityFilter = () => {
    setSelectedQuantity('');
    setSelectedQuantityFilter('eq');
    setFilterQuantity(0);
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

                <View style={styles.quantityContainer}>
                  <PaperButton mode="contained" buttonColor="#e0daf7" textColor="#000" onPress={handleFilterDecrement}>-</PaperButton>
                  <TextInput
                    style={styles.quantityInput}
                    value={filterQuantity.toString()}
                    onChangeText={handleFilterQuantityChange}
                    keyboardType="number-pad"
                  />
                  <PaperButton mode="contained" buttonColor="#e0daf7" textColor="#000" onPress={handleFilterIncrement}>+</PaperButton>
                </View>
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
                    setSelectedQuantity(filterQuantity.toString());
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

export default HomeScreen;