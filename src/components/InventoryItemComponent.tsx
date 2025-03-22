import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../styles/styles';
import { InventoryItem } from '../types';

interface InventoryItemComponentProps {
  item: InventoryItem;
  onSelectItem: (item: InventoryItem) => void;
  onDeleteItem: (id: number) => void;
}

const InventoryItemComponent: React.FC<InventoryItemComponentProps> = ({ item, onSelectItem, onDeleteItem }) => {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.itemInfo} onPress={() => onSelectItem(item)}>
        <Text style={styles.itemName}>Nome: {item.nome}</Text>
        <Text style={styles.itemDetails}>Marca: {item.marca}</Text>
        <Text style={styles.itemDetails}>Categoria: {item.categoria}</Text>
        <Text style={styles.itemDetails}>Quantidade: {item.quantidade}</Text>
      </TouchableOpacity>
      <View style={styles.itemButtons}>
        <TouchableOpacity style={styles.editButton} onPress={() => onSelectItem(item)}>
          <MaterialCommunityIcons name="pencil" size={20} color="#3498db" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDeleteItem(item.id)}>
          <MaterialCommunityIcons name="trash-can" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InventoryItemComponent; 