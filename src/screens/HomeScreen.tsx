import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Platform, StatusBar, Modal } from 'react-native';
import { getAllInventory, openDatabase, deleteData, getInventoryByFilters, getAvailableCategories, getAvailableMarcas, getAppName } from '../database/simple_db';
import AddItemModal from '../modals/AddItemModal';
import { Picker } from '@react-native-picker/picker';
import { Button, TextInput, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import styles from '../styles/styles'; // Importe os estilos do arquivo styles.ts
import { Button as PaperButton } from 'react-native-paper';
import SettingsScreen from './SettingsScreen';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AppContext } from '../AppContext';

interface InventoryItem {
  id: number;
  nome: string;
  marca: string;
  categoria: string;
  quantidade: number;
}

const HomeScreen: React.FC = () => {
  const { appName } = useContext(AppContext);
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedMarca, setSelectedMarca] = useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = useState<string>('');
  const [selectedQuantityFilter, setSelectedQuantityFilter] = useState<string>('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableMarcas, setAvailableMarcas] = useState<string[]>([]);
  const [filterDialogVisible, setFilterDialogVisible] = useState(false);
  const [filterQuantity, setFilterQuantity] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadInventory();
    loadFilters();
  }, []);

  useEffect(() => {
    loadInventory();
  }, [search, selectedCategory, selectedMarca, selectedQuantity, selectedQuantityFilter]);

  useFocusEffect(
    useCallback(() => {
      loadFilters();
    }, [])
  );

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      await openDatabase();
      const inventory = await getInventoryByFilters(
        selectedCategory,
        selectedMarca,
        selectedQuantityFilter !== '' ? filterQuantity.toString() : '',
        selectedQuantityFilter
      );
      let filteredData = inventory;
      if (search) {
        filteredData = inventory.filter(item =>
          item.nome.toLowerCase().includes(search.toLowerCase()) ||
          item.marca.toLowerCase().includes(search.toLowerCase()) ||
          item.categoria.toLowerCase().includes(search.toLowerCase())
        );
      }
      setInventory(filteredData);
    } catch (error) {
      console.error('Erro ao carregar o inventário:', error);
    } finally {
      setIsLoading(false);
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
    loadFilters(); // Recarrega os filtros após adicionar um novo item
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
    setSelectedQuantityFilter('');
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
    setSelectedQuantityFilter('');
    setFilterQuantity(0);
    loadInventory();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar item..."
            value={search}
            onChangeText={setSearch}
          />

          <View style={styles.filterContainer}>
            <Button mode="contained" onPress={showFilterDialog} buttonColor="#e0daf7" textColor="#000" style={styles.filterButton}>Filtros</Button>
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
              {selectedQuantity !== '' && selectedQuantityFilter !== '' && (
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
            ListEmptyComponent={() => (
              <View style={styles.emptyListContainer}>
                <Text style={styles.emptyListText}>Não possui registro de itens!</Text>
              </View>
            )}
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
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
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
                  <Picker.Item label="Todas as Quantidades" value="" />
                  <Picker.Item label="Igual a" value="eq" />
                  <Picker.Item label="Maior ou igual a" value="gte" />
                  <Picker.Item label="Menor ou igual a" value="lte" />
                </Picker>
                <View style={styles.buttonContainer}>
                <Button onPress={() => {
                    setSelectedQuantity(filterQuantity.toString());
                    loadInventory();
                    hideFilterDialog();
                  }} buttonColor="#e0daf7" textColor="#000">Aplicar</Button>
                  <Button onPress={hideFilterDialog} buttonColor="#e0daf7" textColor="#000">Cancelar</Button>
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