import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, StatusBar, Platform } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export default function Registration({ navigation }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={styles.zonaLogo}>
        <Image source={require("../images/logoIndividual.png")} style={styles.image} />
      </View>
      <View style={styles.zonaUsuariContrasenya}>
        <TextInput style={styles.input} placeholder="Usuario" placeholderTextColor="#888" />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888" />
        <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#888" secureTextEntry />
        <TextInput style={styles.input} placeholder="Universidad" placeholderTextColor="#888" secureTextEntry/>
      </View>
      <View style={styles.zonaBoton}>
        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("Pantallas")}>
          <Text style={styles.botonTexto}>Registrar</Text>
        </TouchableOpacity>
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
  dropdown: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginVertical: 10,
  },
  dropdownContainer: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    zIndex: 1000, 
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

