import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6fc', // Cor de fundo geral
  },
  container: {
    flex: 1,
    padding:8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#34495e', // Cor do título
  },
  searchInput: {
    marginTop: -8,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
    paddingHorizontal: 8, // Adiciona padding horizontal
    paddingVertical: 8, // Adiciona padding vertical
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
    borderRadius: 10,
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    padding: 8,
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
  },
  modalView: {
    margin: 20,
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
    width: '80%', // Define a largura do modal
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: '100%',
    fontSize: 16,
  },
  filterTextInput: {
    height: 40,
    width: '100%',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 16,
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
    borderRadius: 5,
    alignItems: 'center'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%', // Ajuste a largura conforme necessário
    maxHeight: '80%', // Ajuste a altura conforme necessário
    alignItems: 'center',
    elevation: 5, // Adiciona uma sombra
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  settingsButton: {
    padding: 10,
  },
  filterButton: {
    width: 100, // Ajuste a largura conforme necessário
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyListText: {
    fontSize: 16,
    color: '#000',//'#8e44ad',
  },
});

export default styles; 