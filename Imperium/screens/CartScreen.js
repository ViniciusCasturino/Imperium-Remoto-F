import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { CartContext } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigation = useNavigation();

  const total = cartItems.reduce((sum, item) => {
    const rawPrice = item.price !== undefined && item.price !== null ? String(item.price) : '0';
    const price = parseFloat(rawPrice.replace(',', '.'));
    return sum + (isNaN(price) ? 0 : price) * (item.quantity || 1);
  }, 0).toFixed(2);
  const isCartEmpty = cartItems.length === 0;

  const handleCheckout = () => {
    if (isCartEmpty) {
      Alert.alert('Carrinho Vazio', 'Adicione itens ao carrinho para finalizar a compra.');
      return;
    }
    navigation.navigate('Address');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={25} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Meu Carrinho</Text>
        <View style={{ width: 25 }} />
      </View>

      {isCartEmpty ? (
        <View style={styles.emptyCartContainer}>
          <Ionicons name="cart-outline" size={100} color="#ccc" />
          <Text style={styles.emptyCartText}>Seu carrinho está vazio!</Text>
          <Text style={styles.emptyCartSubText}>Adicione alguns produtos para começar a comprar.</Text>
          <TouchableOpacity
            style={styles.continueShoppingButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.continueShoppingText}>Continuar Comprando</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => String(item.id || item.name)} 
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>R$ {item.price}</Text>
                <View style={styles.controls}>
                  <TouchableOpacity onPress={() => updateQuantity(String(item.id || item.name), -1)}>
                    <Text style={styles.qtyButton}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qty}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(String(item.id || item.name), 1)}>
                    <Text style={styles.qtyButton}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(String(item.id || item.name))} style={styles.removeBtn}>
                  <Text style={styles.removeText}>REMOVER</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {!isCartEmpty && (
        <>
          <Text style={styles.total}>Total: R$ {total}</Text>
          <TouchableOpacity
            style={styles.checkoutButton} 
            onPress={handleCheckout}
            disabled={isCartEmpty}
          >
            <Text style={styles.checkoutText}>FINALIZAR COMPRA</Text>
            <Ionicons name="arrow-forward" size={20} color="#000" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#8B0000', padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 20,
  },
  title: { fontSize: 18, color: '#fff', textAlign: 'center', flex: 1 },
  item: { flexDirection: 'row', backgroundColor: '#fff', marginBottom: 10, borderRadius: 10 },
  image: { width: 100, height: 100, borderRadius: 8 },
  details: { flex: 1, padding: 10, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { color: '#DC143C', fontWeight: '600' },
  controls: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  qtyButton: { fontSize: 18, paddingHorizontal: 10 },
  qty: { marginHorizontal: 8, fontSize: 16 },
  removeBtn: { marginTop: 5 },
  removeText: { color: '#8B0000', fontWeight: 'bold' },
  total: { fontSize: 18, color: '#fff', marginTop: 10, textAlign: 'right' },
  checkoutButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    marginTop: 10
  },
  checkoutText: { fontWeight: 'bold', marginRight: 8 },
  backButton: {},
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
  },
  emptyCartSubText: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 10,
    textAlign: 'center',
  },
  continueShoppingButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  continueShoppingText: {
    color: '#8B0000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;