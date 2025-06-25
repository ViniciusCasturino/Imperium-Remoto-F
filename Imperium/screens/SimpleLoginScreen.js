import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const spartanHelmetImage = require('../assets/images/logo.png');

const API_BASE_URL = 'https://10e9-192-140-127-205.ngrok-free.app';

const SimpleLoginScreen = () => {
  const [loginData, setLoginData] = useState({
    login: '',
    senha: '',
  });
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleInputChange = (field, value) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEntrar = async () => {
    const { login, senha } = loginData;

    if (!login.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o login (email) e a senha.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: login.trim(),
        password: senha.trim(),
      };

      console.log('Enviando payload de login para API:', JSON.stringify(payload));
      const requestUrl = `${API_BASE_URL}/auth/signin`;
      console.log('URL da Requisição de Login:', requestUrl);

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Status da Resposta da API (Login):', response.status);
      console.log('response.ok (Login):', response.ok);

      let data = null;
      let rawResponseText = null;
      try {
        rawResponseText = await response.text();
        if (response.status !== 204 && rawResponseText) {
            data = JSON.parse(rawResponseText);
        }
      } catch (jsonError) {
        console.error('Erro ao parsear JSON da resposta:', jsonError);
        console.log('Resposta bruta do servidor (não JSON ou com erro de parse):', rawResponseText);
      }

      console.log('Dados da Resposta da API (Login):', data);

      if (response.ok) {
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        if (data && data.token && data.user) {
          await AsyncStorage.setItem('userToken', data.token);
          await AsyncStorage.setItem('userData', JSON.stringify(data.user));
          console.log('Token e dados do usuário salvos no AsyncStorage.');
        }
        navigation.navigate('Home');
      } else {
        let errorMessage = 'Login ou senha inválidos. Tente novamente.';
        if (rawResponseText) {
            errorMessage = rawResponseText;
        } else if (data && data.message) {
            errorMessage = data.message;
        } else if (response.status === 401) {
            errorMessage = 'Credenciais inválidas.';
        } else if (response.status === 404) {
            errorMessage = 'O serviço de login não foi encontrado.';
        }
        Alert.alert('Erro no Login', errorMessage);
      }
    } catch (error) {
      console.error('Erro na requisição de login:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão ou tente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleCadastrar = () => {
    navigation.navigate('Cadastro');
  };

  const handleEsqueceuSenha = () => {
    console.log('Esqueceu a senha');
    Alert.alert('Funcionalidade', 'Ainda não implementado: Recuperação de senha.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />

      <LinearGradient
        colors={['#DC143C', '#8B0000', '#4A0000']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logoPlaceholder}>
                <Image
                  source={spartanHelmetImage}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Login (Email):</Text>
                <TextInput
                  style={styles.textInput}
                  value={loginData.login}
                  onChangeText={(text) => handleInputChange('login', text)}
                  placeholder="Seu email"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Senha:</Text>
                <TextInput
                  style={styles.textInput}
                  value={loginData.senha}
                  onChangeText={(text) => handleInputChange('senha', text)}
                  placeholder="Sua senha"
                  placeholderTextColor="#999"
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={handleEsqueceuSenha}
              >
                <Text style={styles.forgotPasswordText}>
                  Esqueceu a senha? <Text style={styles.forgotPasswordLink}>Clique aqui</Text>
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleEntrar}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Entrar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleCadastrar}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 40,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: '80%',
    height: '80%',
  },
  logoEmoji: {
    fontSize: 60,
  },
  formContainer: {
    justifyContent: 'center',
    marginTop: -50,
  },
  inputGroup: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: 'rgba(139, 69, 19, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.6)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  forgotPasswordLink: {
    color: '#FFD700',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    gap: 20,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: 'rgba(139, 69, 19, 0.9)',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.7)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  secondaryButton: {
    backgroundColor: 'rgba(139, 69, 19, 0.7)',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.5)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SimpleLoginScreen;