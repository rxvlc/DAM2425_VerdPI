import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from '@react-navigation/native';
import Chat from './Components/Chat';

export default function Mensajes() {
  const { darkMode } = useTheme();
  const navigation = useNavigation();

  const [chats, setChats] = useState([
    { id: '1', name: 'Juan', image: 'img1.jpg', messages: [
        { id: 'm1', text: 'Hola, ¿cómo estás?', isOwn: false },
        { id: 'm2', text: 'con tu madre y tu?', isOwn: true }
      ]
    },
    { id: '2', name: 'Maria', image: 'img2.jpg', messages: [
        { id: 'm3', text: 'Nos vemos luego. Deberíamos de mirar cómo implementamos todo esto en la app', isOwn: false },
        { id: 'm4', text: 'Sí, hasta pronto.', isOwn: true }
      ]
    }
  ]);
  
  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#111' : '#fff' }]}> 
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Chat chat={item} onPress={() => navigation.navigate('ChatScreen', { chat: item })} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  }
});
