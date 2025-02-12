import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, Dimensions, ImageBackground, TouchableOpacity } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { Avatar, IconButton } from 'react-native-paper';
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";


const { width, height } = Dimensions.get("window");

export default function Perfil(props) {
  const [fotoPerfil, setFotoPerfil] = useState(
    require('../../images/fotoPerfil.jpg')
  );
  const [fotoFondo, setFotoFondo] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();
  const [editProfileOpened, setEditProfileOpened] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchUserData(); // Refresca los datos cada vez que vuelves a esta pantalla
    }, [])
  );

  useEffect(() => {
    if (editProfileOpened) {
      fetchUserData();
      setEditProfileOpened(false);
    }
  }, [editProfileOpened])
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

  
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFA500" />
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
          <View style={styles.avatarWrapper}>
            <Avatar.Image
              size={width * 0.3}
              source={{
                uri: userData?.urlProfilePicture || "https://picsum.photos/200/200"
              }}
            />
          </View>
        </ImageBackground>
      </View>



      <View style={[styles.infoContainer, { backgroundColor: darkMode ? "#111" : "#fff" }]}>
        <ScrollView>
          <Text style={[styles.label, { color: darkMode ? "white" : "black", width: width * 0.9, maxWidth: 400 }]}>Nombre</Text>
          <Text style={[styles.info, { color: darkMode ? "#BBB" : "#666" }]}>{userData?.name || "No disponible"}</Text>
          <Text style={[styles.label, { color: darkMode ? "white" : "black", width: width * 0.9, maxWidth: 400 }]}>Correo</Text>
          <Text style={[styles.info, { color: darkMode ? "#BBB" : "#666" }]}>{userData?.email || "No disponible"}</Text>
          <Text style={[styles.label, { color: darkMode ? "white" : "black", width: width * 0.9, maxWidth: 400 }]}>University</Text>
          <Text style={[styles.info, { color: darkMode ? "#BBB" : "#666" }]}>{userData?.university || "No disponible"}</Text>
          <TouchableOpacity
            onPress={() => {
              setEditProfileOpened(true);
              props.navigation.navigate("Editar Perfil");
            }}
          >
            <View style={styles.save}>
              <Text style={styles.saveButt}>Edit</Text>
            </View>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </View>
  );
}

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
