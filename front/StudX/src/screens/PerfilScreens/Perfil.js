import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Text,
  TextInput,
} from 'react-native';
import { Avatar, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

const Perfil = () => {
  const [fotoPerfil, setFotoPerfil] = useState(
    require('../../images/fotoPerfil.jpg')
  );
  const [fotoFondo, setFotoFondo] = useState(require('../../images/fotoFondo.jpg'));
  const [hasPermission, setHasPermission] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [name, setName] = useState('Sergio Samper Calvo');
  const [email, setEmail] = useState('sesaca@alumnatflorida.es');
  const [rol, setRol] = useState('Alumno');
  const [password, setPassword] = useState('hola123');
  const [isSecure, setIsSecure] = useState(true);

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFotoPerfil({ uri: result.assets[0].uri });
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFotoFondo({ uri: result.assets[0].uri });
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to show the camera
        </Text>
        <Pressable onPress={openCamera} style={styles.buttonText}>
          <Text style={{ fontSize: 25, color: 'Black' }}>Grant permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.fotosContainer}>
        <Image source={fotoFondo} style={styles.coverImage} />
        <TouchableOpacity style={styles.cameraIconFondo} onPress={openGallery}>
          <IconButton icon="upload" size={25} />
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          <Avatar.Image size={150} source={fotoPerfil} />
          <TouchableOpacity
            style={styles.cameraIconPerfil}
            onPress={openCamera}>
            <IconButton icon="camera" size={25} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <ScrollView>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={[styles.input, isFocused && styles.inputFocused]}
            value={name}
            onChangeText={setName}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <Text style={styles.label}>Correo</Text>
          <TextInput
            style={[styles.input, isFocused && styles.inputFocused]}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <Text style={styles.label}>Rol</Text>
          <Picker
            selectedValue={rol}
            onValueChange={(itemValue) => setRol(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Alumno" value="Alumno" />
            <Picker.Item label="Profesor" value="Profesor" />
          </Picker>

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.textInput, isFocused && styles.inputFocused]}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              secureTextEntry={isSecure}
            />
            <TouchableOpacity onPress={toggleSecureEntry}>
              <IconButton icon="eye" size={25} color="grey" />
            </TouchableOpacity>
          </View>
          <View style={styles.save}>
            <TouchableOpacity>
              <Text style={styles.saveButt}>Save</Text>
            </TouchableOpacity>
          </View>
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
    flex: 35,
    backgroundColor: '#ecf0f1',
  },
  infoContainer: {
    flex: 65,
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 15,
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  avatarContainer: {
    position: 'absolute',
    top: 125,
    alignItems: 'center',
    borderWidth: 6,
    borderRadius: 100,
    borderColor: '#4CAF50',
  },
  cameraIconPerfil: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'grey',
  },
  cameraIconFondo: {
    position: 'absolute',
    top: 100,
    right: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'grey',
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: 'grey',
  },
  inputFocused: {
    borderColor: '#007AFF',
    color: 'black',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: 'grey',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: 'grey',
  },
  save: {
    marginTop: 120,
    marginBottom: 70,
    backgroundColor: 'black',
    borderRadius: 40,
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButt: {
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Perfil;
