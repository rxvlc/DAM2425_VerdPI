import { StyleSheet, Text, View } from 'react-native';

export default function SearchedExchange({ exchange }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{exchange.university}</Text>
      <Text>{exchange.educationalLevel} - {exchange.academicLevel}</Text>
      <Text>Estudiantes: {exchange.quantityStudents}</Text>
      <Text>Estado: {exchange.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
