import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();

  const [selectedAlgorithm, setSelectedAlgorithm] = useState('knn');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  const handleFileSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        setSelectedFile(fileUri);

        const content = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
        setFileContent(content);

        Alert.alert('Arquivo selecionado com sucesso', `URI: ${fileUri}`);
      } else {
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
      return;
    }

    try {
      if (!fileContent) {
        Alert.alert("Erro", "O conteúdo do arquivo não foi carregado corretamente.");
        return;
      }

      // Process the file content and execute KNN algorithm
      const result = await processFileAndRunKNN(fileContent);
      navigation.navigate('ResultScreen', { result });

    } catch (err) {
      Alert.alert("Erro", "Ocorreu um erro ao processar o arquivo.");
      console.error('Error processing file:', err);
    }
  };

  // Função para calcular a distância Euclidiana
  const euclideanDistance = (point1, point2) => {
    return Math.sqrt(point1.reduce((sum, value, index) => sum + Math.pow(value - point2[index], 2), 0));
  };

  // Função para executar o algoritmo KNN
  const knn = (trainX, trainY, testX, k) => {
    const predictions = testX.map(testPoint => {
      // Calcular distâncias entre o ponto de teste e todos os pontos de treino
      const distances = trainX.map((trainPoint, index) => ({
        label: trainY[index],
        distance: euclideanDistance(trainPoint, testPoint)
      }));

      // Ordenar por distância e pegar os k vizinhos mais próximos
      distances.sort((a, b) => a.distance - b.distance);
      const kNearestNeighbors = distances.slice(0, k);

      // Contar as classes dos k vizinhos mais próximos
      const classCounts = kNearestNeighbors.reduce((counts, neighbor) => {
        counts[neighbor.label] = (counts[neighbor.label] || 0) + 1;
        return counts;
      }, {});

      // Retornar a classe mais comum
      return Object.keys(classCounts).reduce((a, b) => classCounts[a] > classCounts[b] ? a : b);
    });

    return predictions;
  };

  // Função para calcular a acurácia
  const calculateAccuracy = (predictions, trueLabels) => {
    const correctPredictions = predictions.filter((prediction, index) => prediction === trueLabels[index]);
    return (correctPredictions.length / trueLabels.length) * 100;
  };

  const processFileAndRunKNN = async (fileContent) => {
    try {
      if (!fileContent || fileContent.trim() === '') {
        throw new Error('O conteúdo do arquivo está vazio ou não está no formato esperado.');
      }

      const lines = fileContent.split('\n');
      const data = lines.map(line => line.split(','));

      const x = [];
      const y = [];

      for (let i = 0; i < data.length; i++) {
        const instance = data[i];
        if (instance && instance.length > 1) {
          const cleanInstance = instance.map(value => value.trim());
          if (cleanInstance.every(field => field !== '')) {
            x.push(cleanInstance.slice(0, -1).map(value => parseFloat(value)));
            y.push(cleanInstance.slice(-1)[0]);
          }
        }
      }

      if (x.length === 0 || y.length === 0) {
        throw new Error('Não há dados válidos no arquivo.');
      }

      // Dividir dados em treino e teste
      const splitIndex = Math.floor(x.length * 0.7);
      const trainX = x.slice(0, splitIndex);
      const trainY = y.slice(0, splitIndex);
      const testX = x.slice(splitIndex);
      const testY = y.slice(splitIndex);

      const k = 7;
      const predictions = knn(trainX, trainY, testX, k);
      const accuracy = calculateAccuracy(predictions, testY);

      return {
        instances: x.length,
        classes: [...new Set(y)].length,
        attributes: x[0].length,
        algorithm: 'KNN',
        accuracy: accuracy,
      };
    } catch (error) {
      throw new Error('Erro ao processar o arquivo e executar o algoritmo KNN: ' + error.message);
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
}

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
