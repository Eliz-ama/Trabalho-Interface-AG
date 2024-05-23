import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';

const HomeScreen = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('knn');
  const [selectedFile, setSelectedFile] = useState(null);

  // Função para abrir o seletor de arquivos do dispositivo
  const handleFileSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (result.type === 'success') {
        setSelectedFile(result.uri);
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível selecionar o arquivo.");
    }
  };

  // Função para executar o algoritmo selecionado com o arquivo escolhido
  const handleExecute = () => {
    if (!selectedFile) {
      Alert.alert("Erro", "Por favor, selecione um arquivo primeiro.");
      return;
    }

    Alert.alert(
      "Executar Algoritmo",
      `Algoritmo: ${selectedAlgorithm}\nBase de Dados: ${selectedFile}`
    );
  };

  return (
    <View style={styles.container}>
      {/* Texto de instrução para selecionar o algoritmo */}
      <Text style={styles.label}>Escolha o algoritmo de aprendizagem de máquina</Text>
      {/* Componente Picker para selecionar o algoritmo */}
      <Picker
        selectedValue={selectedAlgorithm}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedAlgorithm(itemValue)}
      >
        <Picker.Item label="KNN" value="knn" />
        <Picker.Item label="Algoritmo Genético" value="genetic" />
        <Picker.Item label="Árvore de Decisão" value="decision_tree" />
      </Picker>

      {/* Texto de instrução para selecionar a base de dados */}
      <Text style={styles.label}>Escolha uma base de dados</Text>
      {/* Botão para abrir o seletor de arquivos */}
      <Button title="Selecionar Arquivo" onPress={handleFileSelection} />

      {/* Texto para mostrar o arquivo selecionado, se houver */}
      {selectedFile && (
        <Text style={styles.selectedFile}>Arquivo selecionado: {selectedFile}</Text>
      )}

      {/* Espaçamento extra antes do botão de executar */}
      <View style={styles.spacer} />

      {/* Botão para executar o algoritmo */}
      <Button title="Executar Algoritmo" onPress={handleExecute} style={styles.executeButton} />
    </View>
  );
};

// Estilos para os componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,  // Ocupa toda a altura disponível
    padding: 16,  // Espaçamento interno de 16 unidades
    justifyContent: 'flex-start',  // Centraliza no início da tela
    backgroundColor: '#fff',  // Fundo branco
  },
  label: {
    fontSize: 16,  // Tamanho da fonte 16
    marginBottom: 8,  // Margem inferior de 8 unidades
    fontWeight: 'bold',  // Texto em negrito
  },
  picker: {
    height: 50,  // Altura do Picker
    width: '100%',  // Largura total
    marginBottom: 16,  // Margem inferior de 16 unidades
  },
  selectedFile: {
    marginTop: 8,  // Margem superior de 8 unidades
    marginBottom: 16,  // Margem inferior de 16 unidades
    fontSize: 14,  // Tamanho da fonte 14
    color: 'green',  // Cor do texto verde
  },
  spacer: {
    flex: 1,  // Ocupa o espaço restante
  },
  executeButton: {
    marginTop: 16,  // Margem superior de 16 unidades
  },
});

export default HomeScreen;  // Exporta o componente HomeScreen como padrão
