import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select"; // Usamos react-native-picker-select

const CreatedExchange = ({ onClose }) => {
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [nivel, setNivel] = useState("medio"); // Estado para el nivel

  const [language, setLanguage] = useState(null);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [numAlumnos, setNumAlumnos] = useState(1);

  const [languages] = useState([
    { label: "Español", value: "es" },
    { label: "Inglés", value: "en" },
    { label: "Francés", value: "fr" },
  ]);
  
  const [cursos] = useState([
    { label: "Matemáticas", value: "matematicas" },
    { label: "Historia", value: "historia" },
    { label: "Ciencias", value: "ciencias" },
  ]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <ScrollView>
        <Text style={styles.label}>Nombre del Grupo</Text>
        <TextInput
          style={styles.input}
          value={nombreGrupo}
          onChangeText={setNombreGrupo}
          placeholder="Ingrese el nombre del grupo"
        />

        <Text style={styles.label}>Nivel</Text>
        <View style={styles.trafficLight}>
          {/* Bolas representando el semáforo */}
          <TouchableOpacity
            style={[styles.light, nivel === "bajo" && styles.lightActiveGreen]}
            onPress={() => setNivel("bajo")}
          />
          <TouchableOpacity
            style={[styles.light, nivel === "medio" && styles.lightActiveYellow]}
            onPress={() => setNivel("medio")}
          />
          <TouchableOpacity
            style={[styles.light, nivel === "alto" && styles.lightActiveRed]}
            onPress={() => setNivel("alto")}
          />
        </View>

        <Text style={styles.label}>Idioma</Text>
        <RNPickerSelect
          value={language}
          onValueChange={setLanguage}
          items={languages}
          placeholder={{ label: "Selecciona un idioma", value: null }}
          style={{
            inputIOS: styles.pickerInput,
            inputAndroid: styles.pickerInput,
          }}
        />

        <Text style={styles.label}>Curso</Text>
        <RNPickerSelect
          value={cursoSeleccionado}
          onValueChange={setCursoSeleccionado}
          items={cursos}
          placeholder={{ label: "Selecciona un curso", value: null }}
          style={{
            inputIOS: styles.pickerInput,
            inputAndroid: styles.pickerInput,
          }}
        />

        <Text style={styles.label}>Número de alumnos</Text>
        <TextInput
          style={styles.input}
          value={numAlumnos.toString()}
          onChangeText={(text) => setNumAlumnos(parseInt(text) || 1)}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.saveButton} onPress={onClose}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
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
    marginTop: 20,
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
    backgroundColor: "#ccc", // Bola vacía sin color
  },
  lightActiveRed: {
    backgroundColor: "#FF3B30", // Rojo
  },
  lightActiveYellow: {
    backgroundColor: "#FFCC00", // Amarillo
  },
  lightActiveGreen: {
    backgroundColor: "#4CAF50", // Verde
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
  pickerInput: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "#000",
    marginTop: 20,
  },
});

export default CreatedExchange;
