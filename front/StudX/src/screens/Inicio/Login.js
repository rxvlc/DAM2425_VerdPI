import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, TouchableOpacity,Image } from "react-native";

export default function Login({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.zonaLogo}>
        {/* <Image source={require("../assets/logoIndividual.png")} style={styles.image} /> */}
      </View>
      <View style={styles.zonaUsuariContrasenya}>
        <TextInput style={styles.input} placeholder="Usuario" placeholderTextColor="#888" />
        <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#888" secureTextEntry />
      </View>
      <View style={styles.zonaBoton}>
        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("HomeScreen")}>
          <Text style={styles.botonTexto}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <Text style={styles.text}>
          Si no tienes cuenta puedes
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  zonaLogo: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  zonaUsuariContrasenya: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  zonaBoton: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  Logo: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  boton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  botonTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    textDecoration: "underline",
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
});
