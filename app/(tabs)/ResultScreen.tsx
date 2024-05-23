import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResultScreen = ({ route }) => {
  const { result } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.resultText}>Informações da base:</Text>
      <Text style={styles.resultText}>- Quantidade de instâncias: {result.instances}</Text>
      <Text style={styles.resultText}>- Quantidade de classes: {result.classes}</Text>
      <Text style={styles.resultText}>- Quantidade de atributos: {result.attributes}</Text>
      <Text style={styles.resultText}>Informações do algoritmo:</Text>
      <Text style={styles.resultText}>- Algoritmo: {result.algorithm}</Text>
      <Text style={styles.resultText}>- Taxa de acerto: {result.accuracy}%</Text>
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
  resultText: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default ResultScreen;
