// Mensajes.js
import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, BackHandler, TouchableOpacity, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Chat from './Components/Chat';
import Mensaje from './Components/Mensaje';

export default function Mensajes() {
  const [chats, setChats] = useState([
    { id: '1', name: 'Juan', image: 'img1.jpg', messages: [
        { id: 'm1', text: 'Hola, ¿cómo estás?', isOwn: false },
        { id: 'm2', text: 'con tu madre y tu?', isOwn: true }
      ]
    },
    { id: '2', name: 'Maria', image: 'img2.jpg', messages: [
        { id: 'm3', text: 'Nos vemos luego. Deberiamos de mirar como implementamos todo esto en la app', isOwn: false },
        { id: 'm4', text: 'Sí, hasta pronto.', isOwn: true }
      ]
    }
  ]);
  
  const [chatSeleccionado, setChatSeleccionado] = useState(null);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [mensajesDelChat, setMensajesDelChat] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    const backAction = () => {
      if (chatSeleccionado) {
        setChatSeleccionado(null);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [chatSeleccionado]);

  useEffect(() => {
    if (chatSeleccionado) {
      setMensajesDelChat(chatSeleccionado.messages);
    }
  }, [chatSeleccionado]);

  const enviarMensaje = () => {
    if (nuevoMensaje.trim() === '') return;
    const nuevoMsj = { id: `m${Date.now()}`, text: nuevoMensaje, isOwn: true };
    const actualizarChats = chats.map(chat => {
      if (chat.id === chatSeleccionado.id) {
        const updatedMessages = [...chat.messages, nuevoMsj];
        setMensajesDelChat(updatedMessages);
        return { ...chat, messages: updatedMessages, ultimoMensaje: nuevoMensaje };
      }
      return chat;
    });
    setChats(actualizarChats);
    setNuevoMensaje('');
    
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <View style={styles.container}>
      {chatSeleccionado ? (
        <View style={styles.chatContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.botonVolver} onPress={() => setChatSeleccionado(null)}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.tituloChat}>{chatSeleccionado.name}</Text>
          </View>
          <FlatList
            ref={flatListRef}
            data={mensajesDelChat}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Mensaje mensaje={item} />}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un mensaje..."
              value={nuevoMensaje}
              onChangeText={setNuevoMensaje}
            />
            <TouchableOpacity onPress={enviarMensaje} style={styles.botonEnviar}>
              <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Chat chat={item} onPress={setChatSeleccionado} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  chatContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  botonVolver: {
    position: 'absolute',
    left: 10,
    padding: 5,
    borderRadius: 20,
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
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 10,
  },
  botonEnviar: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 20,
  },
});