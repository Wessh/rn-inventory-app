import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Alert, Platform, StatusBar } from 'react-native';
import { getAllInventory, openDatabase, deleteData, getInventoryByFilters, getAvailableCategories, getAvailableMarcas } from '../database/simple_db';
import AddItemModal from '../modals/AddItemModal';
import FilterModal from '../modals/FilterModal';
import InventoryItemComponent from '../components/InventoryItemComponent';
import { Button, TextInput as PaperTextInput, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import styles from '../styles/styles'; // Importe os estilos do arquivo styles.ts
import { Button as PaperButton } from 'react-native-paper';
import { InventoryItem } from '../types';

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

  const loadInventory = useCallback(async () => {
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
  }, [search, selectedCategory, selectedMarca, selectedQuantity, selectedQuantityFilter]);

  const loadFilters = useCallback(async () => {
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
  }, []);

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
    <InventoryItemComponent item={item} onSelectItem={handleSelectItem} onDeleteItem={handleDeleteItem} />
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

  const handleQuantityChange = (quantity: string) => {
    setSelectedQuantity(quantity);
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
                  <TouchableOpacity onPress={() => setSelectedCategory('')}>
                    <Text style={styles.clearFilterButton}>X</Text>
                  </TouchableOpacity>
                </View>
              )}
              {selectedMarca !== '' && (
                <View style={styles.filterItemContainer}>
                  <Text style={styles.filterText}>Marca: {selectedMarca}</Text>
                  <TouchableOpacity onPress={() => setSelectedMarca('')}>
                    <Text style={styles.clearFilterButton}>X</Text>
                  </TouchableOpacity>
                </View>
              )}
              {selectedQuantity !== '' && (
                <View style={styles.filterItemContainer}>
                  <Text style={styles.filterText}>Quantidade: {selectedQuantity} ({selectedQuantityFilter})</Text>
                  <TouchableOpacity onPress={() => clearFilters()}>
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

          <FilterModal
            visible={filterDialogVisible}
            onClose={hideFilterDialog}
            selectedCategory={selectedCategory}
            selectedMarca={selectedMarca}
            selectedQuantity={selectedQuantity}
            selectedQuantityFilter={selectedQuantityFilter}
            availableCategories={availableCategories}
            availableMarcas={availableMarcas}
            setSelectedCategory={setSelectedCategory}
            setSelectedMarca={setSelectedMarca}
            setSelectedQuantity={handleQuantityChange}
            setSelectedQuantityFilter={setSelectedQuantityFilter}
            loadInventory={loadInventory}
            clearFilters={clearFilters}
          />
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