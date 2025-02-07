import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Dimensions, Linking } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;
const maxImageWidth = screenWidth * 0.6; // La imagen ocupará hasta el 60% del ancho de la pantalla

export default function Mensaje({ mensaje }) {
  const [modalVisible, setModalVisible] = useState(false);
  const { darkMode } = useTheme(); // Obtener modo oscuro

  return (
    <View
      style={[
        mensaje.image || mensaje.document ? styles.fileContainer : styles.messageContainer, // Aplica estilos distintos
        darkMode
          ? mensaje.isOwn
            ? styles.darkOwnMessage
            : styles.darkOtherMessage
          : mensaje.isOwn
          ? styles.ownMessage
          : styles.otherMessage,
      ]}
    >
      {mensaje.text ? (
        <Text style={[styles.messageText, darkMode ? styles.darkText : styles.lightText]}>
          {mensaje.text}
        </Text>
      ) : mensaje.image ? (
        <>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image source={{ uri: mensaje.image }} style={styles.messageImage} />
          </TouchableOpacity>

          {/* Modal para ver la imagen en pantalla completa */}
          <Modal visible={modalVisible} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <Image source={{ uri: mensaje.image }} style={styles.fullscreenImage} />
            </View>
          </Modal>
        </>
      ) : mensaje.document ? (
        <TouchableOpacity style={styles.documentContainer} onPress={() => Linking.openURL(mensaje.document)}>
          <Ionicons name="document" size={24} color="white" />
          <Text style={styles.documentText}>{mensaje.fileName || 'Documento'}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    padding: 8,
    borderRadius: 10,
    marginVertical: 2,
    maxWidth: '75%',
  },
  fileContainer: {
    padding: 8,
    borderRadius: 10,
    marginVertical: 2,
    maxWidth: '75%',
  },
  ownMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
  },
  darkOwnMessage: {
    backgroundColor: '#005BBB',
    alignSelf: 'flex-end',
  },
  darkOtherMessage: {
    backgroundColor: '#222',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  darkText: {
    color: 'white',
  },
  lightText: {
    color: 'black',
  },
  messageImage: {
    width: maxImageWidth,
    height: undefined,
    aspectRatio: 3 / 4,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 10,
    zIndex: 10,
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 10,
  },
  documentText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
});
