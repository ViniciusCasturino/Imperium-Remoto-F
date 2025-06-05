import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SimpleLoginScreen from './screens/SimpleLoginScreen';
import CadastroScreen from './screens/CadastroScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={SimpleLoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
