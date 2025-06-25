import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const API_BASE_URL = 'https://bare-marris-prof-ferretto-8544d847.koyeb.app';

const ProductRegisterScreen = () => {
  const [productName, setProductName] = useState('');
  const [productValue, setProductValue] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão da galeria para selecionar uma imagem.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProductImage(result.assets[0].uri);
    }
  };

  const handleRegisterProduct = async () => {
    if (!productName.trim() || !productValue.trim() || !productImage) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos e selecione uma imagem.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', productName.trim());
      formData.append('price', parseFloat(productValue.replace(',', '.')));
      
      formData.append('imageFile', {
        uri: productImage,
        name: 'product_image.jpg',
        type: 'image/jpeg',
      });

      console.log('Dados do produto a serem enviados:', {
        name: productName.trim(),
        price: parseFloat(productValue.replace(',', '.')),
        imageUri: productImage
      });

      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
        setProductName('');
        setProductValue('');
        setProductImage(null);
      } else {
        const errorText = await response.text();
        Alert.alert('Erro no Cadastro', `Falha ao cadastrar produto: ${errorText}`);
      }

    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar o produto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#DC143C', '#8B0000', '#4A0000']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.headerContainer}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={25} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerText}>Cadastro de Produto</Text>
              <View style={{ width: 25 }} />
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Nome do Produto:</Text>
              <TextInput
                style={styles.textInput}
                value={productName}
                onChangeText={setProductName}
                placeholder="Ex: PlayStation 5"
                placeholderTextColor="#999"
              />

              <Text style={styles.inputLabel}>Valor do Produto:</Text>
              <TextInput
                style={styles.textInput}
                value={productValue}
                onChangeText={setProductValue}
                placeholder="Ex: 2999,99"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Imagem do Produto:</Text>
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                {productImage ? (
                  <Image source={{ uri: productImage }} style={styles.selectedImage} />
                ) : (
                  <Ionicons name="cloud-upload-outline" size={80} color="#fff" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegisterProduct}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.registerButtonText}>CADASTRAR</Text>
                  <Ionicons name="arrow-forward" size={20} color="#000000" />
                </>
              )}
            </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 40,
  },
  inputLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
    fontWeight: '500',
    marginTop: 15,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  imagePickerButton: {
    width: '100%',
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginTop: 10,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  registerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  registerButtonText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ProductRegisterScreen;