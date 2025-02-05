import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Mensaje({ mensaje }) {
  return (
    <View style={[styles.messageContainer, mensaje.isOwn ? styles.ownMessage : styles.otherMessage]}>
      <Text style={styles.messageText}>{mensaje.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '70%',
  },
  ownMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#ccc',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: 'white',
  },
});
