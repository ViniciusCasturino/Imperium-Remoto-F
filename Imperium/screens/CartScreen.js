import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { CartContext } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigation = useNavigation();

  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(',', '.'));
    return sum + price * item.quantity;
  }, 0).toFixed(2);

  const handleCheckout = () => {
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
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.price}>R$ {item.price}</Text>
              <View style={styles.controls}>
                <TouchableOpacity onPress={() => updateQuantity(item.title, -1)}>
                  <Text style={styles.qtyButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qty}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.title, 1)}>
                  <Text style={styles.qtyButton}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => removeFromCart(item.title)} style={styles.removeBtn}>
                <Text style={styles.removeText}>REMOVER</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Text style={styles.total}>Total: R$ {total}</Text>
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutText}>FINALIZAR COMPRA</Text>
        <Ionicons name="arrow-forward" size={20} color="#000" />
      </TouchableOpacity>
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
  backButton: {}
});

export default CartScreen;