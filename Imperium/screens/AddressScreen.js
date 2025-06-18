import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AddressScreen = () => {
  const navigation = useNavigation();

  const [address, setAddress] = useState({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    localidade: '', 
    uf: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const fetchAddressByCep = async () => {
    const cep = address.cep.replace(/\D/g, '');
    if (cep.length !== 8) {
      Alert.alert('Erro', 'CEP inválido. Por favor, digite 8 dígitos.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        Alert.alert('Erro', 'CEP não encontrado ou inválido.');
        setAddress(prev => ({
          ...prev,
          logradouro: '',
          bairro: '',
          localidade: '',
          uf: '',
        }));
      } else {
        setAddress(prev => ({
          ...prev,
          logradouro: data.logradouro,
          bairro: data.bairro,
          localidade: data.localidade,
          uf: data.uf,
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      Alert.alert('Erro', 'Não foi possível buscar o CEP. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = () => {
    if (
      !address.logradouro ||
      !address.numero ||
      !address.bairro ||
      !address.localidade ||
      !address.uf ||
      address.cep.replace(/\D/g, '').length !== 8
    ) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    console.log('Endereço salvo:', address);
    Alert.alert('Sucesso', 'Endereço salvo com sucesso!');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={25} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Meu Endereço</Text>
            <View style={{ width: 25 }} />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>CEP:</Text>
            <View style={styles.cepInputContainer}>
              <TextInput
                style={styles.textInput}
                value={address.cep}
                onChangeText={(text) => handleInputChange('cep', text)}
                keyboardType="numeric"
                maxLength={9}
                placeholder="Ex: 00000-000"
                placeholderTextColor="#ccc"
                onBlur={fetchAddressByCep}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={fetchAddressByCep}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Ionicons name="search" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Logradouro:</Text>
            <TextInput
              style={styles.textInput}
              value={address.logradouro}
              onChangeText={(text) => handleInputChange('logradouro', text)}
              placeholder="Rua, Avenida, etc."
              placeholderTextColor="#ccc"
              editable={!loading}
            />

            <Text style={styles.inputLabel}>Número:</Text>
            <TextInput
              style={styles.textInput}
              value={address.numero}
              onChangeText={(text) => handleInputChange('numero', text)}
              keyboardType="numeric"
              placeholder="123"
              placeholderTextColor="#ccc"
              editable={!loading}
            />

            <Text style={styles.inputLabel}>Complemento (Opcional):</Text>
            <TextInput
              style={styles.textInput}
              value={address.complemento}
              onChangeText={(text) => handleInputChange('complemento', text)}
              placeholder="Apto, Bloco, Casa"
              placeholderTextColor="#ccc"
              editable={!loading}
            />

            <Text style={styles.inputLabel}>Bairro:</Text>
            <TextInput
              style={styles.textInput}
              value={address.bairro}
              onChangeText={(text) => handleInputChange('bairro', text)}
              placeholder="Centro, Jardim, etc."
              placeholderTextColor="#ccc"
              editable={!loading}
            />

            <Text style={styles.inputLabel}>Cidade:</Text>
            <TextInput
              style={styles.textInput}
              value={address.localidade}
              onChangeText={(text) => handleInputChange('localidade', text)}
              placeholder="São Paulo"
              placeholderTextColor="#ccc"
              editable={!loading}
            />

            <Text style={styles.inputLabel}>Estado (UF):</Text> 
            <TextInput
              style={styles.textInput}
              value={address.uf}
              onChangeText={(text) => handleInputChange('uf', text)}
              maxLength={2}
              autoCapitalize="characters"
              placeholder="SP"
              placeholderTextColor="#ccc"
              editable={!loading}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
            <Text style={styles.saveButtonText}>Continuar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B0000',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 20,
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
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    marginTop: 10,
    fontWeight: '500',
  },
  cepInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    borderColor: '#DC143C',
    borderWidth: 1,
  },
  searchButton: {
    backgroundColor: '#DC143C',
    borderRadius: 8,
    padding: 12,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddressScreen;