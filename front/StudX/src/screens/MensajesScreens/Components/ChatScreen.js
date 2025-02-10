import React, { useState, useRef } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, TextInput, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "../../../context/ThemeContext";
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Mensaje from "../Components/Mensaje";


const images = {
  "JuanPerezGomez.webp": require("../../../images/FotosPerfil/JuanPerezGomez.webp"),
  "MariaRodriguezLopez.webp": require("../../../images/FotosPerfil/MariaRodriguezLopez.webp"),
  "CarlosFernandezMartinez.webp": require("../../../images/FotosPerfil/CarlosFernandezMartinez.webp"),
  "AnaSanchezRuiz.webp": require("../../../images/FotosPerfil/AnaSanchezRuiz.webp"),
  "default": require("../../../images/FotosPerfil/img1.jpg") // Imagen por defecto
};

const getImageSource = (imageName) => {
  return images[imageName] || images["default"];
};

export default function ChatScreen({ route }) {
  const { chat } = route.params;
  const { darkMode } = useTheme();
  const navigation = useNavigation();
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [mensajes, setMensajes] = useState(chat.messages);
  const flatListRef = useRef(null);

  const enviarMensaje = () => {
    if (nuevoMensaje.trim() === '') return;
    const nuevoMsj = { id: `m${Date.now()}`, text: nuevoMensaje, isOwn: true };
    setMensajes([...mensajes, nuevoMsj]);
    setNuevoMensaje('');
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const solicitarPermisos = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Se requieren permisos para acceder a la galería');
      return false;
    }
    return true;
  };

  const enviarFoto = async () => {
    const tienePermiso = await solicitarPermisos();
    if (!tienePermiso) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    
    if (!result.canceled && result.assets.length > 0) {
      const nuevoMsj = { id: `m${Date.now()}`, image: result.assets[0].uri, isOwn: true };
      setMensajes([...mensajes, nuevoMsj]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#121212' : '#fff' }]}> 
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={darkMode ? "white" : "black"} />
        </TouchableOpacity>
        <Image source={getImageSource(chat.image)} style={styles.profileImage} />
        <Text style={[styles.tituloChat, { color: darkMode ? "white" : "black" }]}>{chat.name}</Text>
      </View>

     
      <FlatList
        ref={flatListRef}
        data={mensajes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Mensaje mensaje={item} darkMode={darkMode} />}
      />

     
      <View style={[styles.inputContainer, { backgroundColor: darkMode ? '#1E1E1E' : '#fff', borderColor: darkMode ? "#555" : "#ccc" }]}> 
        <TouchableOpacity onPress={enviarFoto} style={styles.botonAdjuntar}>
          <Ionicons name="image" size={24} color={darkMode ? "white" : "black"} />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { backgroundColor: darkMode ? '#333' : '#fff', borderColor: darkMode ? "#555" : "#ccc", color: darkMode ? "white" : "black" }]}
          placeholder="Escribe un mensaje..."
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
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 10,
  },
  botonVolver: {
    position: 'absolute',
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 20,
  },
  botonAdjuntar: {
    padding: 10,
  },
});
