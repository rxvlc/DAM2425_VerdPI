import React from "react";
import { View, Text, StyleSheet, Pressable, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native"; 

const { width } = Dimensions.get("window");

export default function ExchangeTarget({ 
  centro, 
  profesor, 
  alumnos, 
  nivel, 
  profesorImagen, 
  onSolicitudPress 
}) {
  const { darkMode } = useTheme();
  const navigation = useNavigation();

  const handleChatPress = () => {
    navigation.navigate("Mensajes", { profesor }); // Enviar datos del profesor a la sección de mensajes
  };

  return (
    <View style={[styles.card, { backgroundColor: darkMode ? "#222" : "#fff", width: width * 0.9, maxWidth: 400 }]}> 
      
     
      <Text style={[styles.title, { color: darkMode ? "white" : "black" }]} numberOfLines={1} ellipsizeMode="tail">
        {centro}
      </Text>

  
      <View style={styles.profesorContainer}>
        {profesorImagen ? (
          <Image source={profesorImagen} style={styles.profesorImage} />
        ) : (
          <Ionicons name="person-circle-outline" size={50} color="gray" />
        )}
        <Text style={[styles.profesorText, { color: darkMode ? "white" : "black" }]} numberOfLines={1} ellipsizeMode="tail">
          {profesor}
        </Text>
      </View>

    
      <Text style={[styles.text, { color: darkMode ? "lightgray" : "black" }]}>🎓 Alumnos: {alumnos}</Text>
      <Text style={[styles.text, { color: darkMode ? "lightgray" : "black" }]}>📚 Nivel: {nivel.toUpperCase()}</Text>

   
      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button, styles.chatButton]} onPress={handleChatPress}>
          <Ionicons name="chatbubble-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Chatear</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.solicitudButton]} onPress={onSolicitudPress}>
          <Ionicons name="send-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Solicitar</Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 12,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  profesorContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 15,
  },
  profesorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  profesorText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: "48%",
    justifyContent: "center",
    elevation: 3,
  },
  chatButton: {
    backgroundColor: "#4CAF50",
  },
  solicitudButton: {
    backgroundColor: "#FF5733",
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "bold",
  },
});
