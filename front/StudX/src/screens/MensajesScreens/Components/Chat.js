import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function Chat({ chat, onPress }) {

  const getImageSource = (imageName) => {
    const images = {
      'img1.jpg': require('../../../images/FotosPerfil/img2.jpg'),
      'img2.jpg': require('../../../images/FotosPerfil/img1.jpg'),
    };

    return images[imageName] || require('../../../images/FotosPerfil/img1.jpg'); 
  };


  const lastMessage = chat.messages.length > 0 
    ? chat.messages[chat.messages.length - 1].text 
    : 'No hay mensajes';

  return (
    <TouchableOpacity style={styles.chatContainer} onPress={() => onPress(chat)}>
      <Image source={getImageSource(chat.image)} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <Text style={styles.chatTitle}>{chat.name}</Text>
        <Text style={styles.lastMessage}>{lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: 'gray',
  },
});
