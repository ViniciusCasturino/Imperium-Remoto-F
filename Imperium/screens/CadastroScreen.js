import React, { useState } from 'react';
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
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const GATEWAY_PORT = 8765; 
const YOUR_COMPUTER_IPV4 = '192.168.1.8';

const API_BASE_URL = Platform.select({
  android: `http://${YOUR_COMPUTER_IPV4}:${GATEWAY_PORT}`,
  ios: `http://localhost:${GATEWAY_PORT}`,   
  default: `http://${YOUR_COMPUTER_IPV4}:${GATEWAY_PORT}`, 
});


const CadastroScreen = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    username: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCriarConta = async () => {
    const { nomeCompleto, email, username, senha, confirmarSenha } = formData;

    if (!nomeCompleto.trim() || !email.trim() || !username.trim() || !senha.trim() || !confirmarSenha.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'A senha e a confirmação de senha não coincidem.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Atenção', 'Por favor, insira um formato de email válido.');
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
      Alert.alert('Atenção', 'O nome de usuário deve conter apenas letras e números, sem espaços ou caracteres especiais.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: nomeCompleto.trim(),
        email: email.trim(),
        username: username.trim(),
        password: senha.trim(),
      };

      console.log('Enviando payload para API:', JSON.stringify(payload));
      const requestUrl = `${API_BASE_URL}/auth/signup`; 
      console.log('URL da Requisição:', requestUrl);

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Status da Resposta da API:', response.status);
      console.log('response.ok:', response.ok);

      const data = response.status === 204 ? null : await response.json();
      console.log('Dados da Resposta da API:', data);

      if (response.ok) {
        Alert.alert('Sucesso', 'Conta criada com sucesso! Por favor, faça login.');
        navigation.goBack();
      } else {
        let errorMessage = 'Erro ao criar conta. Tente novamente.';
        if (data && data.message) {
          errorMessage = data.message;
        } else if (response.status === 409) {
          errorMessage = 'Nome de usuário ou email já cadastrado. Por favor, tente outro.';
        } else if (response.status === 400) {
          errorMessage = data.details || 'Dados inválidos. Verifique as informações fornecidas.';
        }
        Alert.alert('Erro no Cadastro', errorMessage);
      }
    } catch (error) {
      console.error('Erro na requisição de cadastro:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique se o backend está rodando, se a URL do ngrok está ativa e atualizada (se estiver usando), e sua conexão com a internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinuarSemLogin = () => {
    navigation.goBack();
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
          style={styles.keyboardContainer}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoPlaceholder}>
                  <Text style={styles.logoEmoji}>⚔️</Text>
                </View>
                <Text style={styles.welcomeText}>Bem Vindo ao</Text>
                <Text style={styles.brandText}>Imperium Remoto</Text>
              </View>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome Completo:</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.nomeCompleto}
                  onChangeText={text => handleInputChange('nomeCompleto', text)}
                  placeholder="Seu nome completo"
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Informe seu email:</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.email}
                  onChangeText={text => handleInputChange('email', text)}
                  placeholder="seu.email@exemplo.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome de Usuário:</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.username}
                  onChangeText={text => handleInputChange('username', text)}
                  placeholder="Seu nome de usuário único"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Número de telefone:</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.telefone}
                  onChangeText={text => handleInputChange('telefone', text)}
                  placeholder="(XX) XXXXX-XXXX"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Senha de login:</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.senha}
                  onChangeText={text => handleInputChange('senha', text)}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#999"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirme a senha:</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.confirmarSenha}
                  onChangeText={text => handleInputChange('confirmarSenha', text)}
                  placeholder="Confirme sua senha"
                  placeholderTextColor="#999"
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleCriarConta}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Criar Conta</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleContinuarSemLogin}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>
                  Voltar
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  keyboardContainer: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoContainer: { alignItems: 'center' },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoEmoji: { fontSize: 35 },
  welcomeText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '300',
    marginBottom: 2,
  },
  brandText: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formContainer: { flex: 1 },
  inputGroup: { marginBottom: 20 },
  inputLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '400',
  },
  textInput: {
    backgroundColor: 'rgba(139, 69, 19, 0.8)',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.5)',
  },
  buttonContainer: {
    marginTop: 30,
    gap: 15,
  },
  primaryButton: {
    backgroundColor: 'rgba(139, 69, 19, 0.9)',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.7)',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'rgba(139, 69, 19, 0.7)',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.5)',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CadastroScreen;