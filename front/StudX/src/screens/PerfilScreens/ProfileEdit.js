import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import * as ImageManipulator from 'expo-image-manipulator';

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
import * as SecureStore from "expo-secure-store";


const { width } = Dimensions.get('window');

const ProfileEdit = (props) => {
  const [fotoPerfil, setFotoPerfil] = useState(
    require('../../images/fotoPerfil.jpg')
  );
  const { darkMode } = useTheme();
  const [fotoFondo, setFotoFondo] = useState(require('../../images/fotoFondo.jpg'));
  const [hasPermission, setHasPermission] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('');

  const [isSecure, setIsSecure] = useState(true);
  const [userData, setUserData] = useState(null);
  

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
        fetchUserData();
    }, [])
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        if (!token) {
          console.log("No hay sesión activa.");
          setUserData(null);
          return;
        }
  
        const response = await fetch(
          `http://44.220.1.21:8080/api/users/me?token=${token}`
        );
  
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          
          setUserData(data);
        } else {
          console.log("Error: No se pudo obtener la información del usuario.");
          setUserData(null);
        }
      } catch (error) {
        console.log("Error al obtener datos del usuario:", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (userData) {
        setName(userData.name || '');
        setEmail(userData.email || '');
        setUniversity(userData.university || '');
      }
    }, [userData]);

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      const compressedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],  // Redimensionar a 800px (ajustable)
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Comprimir al 70%
      );

      setFotoPerfil({ uri: compressedImage.uri });

      // Crear el objeto FormData para enviar el archivo
      const formData = new FormData();
      formData.append("file", {
        uri: compressedImage.uri,
        name: "photo.jpg", // Nombre del archivo
        type: "image/jpeg", // Tipo de archivo
      });

      try {
        // Subir la imagen
        const uploadResponse = await fetch("http://44.220.1.21:8080/api/upload", {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (!uploadResponse.ok) {
          throw new Error("Error al subir la imagen");
        }

        const imageUrl = await uploadResponse.text();
        console.log("URL de la imagen subida:", imageUrl);

        // Obtener el token (ajusta esto según cómo almacenes el token)
        const token = await SecureStore.getItemAsync("userToken");

        // Crear el objeto con la nueva URL
        const updateData = {
          token: token,
          urlProfilePicture: imageUrl,
        };

        console.log(token);
        console.log(imageUrl);
        // Hacer la petición PUT para actualizar el perfil
        const updateResponse = await fetch("http://44.220.1.21:8080/api/auth/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });


        const updateResult = await updateResponse.text();
        console.log("Respuesta de actualización:", updateResult);
      } catch (error) {
        console.error("Error en el proceso:", error);
      }
    }
  };



  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      const uri = result.assets[0].uri;
  
      // Redimensionar y comprimir la imagen
      const compressedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Redimensionar a 800px
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Comprimir al 70%
      );
  
      setFotoFondo({ uri: compressedImage.uri });
  
      // Crear el objeto FormData para enviar el archivo
      const formData = new FormData();
      formData.append("file", {
        uri: compressedImage.uri,
        name: "background.jpg",
        type: "image/jpeg",
      });
  
      try {
        // Subir la imagen al servidor
        const uploadResponse = await fetch("http://44.220.1.21:8080/api/upload", {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        if (!uploadResponse.ok) {
          throw new Error("Error al subir la imagen");
        }
  
        const imageUrl = await uploadResponse.text();
        console.log("URL de la imagen subida:", imageUrl);
  
        // Obtener el token de usuario
        const token = await SecureStore.getItemAsync("userToken");
  
        // Crear el objeto con la nueva URL de fondo
        const updateData = {
          token: token,
          urlHeaderPicture: imageUrl, // Guardar la imagen como fondo
        };
  
        console.log(token);
        console.log(imageUrl);
  
        // Hacer la petición PUT para actualizar el perfil
        const updateResponse = await fetch("http://44.220.1.21:8080/api/auth/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });
  
        const updateResult = await updateResponse.text();
        console.log("Respuesta de actualización:", updateResult);
      } catch (error) {
        console.error("Error en el proceso:", error);
      }
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

  const handleSave = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
  
      if (!token) {
        console.log("No hay sesión activa.");
        return;
      }
  
      const updateData = {
        token: token,
        name: name,
        email: email,
        university: university,
      };
  
      const response = await fetch("http://44.220.1.21:8080/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
  
      if (response.ok) {
        console.log("Perfil actualizado con éxito.");
        fetchUserData(); // Vuelve a cargar los datos actualizados
      } else {
        console.log("Error al actualizar el perfil.");
      }
    } catch (error) {
      console.error("Error en la actualización:", error);
    }
  };

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
        {console.log(userData)
        }
        <ImageBackground source={{uri: userData?.urlHeaderPicture || "https://via.placeholder.com/800x400"}} style={styles.coverImage}>
          <TouchableOpacity style={styles.cameraIconFondo} onPress={openGallery}>
            <IconButton icon="upload" size={25} />
          </TouchableOpacity>
          <View style={styles.avatarWrapper}>
            <Avatar.Image size={width * 0.3} source={{
                uri: userData?.urlProfilePicture || "https://picsum.photos/200/200"
              }} />
            <TouchableOpacity style={styles.cameraIconPerfil} onPress={openCamera}>
              <IconButton icon="camera" size={25} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>



      <View style={[styles.infoContainer, { backgroundColor: darkMode ? "#111" : "#fff" }]}>
        <ScrollView>
          <Text style={[styles.label, { color: darkMode ? "white" : "black", width: width * 0.9, maxWidth: 400 }]}>Nombre</Text>
          <TextInput
            style={[styles.input, isFocused && styles.inputFocused]}
            value={name}
            onChangeText={setName}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <Text style={[styles.label, { color: darkMode ? "white" : "black", width: width * 0.9, maxWidth: 400 }]}>Correo</Text>
          <TextInput
            style={[styles.input, isFocused && styles.inputFocused]}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <Text style={[styles.label, { color: darkMode ? "white" : "black", width: width * 0.9, maxWidth: 400 }]}>University</Text>
          <TextInput
            style={[styles.input, isFocused && styles.inputFocused]}
            value={university}
            onChangeText={setUniversity}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <Text style={[styles.label, { color: darkMode ? "white" : "black", width: width * 0.9, maxWidth: 400 }]}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.textInput, isFocused && styles.inputFocused]}
              value={userData?.password || "No disponible"}
              onChangeText={setPassword}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              secureTextEntry={isSecure}
            />
            <TouchableOpacity onPress={toggleSecureEntry}>
              <IconButton icon="eye" size={25} color="grey" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => {handleSave(); navigation.goBack()}}>
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

export default ProfileEdit;
