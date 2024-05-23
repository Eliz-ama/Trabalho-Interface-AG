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

  // Função para implementar o algoritmo KNN
  const runKNN = (x_train, y_train, x_test, y_test, k) => {
    // Função para calcular a distância euclidiana entre dois pontos
    const euclideanDistance = (point1, point2) => {
      return Math.sqrt(
        point1.reduce((sum, coord, index) => sum + Math.pow(coord - point2[index], 2), 0)
      );
    };

    // Função para encontrar os k vizinhos mais próximos de um ponto de teste
    const findNearestNeighbors = (testPoint) => {
      const distances = x_train.map((trainPoint, index) => ({
        index,
        distance: euclideanDistance(trainPoint, testPoint)
      }));
      distances.sort((a, b) => a.distance - b.distance);
      return distances.slice(0, k).map(({ index }) => y_train[index]);
    };

    // Função para encontrar a classe mais frequente entre os vizinhos mais próximos
    const findMostFrequentClass = (nearestNeighbors) => {
      const classCounts = {};
      nearestNeighbors.forEach((neighbor) => {
        classCounts[neighbor] = (classCounts[neighbor] || 0) + 1;
      });
      return Object.keys(classCounts).reduce((a, b) =>
        classCounts[a] > classCounts[b] ? a : b
      );
    };

    // Classificação dos pontos de teste
    const predictions = x_test.map((testPoint) => {
      const nearestNeighbors = findNearestNeighbors(testPoint);
      return findMostFrequentClass(nearestNeighbors);
    });

    // Cálculo da acurácia da classificação
    let correctCount = 0;
    predictions.forEach((prediction, index) => {
      if (prediction === y_test[index]) {
        correctCount++;
      }
    });
    const accuracy = (correctCount / y_test.length) * 100;

    // Exibe a taxa de acerto
    Alert.alert("Taxa de acerto", `A taxa de acerto foi de ${accuracy.toFixed(2)}%.`);
  };

  // Função para executar o algoritmo selecionado com o arquivo escolhido
  const handleExecute = async () => {
    if (!selectedFile) {
      Alert.alert("Erro", "Por favor, selecione um arquivo primeiro.");
      return;
    }

    try {
      // Aqui você precisa processar o arquivo selecionado para extrair os dados de treinamento (x_train, y_train)
      // e teste (x_test, y_test)
      // Suponha que você já tenha esses dados extraídos
      
      // Exemplo de dados de treinamento e teste
      const x_train = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      const y_train = [0, 1, 0];
      const x_test = [[2, 3, 4], [5, 6, 7]];
      const y_test = [0, 1];

      // Chama a função runKNN com os dados de treinamento e teste
      runKNN(x_train, y_train, x_test, y_test, 3); // Exemplo com k = 3
    } catch (err) {
      Alert.alert("Erro", "Ocorreu um erro ao processar o arquivo.");
    }
  };

  // Estilos para os componentes
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
    executeButton: {
      marginTop: 16,
    },
  });

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
      <Button title="Selecionar Arquivo" onPress={handleFileSelection} />

      {selectedFile && (
        <Text style={styles.selectedFile}>Arquivo selecionado: {selectedFile}</Text>
      )}

      <View style={styles.spacer} />
      <Button title="Executar Algoritmo" onPress={handleExecute} style={styles.executeButton} />
    </View>
  );
};

export default HomeScreen;
