import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";

export default function CreateGroup({ onClose }) {
  const [name, setName] = useState("");
  const [nivel, setNivel] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [languaje, setLanguaje] = useState("");

  const handleNivelPress = (selectedNivel) => {
    if (nivel === selectedNivel) {
      switch (selectedNivel) {
        case "A1":
          setNivel("A2");
          break;
        case "A2":
          setNivel(null);
          break;
        case "B1":
          setNivel("B2");
          break;
        case "B2":
          setNivel(null);
          break;
        case "C1":
          setNivel("C2");
          break;
        case "C2":
          setNivel(null);
          break;
        default:
          setNivel(null);
      }
    } else {
      setNivel(selectedNivel);
    }
  };

  const handleSave = async () => {
    if (!name || !languaje) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const data = {
      name,
      nivel,
      quantity,
      languaje,
    };

    try {
      console.log("Enviando datos:", data);
      // Simulación de envío a API (reemplazar con fetch si es necesario)
      Alert.alert("Éxito", "Grupo creado exitosamente");
      onClose();
    } catch (error) {
      Alert.alert("Error de conexión", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Nombre del Grupo</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ingrese el nombre del grupo"
        />

        <Text style={styles.label}>Nivel {nivel ? `(${nivel.toUpperCase()})` : ""}</Text>
        <View style={styles.trafficLight}>
          <TouchableOpacity
            style={[styles.light, nivel === "A1" && styles.lightGreenA1, nivel === "A2" && styles.lightGreenA2]}
            onPress={() => handleNivelPress("A1")}
          />
          <TouchableOpacity
            style={[styles.light, nivel === "B1" && styles.lightYellowB1, nivel === "B2" && styles.lightYellowB2]}
            onPress={() => handleNivelPress("B1")}
          />
          <TouchableOpacity
            style={[styles.light, nivel === "C1" && styles.lightRedC1, nivel === "C2" && styles.lightRedC2]}
            onPress={() => handleNivelPress("C1")}
          />
        </View>

        <Text style={styles.label}>Cantidad de Alumnos</Text>
        <TextInput
          style={styles.input}
          value={quantity.toString()}
          onChangeText={(text) => setQuantity(parseInt(text) || 1)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Idioma</Text>
        <TextInput
          style={styles.input}
          value={languaje}
          onChangeText={setLanguaje}
          placeholder="Ingrese el idioma"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  trafficLight: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  light: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
  },
  lightGreenA1: {
    backgroundColor: "#A8E6A2",
  },
  lightGreenA2: {
    backgroundColor: "#4CAF50",
  },
  lightYellowB1: {
    backgroundColor: "#FFEE99",
  },
  lightYellowB2: {
    backgroundColor: "#FFCC00",
  },
  lightRedC1: {
    backgroundColor: "#FFB3B3",
  },
  lightRedC2: {
    backgroundColor: "#FF3B30",
  },
  saveButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 40,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});