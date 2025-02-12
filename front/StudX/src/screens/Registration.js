import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, StatusBar, Alert, ActivityIndicator } from "react-native";
import { CommonActions } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export default function Registration({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [loading, setLoading] = useState(false); // Estado para mostrar el indicador de carga

  const handleRegister = async () => {
    if (!username || !email || !password || !university) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    setLoading(true); // Mostrar indicador de carga

    const userData = {
      name: username,
      email,
      password,
      university,
    };

    try {
      const response = await fetch("http://44.220.1.21:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Éxito',
          text2: 'Registro completado. Ahora puedes iniciar sesión.',
        });

        // 🔥 Redirigir a Login después del registro exitoso
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        );
      } else {
        const responseText = await response.text();
        Alert.alert("Error", responseText || `Error ${response.status}: No se pudo registrar`);
      }
    } catch (error) {
      Alert.alert("Error", "Error en la conexión con el servidor. Verifica tu conexión.");
      console.error("Error en el registro:", error);
    } finally {
      setLoading(false); // Ocultar indicador de carga después de finalizar
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={styles.zonaLogo}>
        <Image source={require("../images/logoIndividual.png")} style={styles.image} />
      </View>
      <View style={styles.zonaUsuariContrasenya}>
        <TextInput style={styles.input} placeholder="Usuario" placeholderTextColor="#888" value={username} onChangeText={setUsername} />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#888" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Universidad" placeholderTextColor="#888" value={university} onChangeText={setUniversity} />
      </View>
      <View style={styles.zonaBoton}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <TouchableOpacity style={styles.boton} onPress={handleRegister}>
            <Text style={styles.botonTexto}>Registrar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  zonaLogo: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  zonaUsuariContrasenya: {
    flex: 2,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  zonaBoton: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
  },
  boton: {
    backgroundColor: "#000",
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: "70%",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 10,
  },
  botonTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: "contain",
    alignSelf: "center",
  },
});
