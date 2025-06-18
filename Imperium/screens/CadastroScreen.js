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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const CadastroScreen = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCriarConta = () => {
    console.log('Criar conta:', formData);

    navigation.goBack();
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
                  placeholder=""
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Informe seu email:</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.email}
                  onChangeText={text => handleInputChange('email', text)}
                  placeholder=""
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Número de telefone:</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.telefone}
                  onChangeText={text => handleInputChange('telefone', text)}
                  placeholder=""
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
                  placeholder=""
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
                  placeholder=""
                  placeholderTextColor="#999"
                  secureTextEntry
                />
              </View>
            </View>

            {/* Botões */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleCriarConta}
              >
                <Text style={styles.primaryButtonText}>Criar Conta</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleContinuarSemLogin}
              >
                <Text style={styles.secondaryButtonText}>
                  Continuar sem login
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
