import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import LanguageSelector from "../../components/LanguageSelector";

export default function CreatedExchange({ onClose }) {
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [nivel, setNivel] = useState(null);
  const [nativeLanguage, setNativeLanguage] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState(null);
  const [numAlumnos, setNumAlumnos] = useState(1);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const [university, setUniversity] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchTokenAndUserData = async () => {
      try {
        const tokenFromSecureStore = await SecureStore.getItemAsync("userToken");
        if (!tokenFromSecureStore) {
          console.log("No hay token guardado.");
          Alert.alert("Error", "No se ha encontrado una sesión activa.");
          return;
        }
        setToken(tokenFromSecureStore);

        const response = await fetch(`http://44.220.1.21:8080/api/users/me?token=${tokenFromSecureStore}`);
        if (response.ok) {
          const data = await response.json();
          setUniversity(data.university || "No disponible");
        } else {
          console.log("Error al obtener los datos del usuario");
        }
      } catch (error) {
        console.log("Error al obtener el token o datos del usuario:", error);
      }
    };
    fetchTokenAndUserData();
  }, []);

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
    if (!token) {
      Alert.alert("Error", "No se pudo encontrar el token.");
      return;
    }

    const apiUrl = "http://44.220.1.21:8080/api/exchanges";
    const data = {
      nativeLanguage,
      targetLanguage,
      educationalLevel: academicLevel,
      academicLevel: nivel ? nivel.toUpperCase() : "",
      beginDate: formatFecha(fechaInicio),
      endDate: formatFecha(fechaFin),
      quantityStudents: numAlumnos,
      university,
      token,
    };

    console.log("Token:", token);
    console.log("Datos a enviar:", JSON.stringify(data, null, 2));

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();
      console.log("Código de respuesta:", response.status);
      console.log("Respuesta del servidor:", responseText);

      if (response.ok) {
        Alert.alert("Éxito", "Grupo creado exitosamente");
        onClose();
      } else {
        Alert.alert("Error", `No se pudo guardar: ${responseText}`);
      }
    } catch (error) {
      Alert.alert("Error de conexión", error.message);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const partes = fecha.split("-");
    return partes.length === 3 ? `${partes[2]}-${partes[1]}-${partes[0]}` : fecha;
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Group Name</Text>
        <TextInput placeholder="Enter the group name" onChangeText={setNombreGrupo} />

        <Text style={styles.label}>Level {nivel ? `(${nivel.toUpperCase()})` : ""}</Text>
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

        <Text style={styles.label}>Native Language</Text>
        <LanguageSelector name="nativo" onLanguageChange={setNativeLanguage} />

        <Text style={styles.label}>Target Language</Text>
        <LanguageSelector name="intercambio" onLanguageChange={setTargetLanguage} />

        <Text style={styles.label}>Nº Of Students</Text>
        <TextInput keyboardType="numeric" onChangeText={(text) => setNumAlumnos(Number(text))} />

        <Text style={styles.label}>Educational Level</Text>
        <TextInput placeholder="Ex: Bachelor" onChangeText={setAcademicLevel} />

        <Text style={styles.label}>Begin Date</Text>
        <TextInput placeholder="YYYY-MM-DD" onChangeText={setFechaInicio} />

        <Text style={styles.label}>End Date</Text>
        <TextInput placeholder="YYYY-MM-DD" onChangeText={setFechaFin} />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
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
  trafficLight: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  light: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
  },
  lightGreenA1: { backgroundColor: "#A8E6A2" },
  lightGreenA2: { backgroundColor: "#4CAF50" },
  lightYellowB1: { backgroundColor: "#FFEE99" },
  lightYellowB2: { backgroundColor: "#FFCC00" },
  lightRedC1: { backgroundColor: "#FFB3B3" },
  lightRedC2: { backgroundColor: "#FF3B30" },
  saveButton: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
