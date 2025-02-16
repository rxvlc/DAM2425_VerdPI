import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Mensaje from "../Components/Mensaje";
import * as SecureStore from "expo-secure-store";
import Toast from 'react-native-toast-message';

export default function ChatScreen({ route }) {
  const { profesor } = route.params; // Usamos 'profesor' para obtener el id del chat
  const { darkMode } = useTheme();
  const navigation = useNavigation();
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const flatListRef = useRef(null);
  const socketRef = useRef(null); // Referencia para WebSocket

  useEffect(() => {
    // Establecer la conexión WebSocket
    const conectarWebSocket = async () => {
      const token = await SecureStore.getItemAsync("userToken"); // Obtén el token de SecureStore
      const email = await SecureStore.getItemAsync("email");

      // Conectar al WebSocket
      socketRef.current = new WebSocket(`ws://44.220.1.21:8080/ws?userId=${email}&idUserRecipient=${profesor}&token=${token}`);

      // Event Listener para mensajes
      socketRef.current.onmessage = (event) => {
        const mensajeRecibido = JSON.parse(event.data);
        console.log('Mensaje recibido:', mensajeRecibido);

        setMensajes((prevMensajes) => [
          ...prevMensajes,
          { ...mensajeRecibido, id: `m${Date.now()}` },
        ]);

        // Scroll hacia abajo cuando llegue un mensaje
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      };

      // Manejar apertura de conexión
      socketRef.current.onopen = () => {
        console.log('Conexión WebSocket abierta');
      };

      // Manejar cierre de conexión
      socketRef.current.onclose = () => {
        console.log('Conexión WebSocket cerrada');
      };

      // Manejar errores
      socketRef.current.onerror = (error) => {
        console.log('Error en WebSocket:', error);
        Alert.alert("Error", "Hubo un problema con la conexión WebSocket.");
      };
    };

    conectarWebSocket();

    // Limpiar la conexión WebSocket cuando el componente se desmonte
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [profesor]);

  // Enviar mensaje a través de WebSocket
  const enviarMensaje = async () => {
    if (nuevoMensaje.trim() === "") return;
  
    const nuevoMsj = { text: nuevoMensaje, isOwn: true };
  
    try {
      
      const token = await SecureStore.getItemAsync("userToken"); // Obtén el token de SecureStore
      const email = await SecureStore.getItemAsync("email");
      // Enviar el mensaje a la API para guardarlo en la base de datos
      const response = await fetch("http://44.220.1.21:8080/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idUserSender: email,
          idUserRecipient: profesor,
          message: nuevoMensaje,
          typeMessage: "text", // Puedes cambiar el tipo de mensaje si es necesario
          token: token
        }),
      });
  
      if (!response.ok) {
        throw new Error("Error al guardar el mensaje");
      }
  
      const savedMessage = await response.json(); // Si todo va bien, obtén el mensaje guardado
  
      // Ahora enviar el mensaje a través de WebSocket
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ 
          ...nuevoMsj,
          id: savedMessage.id, // Usar el ID del mensaje guardado
        }));
        
        // Actualizar la lista de mensajes
        setMensajes((prevMensajes) => [
          ...prevMensajes,
          { ...nuevoMsj, id: savedMessage.id }, // Agregar el mensaje guardado
        ]);
        setNuevoMensaje("");
      } else {
        Alert.alert("Error", "No se pudo enviar el mensaje. La conexión WebSocket no está abierta.");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      Alert.alert("Error", "Hubo un problema al enviar el mensaje.");
    }
  };
  
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? "#121212" : "#fff" },
      ]}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.botonVolver}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={darkMode ? "white" : "black"}
          />
        </TouchableOpacity>
        <Image source={null} style={styles.profileImage} />
        <Text
          style={[styles.tituloChat, { color: darkMode ? "white" : "black" }]}
        >
          {profesor}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={mensajes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Mensaje mensaje={item} darkMode={darkMode} />
        )}
      />

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: darkMode ? "#1E1E1E" : "#fff",
            borderColor: darkMode ? "#555" : "#ccc",
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: darkMode ? "#333" : "#fff",
              borderColor: darkMode ? "#555" : "#ccc",
              color: darkMode ? "white" : "black",
            },
          ]}
          placeholder="Write a message..."
          placeholderTextColor={darkMode ? "#aaa" : "#888"}
          value={nuevoMensaje}
          onChangeText={setNuevoMensaje}
        />
        <TouchableOpacity onPress={enviarMensaje} style={styles.botonEnviar}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
  },
  botonVolver: {
    position: "absolute",
    left: 10,
    top: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  tituloChat: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  botonEnviar: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 20,
  },
});

