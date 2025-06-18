import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SimpleLoginScreen from './screens/SimpleLoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import HomeScreen from './screens/HomeScreen';
import ConfigScreen from './screens/ConfigScreen';
import CartScreen from './screens/CartScreen';
import { CartProvider } from './context/CartContext';
import AddressScreen from './screens/AddressScreen';

const Stack = createNativeStackNavigator();

export default function App() {
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
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
