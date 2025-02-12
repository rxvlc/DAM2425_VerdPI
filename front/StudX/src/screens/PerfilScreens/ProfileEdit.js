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
  ImageBackground,
} from 'react-native';
import { Avatar, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Dimensions } from 'react-native';
import { useTheme } from "../../context/ThemeContext";

const { width } = Dimensions.get('window'); 

const Perfil = () => {
  const [fotoPerfil, setFotoPerfil] = useState(
    require('../../images/fotoPerfil.jpg')
  );
  const { darkMode } = useTheme();
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
        <Text style={{ textAlign: 'center'}}>
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
      {/* <View style={styles.fotosContainer}>
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
      </View> */}

<View style={styles.fotosContainer}>
  <ImageBackground source={fotoFondo} style={styles.coverImage}>
  <TouchableOpacity style={styles.cameraIconFondo} onPress={openGallery}>
          <IconButton icon="upload" size={25} />
        </TouchableOpacity>
    <View style={styles.avatarWrapper}>
      <Avatar.Image size={width * 0.3} source={fotoPerfil} />
      <TouchableOpacity style={styles.cameraIconPerfil} onPress={openCamera}>
        <IconButton icon="camera" size={25} />
      </TouchableOpacity>
    </View>
  </ImageBackground>
</View>



      <View style={[styles.infoContainer, {backgroundColor: darkMode? "#111":"#fff"}]}>
        <ScrollView>
          <Text style={[styles.label, { color : darkMode ? "white" : "black", width: width * 0.9, maxWidth: 400 }]}>Nombre</Text>
          <TextInput
            style={[styles.input, isFocused && styles.inputFocused]}
            value={name}
            onChangeText={setName}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <Text style={[styles.label, { color : darkMode ? "white" : "black", width: width * 0.9, maxWidth: 400 }]}>Correo</Text>
          <TextInput
            style={[styles.input, isFocused && styles.inputFocused]}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <Text style={[styles.label, { color : darkMode ? "white" : "black", width: width * 0.9, maxWidth: 400 }]}>Rol</Text>
          <Picker
            selectedValue={rol}
            onValueChange={(itemValue) => setRol(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Alumno" value="Alumno" />
            <Picker.Item label="Profesor" value="Profesor" />
          </Picker>

          <Text style={[styles.label, { color : darkMode ? "white" : "black", width: width * 0.9, maxWidth: 400 }]}>Password</Text>
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
          <TouchableOpacity>
            <View style={styles.save}>
              <Text style={styles.saveButt}>Save</Text>
            </View>
          </TouchableOpacity>
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
    width: '100%',
    flex: 35
  },
  infoContainer: {
    flex: 65,
    paddingHorizontal: 15,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  avatarContainer: {
    borderWidth: 6,
    borderRadius: 100,
    borderColor: '#4CAF50',
  },
  avatarWrapper: {
    position: 'absolute', 
    left: 0, 
    bottom: 0,
    alignItems: 'flex-start', 
    padding: 10, 
},

  cameraIconPerfil: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'grey',
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cameraIconFondo: {
    position: 'absolute',
    top: 10, 
    right: 10, 
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'grey',
    padding: 5, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
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
