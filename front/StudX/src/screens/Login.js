import React from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, StatusBar, Platform } from "react-native";

export default function Login({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.zonaLogo}>
        <Image source={require("../images/logoIndividual.png")} style={styles.image} />
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
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,

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
