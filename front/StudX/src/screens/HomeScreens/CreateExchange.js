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
  const [university, setUniversity] = useState(""); // Estado para la universidad
  const [token, setToken] = useState(null); // Estado para el token

  // Efecto para obtener el token y los datos del usuario
  useEffect(() => {
    const fetchTokenAndUserData = async () => {
      try {
        // Obtener el token desde SecureStore
        const tokenFromSecureStore = await SecureStore.getItemAsync("userToken");
        if (!tokenFromSecureStore) {
          console.log("No hay token guardado.");
          Alert.alert("Error", "No se ha encontrado una sesión activa.");
          return;
        }
        setToken(tokenFromSecureStore); // Guardar el token en el estado

        // Realizar la solicitud GET con el token
        const response = await fetch(`http://44.220.1.21:8080/api/users/me?token=${tokenFromSecureStore}`);
        if (response.ok) {
          const data = await response.json();
          setUniversity(data.university || "No disponible"); // Guardar la universidad
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

    const apiUrl = "http://44.220.1.21:8080/api/exchanges"; // URL de la API

    const data = {
      nativeLanguage,
      targetLanguage,
      educationalLevel: academicLevel,
      academicLevel: nivel ? nivel.toUpperCase() : "",
      beginDate: formatFecha(fechaInicio),
      endDate: formatFecha(fechaFin),
      quantityStudents: numAlumnos,
      university, // Usamos el valor de universidad obtenido
      token,
    };

    try {
      console.log("Enviando datos:", data); // Debug

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Alert.alert("Éxito", "Grupo creado exitosamente");
        onClose();
      } else {
        const errorData = await response.json();
        Alert.alert("Error", `No se pudo guardar: ${errorData.message || "Inténtalo de nuevo"}`);
      }
    } catch (error) {
      Alert.alert("Error de conexión", error.message);
    }
  };

  // Función para formatear fecha a DD-MM-YYYY
  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const partes = fecha.split("-");
    return partes.length === 3 ? `${partes[2]}-${partes[1]}-${partes[0]}` : fecha;
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Nombre del Grupo</Text>
        <TextInput
          style={styles.input}
          value={nombreGrupo}
          onChangeText={setNombreGrupo}
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

        <Text style={styles.label}>Idioma Nativo</Text>
        <LanguageSelector name="nativo" onLanguageChange={setNativeLanguage} />

        <Text style={styles.label}>Idioma De Intercambios</Text>
        <LanguageSelector name="intercambio" onLanguageChange={setTargetLanguage} />

        <Text style={styles.label}>Número de alumnos</Text>
        <TextInput
          style={styles.input}
          value={numAlumnos.toString()}
          onChangeText={(text) => setNumAlumnos(parseInt(text) || 1)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Nivel Educacional</Text>
        <TextInput
          style={styles.input}
          value={academicLevel}
          onChangeText={setAcademicLevel}
          placeholder="Ej: Bachiller"
        />

        <Text style={styles.label}>Fecha de inicio</Text>
        <TextInput
          style={styles.input}
          value={fechaInicio}
          onChangeText={setFechaInicio}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Fecha de fin</Text>
        <TextInput
          style={styles.input}
          value={fechaFin}
          onChangeText={setFechaFin}
          placeholder="YYYY-MM-DD"
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
