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
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SimpleLoginScreen = () => {
  const [loginData, setLoginData] = useState({
    login: '',
    senha: '',
  });

  const handleInputChange = (field, value) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEntrar = () => {
    // Implementar lógica de login
    console.log('Login:', loginData);
  };

const navigation = useNavigation();

const handleCadastrar = () => {
  navigation.navigate('Cadastro');
};
  const handleEsqueceuSenha = () => {
    // Implementar recuperação de senha
    console.log('Esqueceu a senha');
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
          <View style={styles.content}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              {/* Placeholder para o logo do capacete espartano */}
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoEmoji}>🛡️</Text>
              </View>
            </View>

            {/* Formulário */}
            <View style={styles.formContainer}>
              {/* Campo Login */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Login:</Text>
                <TextInput
                  style={styles.textInput}
                  value={loginData.login}
                  onChangeText={(text) => handleInputChange('login', text)}
                  placeholder=""
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                />
              </View>

              {/* Campo Senha */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Senha:</Text>
                <TextInput
                  style={styles.textInput}
                  value={loginData.senha}
                  onChangeText={(text) => handleInputChange('senha', text)}
                  placeholder=""
                  placeholderTextColor="#999"
                  secureTextEntry
                />
              </View>

              {/* Link Esqueceu Senha */}
              <TouchableOpacity 
                style={styles.forgotPasswordContainer}
                onPress={handleEsqueceuSenha}
              >
                <Text style={styles.forgotPasswordText}>
                  Esqueceu a senha? <Text style={styles.forgotPasswordLink}>Clique aqui</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Botões */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleEntrar}
              >
                <Text style={styles.primaryButtonText}>Entrar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={handleCadastrar}
              >
                <Text style={styles.secondaryButtonText}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra para dar profundidade
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 60,
  },
  formContainer: {
    flex: 1,
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
    // Sombra interna simulada
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
    // Sombra para dar profundidade
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'rgba(139, 69, 19, 0.7)',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.5)',
    // Sombra mais sutil
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SimpleLoginScreen;