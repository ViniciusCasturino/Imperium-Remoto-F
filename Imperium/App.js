import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

import SimpleLoginScreen from './screens/SimpleLoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import HomeScreen from './screens/HomeScreen';
import ConfigScreen from './screens/ConfigScreen';
import CartScreen from './screens/CartScreen';
import { CartProvider } from './context/CartContext';
import AddressScreen from './screens/AddressScreen';
import PaymentScreen from './screens/PaymentScreen';
import OrderConfirmationScreen from './screens/OrderConfirmationScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import ProductRegisterScreen from './screens/ProductRegisterScreen';

const Stack = createNativeStackNavigator();
export default function App() {
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage limpo com sucesso!');
    } catch (error) {
      console.error('Erro ao limpar AsyncStorage:', error);
    }
  };
  useEffect(() => {
    clearAsyncStorage();
  }, []);

  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={SimpleLoginScreen} />
          <Stack.Screen name="Cadastro" component={CadastroScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Config" component={ConfigScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Address" component={AddressScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
          <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
          <Stack.Screen name="ProductRegister" component={ProductRegisterScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}