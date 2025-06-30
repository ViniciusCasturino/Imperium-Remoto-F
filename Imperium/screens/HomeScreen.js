import React, { useContext, useEffect, useState, useCallback } from 'react';
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
  RefreshControl,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GATEWAY_PORT = 8765; 
const YOUR_COMPUTER_IPV4 = '192.168.1.8'; 
const API_BASE_URL = Platform.select({
  android: `http://${YOUR_COMPUTER_IPV4}:${GATEWAY_PORT}`,
  ios: `http://localhost:${GATEWAY_PORT}`,   
  default: `http://${YOUR_COMPUTER_IPV4}:${GATEWAY_PORT}`, 
});

const HomeScreen = ({ navigation }) => {
  const { addToCart, cartItems } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Sair do Aplicativo",
        "Você realmente quer sair?",
        [
          { text: "Cancelar", onPress: () => null, style: "cancel" },
          { text: "Sair", onPress: () => BackHandler.exitApp() }
        ],
        { cancelable: false }
      );
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        console.warn("Nenhum token de usuário encontrado. Requisições GET podem falhar se protegidas.");
      }

      const PRODUCTS_API_URL = `${API_BASE_URL}/products/BRL?size=100`; 
      console.log("Buscando produtos em:", PRODUCTS_API_URL); 

      const response = await fetch(PRODUCTS_API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': userToken ? `Bearer ${userToken}` : '', 
        },
      });

      if (!response.ok) {
        const errorBody = await response.text(); 
        console.error("Erro detalhado na resposta da API:", errorBody);
        throw new Error(`Erro na API: ${response.status} ${response.statusText}. Detalhes: ${errorBody}`);
      }
      
      const responseData = await response.json();
      console.log("Resposta completa da API:", responseData); 

      const data = responseData.content || responseData; 

      if (!Array.isArray(data)) {
          console.error("A resposta da API não é um array de produtos:", data);
          throw new Error("Formato de dados inesperado da API.");
      }

      console.log("Produtos recebidos da API (conteúdo):", data); 

      const formattedProducts = data.map(item => ({
        id: item.id || item.productId,
        name: item.description || item.name, 
        imageUrl: item.imageUrl && item.imageUrl.startsWith('http') ? item.imageUrl : 'https://via.placeholder.com/100', 
        price: item.convertedPrice || item.price,
      }));

      setProducts(formattedProducts);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError("Não foi possível carregar os produtos do servidor.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProducts();
    });
    return unsubscribe;
  }, [fetchProducts, navigation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, [fetchProducts]);

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const productsToDisplay = products; 
  
  const filteredProductsBySearch = productsToDisplay.filter(item => {
    const itemName = (item.name || item.description || '').toLowerCase();
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
    
    if (items.length === 0 && searchQuery.length === 0 && !loading && !error) {
        return (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>Nenhum produto cadastrado ainda. Comece a adicionar!</Text>
          </View>
        );
    }
    
    if (items.length === 0) {
      return null;
    }

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {items.map((item) => (
            <View key={item.id || `${item.name}-${item.price}-${item.imageUrl}`} style={styles.productCard}> 
              <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.productImage} 
              />
              <Text style={styles.productTitle}>{item.name}</Text> 
              <Text style={styles.productPrice}>
                R$ {parseFloat(String(item.price)).toFixed(2).replace('.', ',')}
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
  const offerProducts = productsToDisplay.filter(p => parseFloat(String(p.price)).toFixed(2) < 200);
  const videogameProducts = productsToDisplay.filter(p => (p.name || p.description || '').toLowerCase().includes('controle'));

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

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#DC143C']} tintColor="#DC143C" />
        }
      >
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

        {!loading && !error && (
          searchQuery.length > 0 ? (
            <ProductSection title={`Resultados para "${searchQuery}"`} items={filteredProductsBySearch} />
          ) : (
            <>
              <ProductSection title="Destaques" items={featuredProducts} />
              <ProductSection title="Ofertas" items={offerProducts} />
              <ProductSection title="Produtos Disponíveis" items={videogameProducts} />
            </>
          )
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
    padding: 10,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
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
    flex: 1,
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
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
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
    textAlign: 'center',
    minHeight: 32,
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