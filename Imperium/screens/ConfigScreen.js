import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ConfigScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Perfil</Text>

      <Image
        source={{ uri: 'https://via.placeholder.com/100' }}
        style={styles.avatar}
      />

      <Text style={styles.username}>ViniZERAAAA171</Text>

      <View style={styles.optionsContainer}>
        <Option title="Minha conta" icon="person-outline" />

        <Option title="Deletar conta" icon="trash-outline" />
        <Option title="Sair" icon="log-out-outline" />
      </View>
    </View>
  );
};

const Option = ({ title, icon }) => (
  <TouchableOpacity style={styles.option}>
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
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  username: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  optionsContainer: {
    width: '100%',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#A52A2A',
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
});

export default ConfigScreen;
