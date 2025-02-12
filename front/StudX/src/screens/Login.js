import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, StatusBar, Alert, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import { CommonActions } from "@react-navigation/native";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true); // Estado para controlar la carga

  // 🔥 Verificar si hay una sesión activa al cargar la pantalla
  useEffect(() => {
    const checkUserSession = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        // Si hay un token, redirigir automáticamente a HomeScreen
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "HomeScreen" }],
          })
        );
      } else {
        setLoading(false); // Si no hay token, mostrar el formulario de login
      }
    };

    checkUserSession();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://44.220.1.21:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const token = await response.text();
        await SecureStore.setItemAsync("userToken", token);
        await SecureStore.setItemAsync("email", email);
        console.log("token: "+token);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "HomeScreen" }],
          })
        );
      } else {
        const responseText = await response.text();
        Alert.alert("Error", responseText || `Error ${response.status}: No se pudo iniciar sesión`);
      }
    } catch (error) {
      Alert.alert("Error", "Error en la conexión con el servidor");
      console.error("Error en el login:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.zonaLogo}>
        <Image source={require("../images/logoIndividual.png")} style={styles.image} />
      </View>
      <View style={styles.zonaUsuariContrasenya}>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#888" secureTextEntry value={password} onChangeText={setPassword} />
      </View>
      <View style={styles.zonaBoton}>
        <TouchableOpacity style={styles.boton} onPress={handleLogin}>
          <Text style={styles.botonTexto}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <Text style={styles.text}>
          Si no tienes cuenta puedes{" "}
          <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
            <Text style={{ color: "blue" }}> Registrarte</Text>
          </TouchableOpacity>
        </Text>
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
  },
  zonaUsuariContrasenya: {
    flex: 2,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  zonaBoton: {
    flex: 2,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  input: {
    width: "90%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
  },
  boton: {
    backgroundColor: "#000000",
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
  text: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
    marginTop: 10,
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: "contain",
    alignSelf: "center",
  },
});
