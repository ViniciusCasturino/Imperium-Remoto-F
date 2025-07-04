import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfigScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário do AsyncStorage:', error);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              console.log('AsyncStorage limpo. Usuário deslogado.');
              navigation.replace('Login');
            } catch (error) {
              console.error('Erro ao limpar AsyncStorage no logout:', error);
              Alert.alert('Erro', 'Não foi possível deslogar completamente.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleNavigateToProductRegister = () => {
    navigation.navigate('ProductRegister');
  };

  if (loadingUser) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Carregando perfil...</Text>
      </SafeAreaView>
    );
  }

  const isAdmin = userData && userData.type === 'Admin';
  const displayedUsername = userData ? (userData.name || userData.username || 'Usuário') : 'Convidado';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={25} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Perfil</Text>
        <View style={{ width: 25 }} />
      </View>

      <Image
        source={require('../assets/images/avatar.png')}
        style={styles.avatar}
      />

      <Text style={styles.username}>{displayedUsername}</Text>

      <View style={styles.optionsContainer}>
        <Option
          title="Minha conta"
          icon="person-outline"
          onPress={() => console.log("Navegar para Minha Conta")}
        />
        <Option
          title="Meus Pedidos"
          icon="list-outline"
          onPress={() => navigation.navigate('MyOrders')}
        />

        {isAdmin && (
          <Option
            title="Cadastrar Produtos"
            icon="add-circle-outline"
            onPress={handleNavigateToProductRegister}
          />
        )}

        <Option
          title="Deletar conta"
          icon="trash-outline"
          onPress={() => Alert.alert('Deletar Conta', 'Tem certeza que deseja deletar sua conta? Esta ação é irreversível.')}
        />
        <Option
          title="Sair"
          icon="log-out-outline"
          onPress={handleLogout}
        />
      </View>
    </SafeAreaView>
  );
};

const Option = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <View style={styles.optionContent}>
      <Ionicons name={icon} size={22} color="#fff" />
      <Text style={styles.optionText}>{title}</Text>
    </View>
    <Ionicons name="arrow-forward-outline" size={20} color="#fff" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B0000',
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  headerText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  username: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  optionsContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
  backButton: {
    padding: 5,
  },
});

export default ConfigScreen;