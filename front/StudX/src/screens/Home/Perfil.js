import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Card, Title } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const Perfil = () => {
  const [photoUser, setPhotoUser] = useState();
  const [fotoFondo, setFotoFondo] = useState();

  return (
    <View style = {styles.container}>
      <View style = {styles.fotosContainer}>
      </View>
      <View style = {styles.infoContainer}>
        <ScrollView>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  fotosContainer: {
    flex: 30,
    backgroundColor: 'blue'
  },
  infoContainer: {
    flex: 70,
    backgroundColor: 'green'
  }
  
});

export default Perfil;