import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SecureStore from "expo-secure-store";
import LanguageSelector from "../../components/LanguageSelector";
import { SelectList } from "react-native-dropdown-select-list";

export default function CreatedExchange({ onClose }) {
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [nivel, setNivel] = useState(null);
  const [nativeLanguage, setNativeLanguage] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState(null);
  const [numAlumnos, setNumAlumnos] = useState(1);
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());
  const [academicLevel, setAcademicLevel] = useState("");
  const [university, setUniversity] = useState("");
  const [token, setToken] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true); // Estado para controlar el scroll
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchTokenAndUserData = async () => {
      try {
        const tokenFromSecureStore = await SecureStore.getItemAsync(
          "userToken"
        );
        if (!tokenFromSecureStore) {
          console.log("No hay token guardado.");
          Alert.alert("Error", "No se ha encontrado una sesión activa.");
          return;
        }
        setToken(tokenFromSecureStore);

        const response = await fetch(
          `http://44.220.1.21:8080/api/users/me?token=${tokenFromSecureStore}`
        );
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
    const fetchTokenAndGroupData = async () => {
      try {
        const tokenFromSecureStore = await SecureStore.getItemAsync(
          "userToken"
        );
        if (!tokenFromSecureStore) {
          console.log("No hay token guardado.");
          Alert.alert("Error", "No se ha encontrado una sesión activa.");
          return;
        }
        setToken(tokenFromSecureStore);

        // Solicitud para obtener los grupos del profesor
        const response = await fetch(
          `http://44.220.1.21:8080/api/groups?token=${tokenFromSecureStore}`
        );

        if (response.ok) {
          const data = await response.json();
          // Aquí, puedes manejar los grupos obtenidos como desees
          console.log("Grupos:", data);
          setGroups(data); // Asumiendo que tienes un estado `setGroups` para almacenar los grupos
        } else {
          console.log("Error al obtener los grupos del profesor");
          Alert.alert("Error", "No se pudieron obtener los grupos.");
        }
      } catch (error) {
        console.log("Error al obtener el token o los grupos:", error);
        Alert.alert("Error", "Ocurrió un error al obtener los grupos.");
      }
    };

    fetchTokenAndUserData();
    fetchTokenAndGroupData();
  }, []);

  const handleNivelPress = (selectedNivel) => {
    if (nivel === selectedNivel) {
      setNivel(null); // Si ya está seleccionado, deseleccionar
    } else {
      setNivel(selectedNivel); // Seleccionar el nivel
    }
  };

  const handleSave = async () => {
    if (!token) {
      Alert.alert("Error", "No se pudo encontrar el token.");
      return;
    }

    // Validar fechas
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignorar la hora, comparar solo la fecha

    if (fechaInicio < today) {
      Alert.alert("Error", "La fecha de inicio no puede ser anterior a hoy.");
      return;
    }

    if (fechaFin < fechaInicio) {
      Alert.alert(
        "Error",
        "La fecha de fin no puede ser anterior a la fecha de inicio."
      );
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

    try {
      console.log("Enviando datos:", data);

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
        Alert.alert(
          "Error",
          `No se pudo guardar: ${errorData.message || "Inténtalo de nuevo"}`
        );
      }
    } catch (error) {
      Alert.alert("Error de conexión", error.message);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || fechaInicio;
    setShowStartDatePicker(Platform.OS === "ios");

    // Validar que la fecha de inicio no sea anterior a hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignorar la hora, comparar solo la fecha

    if (currentDate < today) {
      Alert.alert("Error", "La fecha de inicio no puede ser anterior a hoy.");
      return;
    }

    setFechaInicio(currentDate);
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || fechaFin;
    setShowEndDatePicker(Platform.OS === "ios");

    // Validar que la fecha de fin no sea anterior a la fecha de inicio
    if (currentDate < fechaInicio) {
      Alert.alert(
        "Error",
        "La fecha de fin no puede ser anterior a la fecha de inicio."
      );
      return;
    }

    setFechaFin(currentDate);
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}
      style={styles.container}
      scrollEnabled={isScrollEnabled} // Controla si el scroll está habilitado
    >
      <Text style={styles.label}>Nombre del Grupo</Text>
      <SelectList
      setSelected={setNombreGrupo}    // Al seleccionar un grupo, se actualiza el estado `nombreGrupo`
      data={groups}                    // Lista de grupos
      save="id"                         // El campo que se usará como valor para `setSelected`
      placeholder="Seleccione un grupo"  // Texto que aparece cuando no hay selección
      label="Nombre del Grupo"          // Etiqueta para el select
      boxStyles={styles.dropdownBox}
    />
      

      <Text style={styles.label}>
        Nivel {nivel ? `(${nivel.toUpperCase()})` : ""}
      </Text>
      <View style={styles.trafficLight}>
        <TouchableOpacity
          style={[
            styles.light,
            nivel === "A1" && styles.lightGreenA1,
            nivel === "A2" && styles.lightGreenA2,
          ]}
          onPress={() => handleNivelPress("A1")}
        />
        <TouchableOpacity
          style={[
            styles.light,
            nivel === "B1" && styles.lightYellowB1,
            nivel === "B2" && styles.lightYellowB2,
          ]}
          onPress={() => handleNivelPress("B1")}
        />
        <TouchableOpacity
          style={[
            styles.light,
            nivel === "C1" && styles.lightRedC1,
            nivel === "C2" && styles.lightRedC2,
          ]}
          onPress={() => handleNivelPress("C1")}
        />
      </View>

      <Text style={styles.label}>Idiomas</Text>
      <View style={styles.languageContainer}>
        <View style={styles.languageSelector}>
          <Text style={styles.label}>Idioma Nativo</Text>
          <LanguageSelector
            name="nativo"
            onLanguageChange={(language) => {
              setNativeLanguage(language);
              setIsScrollEnabled(false); // Deshabilitar el scroll cuando se selecciona un idioma
            }}
          />
        </View>

        <View style={styles.languageSelector}>
          <Text style={styles.label}>Idioma Destino</Text>
          <LanguageSelector
            name="intercambio"
            onLanguageChange={(language) => {
              setTargetLanguage(language);
              setIsScrollEnabled(false); // Deshabilitar el scroll cuando se selecciona un idioma
            }}
          />
        </View>
      </View>

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
      <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
        <Text style={styles.input}>{fechaInicio.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          value={fechaInicio}
          mode="date"
          display="default"
          onChange={onStartDateChange}
        />
      )}

      <Text style={styles.label}>Fecha de fin</Text>
      <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
        <Text style={styles.input}>{fechaFin.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          value={fechaFin}
          mode="date"
          display="default"
          onChange={onEndDateChange}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
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
  dropdownBox: {
    height: 50,
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  light: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
  },
  lightGreenA1: {
    backgroundColor: "green",
  },
  lightGreenA2: {
    backgroundColor: "lightgreen",
  },
  lightYellowB1: {
    backgroundColor: "yellow",
  },
  lightYellowB2: {
    backgroundColor: "lightyellow",
  },
  lightRedC1: {
    backgroundColor: "red",
  },
  lightRedC2: {
    backgroundColor: "lightcoral",
  },
  languageContainer: {
    marginTop: 20,
  },
  languageSelector: {
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    alignItems: "center",
    marginTop: 30,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});
