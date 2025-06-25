import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';

const HomeScreen = ({ navigation }) => {
  const { addToCart, cartItems } = useContext(CartContext);

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

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TextInput
          placeholder="Pesquisar produtos"
          placeholderTextColor="#555"
          style={styles.searchInput}
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
        <Text style={styles.sectionTitle}>Destaques</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {mockItems.map((item, index) => (
            <View key={index} style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productPrice}>R$ {item.price}</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Ofertas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {mockItems.map((item, index) => (
            <View key={index} style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productPrice}>R$ {item.price}</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Videogames</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {mockItems.map((item, index) => (
            <View key={index} style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productPrice}>R$ {item.price}</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const mockItems = [
  {
    title: 'Controle PS5 Branco',
    image: 'https://via.placeholder.com/100x100.png?text=PS5',
    price: '199,90'
  },
  {
    title: 'Controle PS2',
    image: 'https://via.placeholder.com/100x100.png?text=PS2',
    price: '99,90'
  },
  {
    title: 'Controle Nintendo Pro',
    image: 'https://via.placeholder.com/100x100.png?text=Switch',
    price: '399,90'
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
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
    marginBottom: 10
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