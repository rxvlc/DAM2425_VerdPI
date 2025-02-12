import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Platform, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useFilters } from "../../context/FiltersContext"; // Importamos el context
import Toast from 'react-native-toast-message';
import LanguageSelector from "../../components/LanguageSelector"; // Asegúrate de que el selector también tenga los mismos estilos

export default function SearchFilterScreen(props) {
  const { filters, updateFilter } = useFilters();
  const [nativeLanguage, setNativeLanguage] = useState(filters.nativeLanguage);
  const [targetLanguage, setTargetLanguage] = useState(filters.targetLanguage);
  const [academicLevel, setAcademicLevel] = useState(filters.academicLevel);
  const [beginDate, setBeginDate] = useState(filters.beginDate);
  const [endDate, setEndDate] = useState(filters.endDate);
  const [quantityStudentsMin, setQuantityStudentsMin] = useState(filters.quantityStudentsMin);
  const [quantityStudentsMax, setQuantityStudentsMax] = useState(filters.quantityStudentsMax);
  const [university, setUniversity] = useState(filters.university);

  const handleSaveFilters = () => {
    // Actualizamos el contexto con los filtros seleccionados
    updateFilter("nativeLanguage", nativeLanguage);
    updateFilter("targetLanguage", targetLanguage);
    updateFilter("academicLevel", academicLevel); // Actualizamos academicLevel
    updateFilter("beginDate", beginDate);
    updateFilter("endDate", endDate);
    updateFilter("quantityStudentsMin", quantityStudentsMin);
    updateFilter("quantityStudentsMax", quantityStudentsMax);
    updateFilter("university", university);
    Toast.show({
        type: 'success', // Tipo de toast (puedes personalizarlo con 'error', 'info', 'success', etc.)
        position: 'bottom', // Posición del toast
        text1: 'Filtros Guardados', // Título del toast
        text2: 'Los filtros se han guardado correctamente.' // Texto adicional del toast
      });
    props.navigation.goBack();
  };

  const handleLanguageNative = (language) => {
    setNativeLanguage(language);
  };

  const handleLanguageTarget = (language) => {
    setTargetLanguage(language);
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      scrollEnabled={!open} // Deshabilitar el scroll cuando el dropdown está abierto
    >
      <Text style={styles.title}>Filtros</Text>

      {/* LanguageSelector para nativeLanguage */}
      <LanguageSelector onLanguageChange={handleLanguageNative} name="native" style={styles.languageSelector} />

      {/* LanguageSelector para targetLanguage */}
      <LanguageSelector onLanguageChange={handleLanguageTarget} name="target" style={styles.languageSelector} />

      {/* Picker para academicLevel con niveles A1, A2, B1, B2, etc. */}
      <Picker
        selectedValue={academicLevel}
        style={styles.input}
        onValueChange={(itemValue) => setAcademicLevel(itemValue)}
      >
        <Picker.Item label="Select Academic Level" value={null} />
        <Picker.Item label="A1" value="A1" />
        <Picker.Item label="A2" value="A2" />
        <Picker.Item label="B1" value="B1" />
        <Picker.Item label="B2" value="B2" />
        <Picker.Item label="C1" value="C1" />
        <Picker.Item label="C2" value="C2" />
      </Picker>

      {/* Input para beginDate */}
      <TextInput
        placeholder="Begin Date (YYYY-MM-DD)"
        style={styles.input}
        value={beginDate}
        onChangeText={setBeginDate}
      />

      {/* Input para endDate */}
      <TextInput
        placeholder="End Date (YYYY-MM-DD)"
        style={styles.input}
        value={endDate}
        onChangeText={setEndDate}
      />

      {/* Input para quantityStudentsMin */}
      <TextInput
        placeholder="Min. Students"
        style={styles.input}
        value={quantityStudentsMin}
        onChangeText={(text) => setQuantityStudentsMin(Number(text))}
        keyboardType="numeric"
      />

      {/* Input para quantityStudentsMax */}
      <TextInput
        placeholder="Max. Students"
        style={styles.input}
        value={quantityStudentsMax}
        onChangeText={(text) => setQuantityStudentsMax(Number(text))}
        keyboardType="numeric"
      />

      {/* Input para university */}
      <TextInput
        placeholder="University"
        style={styles.input}
        value={university}
        onChangeText={setUniversity}
      />

      <Button title="Guardar Filtros" onPress={handleSaveFilters} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10, // Todos los elementos ahora tienen el mismo margen inferior
    borderRadius: 5,
    fontSize: 16,
  },
  languageSelector: {
    marginBottom: 10, // Asegura que haya un espaciado uniforme entre los selectores de idioma y los demás elementos
  }
});