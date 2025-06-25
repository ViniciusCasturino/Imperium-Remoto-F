import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';

const API_BASE_URL = 'https://bare-marris-prof-ferretto-8544d847.koyeb.app';

const mockItems = [
  {
    id: 'mock1',
    name: 'Controle PS5 Branco',
    imageUrl: 'https://via.placeholder.com/100x100.png?text=PS5',
    price: 199.90
  },
  {
    id: 'mock2',
    name: 'Controle PS2',
    imageUrl: 'https://via.placeholder.com/100x100.png?text=PS2',
    price: 99.90
  },
  {
    id: 'mock3',
    name: 'Controle Nintendo Pro',
    imageUrl: 'https://via.placeholder.com/100x100.png?text=Switch',
    price: 399.90
  },
  {
    id: 'mock4',
    name: 'Fone Gamer HyperX',
    imageUrl: 'https://via.placeholder.com/100x100.png?text=Fone',
    price: 250.00
  },
  {
    id: 'mock5',
    name: 'Cadeira Gamer',
    imageUrl: 'https://via.placeholder.com/100x100.png?text=Cadeira',
    price: 899.99
  }
];

const HomeScreen = ({ navigation }) => {
  const { addToCart, cartItems } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError("Não foi possível carregar os produtos do servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const productsToDisplay = products.length > 0 ? products : mockItems;
  const filteredProductsBySearch = productsToDisplay.filter(item => {
    const itemName = (item.name || item.title || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return itemName.includes(query);
  });

  const ProductSection = ({ title, items }) => {
    if (items.length === 0 && searchQuery.length > 0) {
      return (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>Nenhum produto encontrado para "{searchQuery}"</Text>
        </View>
      );
    }
    
    if (items.length === 0 && searchQuery.length === 0) {
        return null;
    }

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {items.map((item) => (
            <View key={item.id || item.name || item.title} style={styles.productCard}> 
              <Image 
                source={{ uri: item.imageUrl || item.image || 'https://via.placeholder.com/100' }} 
                style={styles.productImage} 
              />
              <Text style={styles.productTitle}>{item.name || item.title}</Text>
              <Text style={styles.productPrice}>
                R$ {parseFloat(String(item.price).replace(',', '.')).toFixed(2).replace('.', ',')}
              </Text>
              <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const featuredProducts = productsToDisplay.slice(0, 3);
  const offerProducts = productsToDisplay.filter(p => parseFloat(String(p.price).replace(',', '.')) < 200);
  const videogameProducts = productsToDisplay.filter(p => (p.name || p.title || '').toLowerCase().includes('controle'));


  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TextInput
          placeholder="Pesquisar produtos"
          placeholderTextColor="#555"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart" size={24} color="#fff" />
          {getTotalItems() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Config')}
        >
          <Ionicons name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {loading && products.length === 0 && (
          <View style={styles.inlineLoadingContainer}>
            <ActivityIndicator size="small" color="#8B0000" />
            <Text style={styles.inlineLoadingText}>Buscando produtos...</Text>
          </View>
        )}

        {error && products.length === 0 && (
          <View style={styles.inlineErrorContainer}>
            <Text style={styles.inlineErrorText}>{error}</Text>
            <TouchableOpacity onPress={fetchProducts} style={styles.retryButtonSmall}>
              <Text style={styles.retryButtonTextSmall}>Recarregar</Text>
            </TouchableOpacity>
          </View>
        )}

        {searchQuery.length > 0 ? (
          <ProductSection title={`Resultados para "${searchQuery}"`} items={filteredProductsBySearch} />
        ) : (
          <>
            <ProductSection title="Destaques" items={featuredProducts} />
            <ProductSection title="Ofertas" items={offerProducts} />
            <ProductSection title="Videogames" items={videogameProducts} />
          </>
        )}
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  inlineLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  inlineLoadingText: {
    marginLeft: 10,
    color: '#8B0000',
  },
  inlineErrorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#ffe6e6',
    borderRadius: 10,
    margin: 10,
  },
  inlineErrorText: {
    color: '#cc0000',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButtonSmall: {
    backgroundColor: '#DC143C',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  retryButtonTextSmall: {
    color: '#fff',
    fontSize: 14,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  topBar: {
    backgroundColor: '#8B0000',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 10,
    fontSize: 16
  },
  iconButton: {
    padding: 6,
    marginLeft: 5
  },
  cartBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    zIndex: 1
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },
  content: {
    paddingHorizontal: 10,
    paddingTop: 10
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B0000',
    marginBottom: 10,
    marginTop: 20
  },
  horizontalScroll: {
    flexDirection: 'row'
  },
  productCard: {
    width: 140,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    alignItems: 'center'
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  },
  productPrice: {
    marginTop: 5,
    color: '#DC143C',
    fontWeight: 'bold',
    fontSize: 16
  },
  addButton: {
    marginTop: 8,
    backgroundColor: '#8B0000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  }
});

export default HomeScreen;