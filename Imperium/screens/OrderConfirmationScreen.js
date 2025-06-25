import React, { useEffect, useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ORDERS_STORAGE_KEY = '@my_orders';

const OrderConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { confirmedCartItems, totalAmount, deliveryAddress } = route.params || { confirmedCartItems: [], totalAmount: '0.00', deliveryAddress: {} };

  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    const saveOrder = async () => {
      if (!confirmedCartItems || confirmedCartItems.length === 0) {
        return;
      }

      try {
        const existingOrders = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
        const orders = existingOrders ? JSON.parse(existingOrders) : [];

        const newOrder = {
          id: `order_${Date.now()}`,
          orderDate: new Date().toLocaleDateString('pt-BR'),
          products: confirmedCartItems,
          totalAmount: totalAmount,
          deliveryAddress: deliveryAddress,
        };

        const updatedOrders = [...orders, newOrder];
        await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
        console.log('Pedido salvo com sucesso:', newOrder);
      } catch (error) {
        console.error("Erro ao salvar pedido no AsyncStorage:", error);
        Alert.alert('Erro', 'Não foi possível salvar o seu pedido.');
      }
    };
    saveOrder();
  }, [confirmedCartItems, totalAmount, deliveryAddress]);

  const handleGoHome = () => {
    clearCart();
    navigation.replace('Home');
  };

  const formatAddress = (address) => {
    if (!address || Object.keys(address).length === 0 || !address.logradouro) {
        return 'Endereço não disponível';
    }
    const { logradouro, numero, complemento, bairro, localidade, uf } = address;
    let formatted = `${logradouro}, ${numero}`;
    if (complemento) {
        formatted += ` - ${complemento}`;
    }
    formatted += `\n${bairro}, ${localidade} - ${uf}`;
    return formatted;
  };

  const ListHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Confirmação de Compra</Text>
      </View>

      <View style={styles.confirmationBox}>
        <Image
          source={require('../assets/images/package_icon.png')}
          style={styles.packageIcon}
        />
        <Text style={styles.confirmationText}>Compra finalizada com sucesso!</Text>
      </View>

      {confirmedCartItems.length > 0 && (
        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>Resumo do Pedido:</Text>
        </View>
      )}
    </>
  );

  const ListFooter = () => (
    <>
      {confirmedCartItems.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmountText}>R$ {totalAmount.replace('.', ',')}</Text>
        </View>
      )}

      <View style={styles.deliveryInfoContainer}>
        <View style={styles.deliveryRow}>
            <Text style={styles.deliveryLabel}>Frete:</Text>
            <Text style={styles.deliveryValue}>GRÁTIS</Text>
        </View>
        <Text style={styles.addressLabel}>Enviado para:</Text>
        <Text style={styles.addressText}>{formatAddress(deliveryAddress)}</Text>
      </View>
      <View style={{ height: 80 }} />
    </>
  );


  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={confirmedCartItems}
        keyExtractor={(item, index) => String(item.id || item.name) + index} 
        renderItem={({ item }) => (
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemName}>{item.name} ({item.quantity}x)</Text> 
            <Text style={styles.summaryItemPrice}>R$ {(parseFloat(String(item.price).replace(',', '.')) * item.quantity).toFixed(2).replace('.', ',')}</Text>
          </View>
        )}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        contentContainerStyle={styles.flatListContent}
      />

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Text style={styles.homeButtonText}>VOLTAR AO INÍCIO</Text>
          <Ionicons name="arrow-forward" size={20} color="#000" />
        </TouchableOpacity>
      </View>
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
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  confirmationBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
    aspectRatio: 1,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  packageIcon: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  confirmationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  orderSummary: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    paddingBottom: 5,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summaryItemName: {
    color: '#fff',
    fontSize: 16,
  },
  summaryItemPrice: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  totalText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmountText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deliveryInfoContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
  },
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  deliveryLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deliveryValue: {
    color: '#32CD32',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
  },
  addressText: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5,
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

export default OrderConfirmationScreen;