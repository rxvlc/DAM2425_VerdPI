import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function Busquedas() {
  const { darkMode } = useTheme();
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <View style={styles.zonaBusqueda}>
        <View style={[styles.searchBar, darkMode && styles.searchBarDark]}>
          <Ionicons name="search" size={20} color={darkMode ? "#ccc" : "#A0A0A0"} />
          <TextInput
            placeholder="Search..."
            placeholderTextColor={darkMode ? "#bbb" : "#A0A0A0"}
            style={[styles.input, darkMode && styles.inputDark]}
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      <View style={styles.zonaResultados}>
        {resultados.length > 0 ? (
          resultados.map((item, index) => (
            <Text key={index} style={[styles.resultadoItem, darkMode && styles.textDark]}>
              {item}
            </Text>
          ))
        ) : (
          <Text style={darkMode && styles.textDark}>No hay resultados</Text>
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
    padding: 10,
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  zonaBusqueda: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  zonaResultados: {
    flex: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E5E5",
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 40,
    width: "90%",
  },
  searchBarDark: {
    backgroundColor: "#333",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  inputDark: {
    color: "white",
  },
  resultadoItem: {
    fontSize: 16,
    marginVertical: 5,
    color: "#333",
  },
  textDark: {
    color: "white",
  },
});
