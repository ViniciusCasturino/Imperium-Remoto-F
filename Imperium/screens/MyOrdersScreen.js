import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ORDERS_STORAGE_KEY = '@my_orders';

const MyOrdersScreen = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const storedOrders = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders).reverse());
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Erro ao carregar pedidos do AsyncStorage:", error);
      Alert.alert('Erro', 'Não foi possível carregar seus pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
      return () => {
      };
    }, [])
  );

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderDate}>Pedido realizado em: {item.orderDate}</Text>
      <View style={styles.productsSummary}>
        <Text style={styles.productsSummaryTitle}>Itens do Pedido:</Text>
        {item.products.map((product, index) => (
          <View 
            key={String(product.id || product.name || index)} 
            style={styles.productItem}
          >
            <Text style={styles.productName}>{product.name}</Text> 
            <Text style={styles.productDetails}>
              {product.quantity}x - R$ {
                (parseFloat(String(product.price).replace(',', '.')) * product.quantity)
                  .toFixed(2)
                  .replace('.', ',')
              }
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.orderTotalContainer}>
        <Text style={styles.orderTotalLabel}>Total:</Text>
        <Text style={styles.orderTotalAmount}>R$ {item.totalAmount.replace('.', ',')}</Text>
      </View>
      {item.deliveryAddress && item.deliveryAddress.logradouro ? (
        <View style={styles.deliveryAddressContainer}>
          <Text style={styles.deliveryAddressLabel}>Entregue em:</Text>
          <Text style={styles.deliveryAddressText}>
            {item.deliveryAddress.logradouro}, {item.deliveryAddress.numero}
            {item.deliveryAddress.complemento ? ` - ${item.deliveryAddress.complemento}` : ''}
            {`\n${item.deliveryAddress.bairro}, ${item.deliveryAddress.localidade} - ${item.deliveryAddress.uf}`}
          </Text>
        </View>
      ) : (
        <Text style={styles.deliveryAddressText}>Endereço de entrega não disponível.</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={25} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Meus Pedidos</Text>
        <View style={{ width: 25 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Carregando pedidos...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Você ainda não fez nenhum pedido.</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.emptyButtonText}>Começar a comprar!</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders} 
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B0000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#8B0000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderDate: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    paddingBottom: 5,
  },
  productsSummary: {
    marginBottom: 10,
  },
  productsSummaryTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  productName: {
    color: '#fff',
    fontSize: 15,
    flexShrink: 1,
    marginRight: 10,
  },
  productDetails: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 10,
    marginTop: 10,
  },
  orderTotalLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderTotalAmount: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deliveryAddressContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 10,
    marginTop: 10,
  },
  deliveryAddressLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  deliveryAddressText: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 18,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#8B0000',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  homeButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  homeButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default MyOrdersScreen;