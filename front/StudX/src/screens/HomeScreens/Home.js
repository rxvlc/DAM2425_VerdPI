import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext"; 

export default function Home() {
  const { darkMode } = useTheme();
  const [nombre, setNombre] = useState("¡Bienvenido Nombre!");

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#111" : "#ff5733" }]}>
      <View style={styles.topContainer}>
        <Text style={[styles.titulo, { color: "#fff" }]}>{nombre}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  topContainer: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});