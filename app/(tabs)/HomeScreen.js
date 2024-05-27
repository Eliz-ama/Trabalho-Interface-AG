import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';

const HomeScreen = ({ navigation }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('knn');
  const [selectedFile, setSelectedFile] = useState(null);

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

  const processCSV = async (fileUri) => {
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    return new Promise((resolve, reject) => {
      Papa.parse(fileContent, {
        complete: (results) => {
          resolve(results.data);
        },
        header: false
      });
    });
  };

  const euclideanDistance = (point1, point2) => {
    return Math.sqrt(
      point1.reduce((sum, coord, index) => sum + Math.pow(coord - point2[index], 2), 0)
    );
  };

  const runKNN = (x_train, y_train, x_test, k) => {
    const findNearestNeighbors = (testPoint) => {
      const distances = x_train.map((trainPoint, index) => ({
        index,
        distance: euclideanDistance(trainPoint, testPoint)
      }));
      distances.sort((a, b) => a.distance - b.distance);
      return distances.slice(0, k).map(({ index }) => y_train[index]);
    };

    const findMostFrequentClass = (nearestNeighbors) => {
      const classCounts = {};
      nearestNeighbors.forEach((neighbor) => {
        classCounts[neighbor] = (classCounts[neighbor] || 0) + 1;
      });
      return Object.keys(classCounts).reduce((a, b) =>
        classCounts[a] > classCounts[b] ? a : b
      );
    };

    const predictions = x_test.map((testPoint) => {
      const nearestNeighbors = findNearestNeighbors(testPoint);
      return findMostFrequentClass(nearestNeighbors);
    });

    return predictions;
  };

  const handleExecute = async () => {
    if (!selectedFile) {
      Alert.alert("Erro", "Por favor, selecione um arquivo primeiro.");
      return;
    }

    try {
      const data = await processCSV(selectedFile);
      const attributes = data[0].length - 1;
      const instances = data.length;

      // Assume the last column is the class label
      const x = data.map(row => row.slice(0, attributes).map(Number));
      const y = data.map(row => row[attributes]);

      // Split data into training and test sets
      const splitIndex = Math.floor(0.7 * instances);
      const x_train = x.slice(0, splitIndex);
      const y_train = y.slice(0, splitIndex);
      const x_test = x.slice(splitIndex);
      const y_test = y.slice(splitIndex);

      // Run KNN algorithm
      const k = 7;
      const predictions = runKNN(x_train, y_train, x_test, k);

      // Calculate accuracy
      let correctCount = 0;
      predictions.forEach((prediction, index) => {
        if (prediction === y_test[index]) {
          correctCount++;
        }
      });
      const accuracy = (correctCount / y_test.length) * 100;

      const result = {
        instances,
        classes: [...new Set(y)].length,
        attributes,
        algorithm: selectedAlgorithm,
        accuracy: accuracy.toFixed(2),
      };

      navigation.navigate('ResultScreen', { result });
    } catch (err) {
      Alert.alert("Erro", "Ocorreu um erro ao processar o arquivo.");
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
