import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";

export default function Busquedas() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);

  return (
    <View style={styles.container}>
      <View style={styles.zonaBusqueda}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#A0A0A0" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#A0A0A0"
            style={styles.input}
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      <View style={styles.zonaResultados}>
        {resultados.length > 0 ? (
          resultados.map((item, index) => (
            <Text key={index} style={styles.resultadoItem}>
              {item}
            </Text>
          ))
        ) : (
          <Text>No hay resultados</Text>
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
    paddingHorizontal: 15,
    height: 40,
    width: "90%",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  resultadoItem: {
    fontSize: 16,
    marginVertical: 5,
    color: "#333",
  }, 
});
