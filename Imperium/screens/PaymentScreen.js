import React, { useState, useContext } from 'react'; 
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { CartContext } from '../context/CartContext';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const { cartItems } = useContext(CartContext);

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
  });

  const formattedCardNumber = cardData.cardNumber.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
  const formattedExpiryDate = cardData.expiryDate.replace(/\D/g, '').replace(/(\d{2})(\d{2})/g, '$1/$2').substring(0, 5);

  const handleInputChange = (field, value) => {
    if (field === 'cardNumber') {
      const cleanedValue = value.replace(/\D/g, '').substring(0, 16);
      setCardData(prev => ({ ...prev, [field]: cleanedValue }));
    } else if (field === 'expiryDate') {
        const cleanedValue = value.replace(/\D/g, '').substring(0, 4);
        setCardData(prev => ({ ...prev, [field]: cleanedValue }));
    } else if (field === 'cvv') {
        const cleanedValue = value.replace(/\D/g, '').substring(0, 4);
        setCardData(prev => ({ ...prev, [field]: cleanedValue }));
    }
    else {
      setCardData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFinalizePayment = () => {
    if (
      formattedCardNumber.replace(/\s/g, '').length !== 16 ||
      cardData.cardHolderName.trim() === '' ||
      formattedExpiryDate.length !== 5 ||
      (cardData.cvv.length !== 3 && cardData.cvv.length !== 4)
    ) {
      Alert.alert('Atenção', 'Por favor, preencha todos os dados do cartão corretamente.');
      return;
    }

    const totalAmount = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(',', '.'));
      return sum + price * item.quantity;
    }, 0).toFixed(2);


    navigation.replace('OrderConfirmation', {
        confirmedCartItems: cartItems,
        totalAmount: totalAmount,
    });

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
            <Text style={styles.title}>Pagamento</Text>
            <View style={{ width: 25 }} />
          </View>

          <LinearGradient
            colors={['#FF5722', '#F44336', '#D32F2F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardContainer}
          >
            <View style={styles.cardHeader}>
              <Image source={require('../assets/images/chip.png')} style={styles.chipIcon} />
              <Image source={require('../assets/images/mastercard_logo.png')} style={styles.cardTypeIcon} />
            </View>
            <Text style={styles.cardNumberDisplay}>{formattedCardNumber || '0000 0000 0000 0000'}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardHolderNameDisplay}>{cardData.cardHolderName || 'Nome'}</Text>
              <Text style={styles.cardExpiryDisplay}>{formattedExpiryDate || '00/00'}</Text>
            </View>
          </LinearGradient>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="card" size={20} color="#fff" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={formattedCardNumber}
                  onChangeText={(text) => handleInputChange('cardNumber', text)}
                  keyboardType="numeric"
                  placeholder="Número do cartão"
                  placeholderTextColor="#ccc"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="person" size={20} color="#fff" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={cardData.cardHolderName}
                  onChangeText={(text) => handleInputChange('cardHolderName', text)}
                  placeholder="Nome do titular do cartão"
                  placeholderTextColor="#ccc"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, styles.halfInput]}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="calendar" size={20} color="#fff" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={formattedExpiryDate}
                    onChangeText={(text) => handleInputChange('expiryDate', text)}
                    keyboardType="numeric"
                    maxLength={5}
                    placeholder="Validade"
                    placeholderTextColor="#ccc"
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, styles.halfInput, { marginLeft: 10 }]}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="lock-closed" size={20} color="#fff" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={cardData.cvv}
                    onChangeText={(text) => handleInputChange('cvv', text)}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    placeholder="CVV"
                    placeholderTextColor="#ccc"
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
            <TouchableOpacity style={styles.finalizarPagamentoButton} onPress={handleFinalizePayment}>
                <Text style={styles.finalizarPagamentoButtonText}>FINALIZAR PAGAMENTO</Text>
                <Ionicons name="arrow-forward" size={20} color="#000" />
            </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B0000',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 40,
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  cardContainer: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'space-between',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipIcon: {
    width: 40,
    height: 30,
    resizeMode: 'contain',
  },
  cardTypeIcon: {
    width: 60,
    height: 40,
    resizeMode: 'contain',
  },
  cardNumberDisplay: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHolderNameDisplay: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardExpiryDisplay: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.6)',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#fff',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#8B0000',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  finalizarPagamentoButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  finalizarPagamentoButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default PaymentScreen;