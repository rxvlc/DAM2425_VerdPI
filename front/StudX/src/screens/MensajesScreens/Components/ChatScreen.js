import React, { useState, useRef } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "../../../context/ThemeContext";
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Mensaje from './Mensaje';

const Stack = createStackNavigator();

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

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#121212' : '#fff' }]}> 
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={darkMode ? "white" : "black"} />
        </TouchableOpacity>
        <Text style={[styles.tituloChat, { color: darkMode ? "white" : "black" }]}>{chat.name}</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={mensajes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Mensaje mensaje={item} darkMode={darkMode} />}
      />
      <View style={[styles.inputContainer, { backgroundColor: darkMode ? '#1E1E1E' : '#fff', borderColor: darkMode ? "#555" : "#ccc" }]}> 
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  botonVolver: {
    position: 'absolute',
    left: 10,
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
    marginRight: 10,
  },
  botonEnviar: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 20,
  },
});