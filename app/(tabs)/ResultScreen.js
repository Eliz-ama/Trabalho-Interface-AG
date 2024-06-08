import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SvgUri from 'react-native-svg-uri';

const ResultScreen = ({ route }) => {
  const { result } = route.params;

  if (result.algorithm === 'KNN') {
    return (
      <View style={styles.container}>
        <Text style={styles.resultText}>Informações da base:</Text>
        <Text style={styles.resultText}> Quantidade de instâncias: {result.instances}</Text>
        <Text style={styles.resultText}> Quantidade de classes: {result.classes}</Text>
        <Text style={styles.resultText}> Quantidade de atributos: {result.attributes}</Text>
        <Text style={styles.resultText}> Informações do algoritmo:</Text>
        <Text style={styles.resultText}> Algoritmo: {result.algorithm}</Text>
        <Text style={styles.resultText}> Taxa de acerto: {result.accuracy}%</Text>
      </View>
    );
  } else if (result.algorithm === 'GeneticAlgorithm') {
    return (
      <View style={styles.container}>
        <Text style={styles.resultText}>O melhor indivíduo:</Text>
        <Text style={styles.resultText}> X = {result.x}</Text>
        <Text style={styles.resultText}> Y = {result.y}</Text>
        <Text style={styles.resultText}> Z = {result.z}</Text>
        <Text style={styles.resultText}> Fitness = {result.fitness}</Text>
        <Text style={styles.resultText}> Informações do algoritmo:</Text>
        <Text style={styles.resultText}> Algoritmo: {result.algorithm}</Text>
      </View>
    );
  } else if (result.algorithm === 'DecisionTree') {
    return (
      <View style={styles.container}>
        <Text style={styles.resultText}>Informações da base:</Text>
        <Text style={styles.resultText}> Quantidade de instâncias: {result.instances}</Text>
        <Text style={styles.resultText}> Quantidade de classes: {result.classes}</Text>
        <Text style={styles.resultText}> Quantidade de atributos: {result.attributes}</Text>
        <Text style={styles.resultText}> Informações do algoritmo:</Text>
        <Text style={styles.resultText}> Algoritmo: {result.algorithm}</Text>
        <Text style={styles.resultText}> Taxa de acerto: {result.accuracy}%</Text>
        {result.decisionTree ? (
          <View style={styles.treeContainer}>
            <SvgUri
              width="100%"
              height="100%"
              source={{ uri: result.decisionTree }} // Certifique-se de que result.decisionTree contém a URL do SVG
            />
          </View>
        ) : (
          <Text style={styles.resultText}>Nenhuma árvore de decisão disponível.</Text>
        )}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  resultText: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'left',
  },
  treeContainer: {
    flex: 1,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default ResultScreen;
