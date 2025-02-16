import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export default function SearchedExchange({ exchange }) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{exchange.university}</Text>
        <Text>{exchange.educationalLevel} - {exchange.academicLevel}</Text>
        <Text>Estudiantes: {exchange.quantityStudents}</Text>
        <Text>Estado: {exchange.status}</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, styles.chatButton]}
        onPress={null}
        activeOpacity={0.7}
      >
        <View style={styles.buttonContent}>
          <Ionicons name="chatbubble-outline" size={16} color="white" />
          <Text style={styles.buttonText}>Chat</Text>
        </View>
      </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',  // Alinea el contenido de manera que el texto esté a la izquierda y el botón a la derecha
    alignItems: 'center', // Asegura que todo el contenido esté centrado verticalmente
  },
  textContainer: {
    flex: 1, // Permite que el texto ocupe el espacio disponible
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 2,
  },
  chatButton: {
    backgroundColor: "#1E88E5",
  },
  solicitudButton: {
    backgroundColor: "#FF5722",
  },
  buttonContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    marginTop: 2, 
  },
});
