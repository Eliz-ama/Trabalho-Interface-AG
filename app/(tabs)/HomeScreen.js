import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('knn');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  const handleFileSelection = async () => {
    console.log('Opening document picker...');
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      console.log('Document picker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        setSelectedFile(fileUri);
        console.log('File URI:', fileUri);

        const content = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
        setFileContent(content);
        console.log('File content:', content);
        Alert.alert('Arquivo selecionado com sucesso', `URI: ${fileUri}`);
      } else {
        console.log('File selection was cancelled');
        setSelectedFile(null);
        setFileContent(null);
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível selecionar o arquivo.");
      console.error('Error selecting file:', err);
    }
  };

  const handleExecute = async () => {
    if (!selectedFile) {
      Alert.alert("Erro", "Por favor, selecione um arquivo primeiro.");
      console.log('No file selected');
      return;
    }

    try {
      if (!fileContent) {
        Alert.alert("Erro", "O conteúdo do arquivo não foi carregado corretamente.");
        return;
      }

      console.log('Processing file:', selectedFile);

      // Process the file content
      const result = {
        instances: 150,
        classes: 3,
        attributes: 4,
        algorithm: selectedAlgorithm,
        accuracy: 85,
      };

      navigation.navigate('ResultScreen', { result });

    } catch (err) {
      Alert.alert("Erro", "Ocorreu um erro ao processar o arquivo.");
      console.error('Error processing file:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Escolha o algoritmo de aprendizagem de máquina</Text>
      <Picker
        selectedValue={selectedAlgorithm}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedAlgorithm(itemValue)}
      >
        <Picker.Item label="KNN" value="knn" />
        <Picker.Item label="Algoritmo Genético" value="genetic" />
        <Picker.Item label="Árvore de Decisão" value="decision_tree" />
      </Picker>

      <Text style={styles.label}>Escolha uma base de dados</Text>
      <Pressable onPress={handleFileSelection} style={styles.button}>
        <Text style={styles.buttonText}>Selecionar Arquivo</Text>
      </Pressable>

      {selectedFile && (
        <Text style={styles.selectedFile}>Arquivo selecionado: {selectedFile}</Text>
      )}

      <View style={styles.spacer} />
      <TouchableOpacity onPress={handleExecute} style={styles.button}>
        <Text style={styles.buttonText}>Executar Algoritmo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  selectedFile: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: 14,
    color: 'green',
  },
  spacer: {
    flex: 1,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default HomeScreen;
