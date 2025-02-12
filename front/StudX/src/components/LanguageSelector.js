import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export default function LanguageSelector({ onLanguageChange, name }) {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [open, setOpen] = useState(false);

  const languages = [
    { label: "English", value: "English" },
    { label: "Spanish", value: "Spanish" },
    { label: "French", value: "French" },
    { label: "German", value: "German" },
    { label: "Italian", value: "Italian" },
    { label: "Portuguese", value: "Portuguese" },
    { label: "Japanese", value: "Japanese" },
    { label: "Chinese", value: "Chinese" },
    { label: "Russian", value: "Russian" },
    { label: "Arabic", value: "Arabic" },
  ];

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    onLanguageChange(language); // Llamamos a la función pasada como prop
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Language</Text>

      {/* Dropdown con búsqueda integrada */}
      <DropDownPicker
        open={open}
        value={selectedLanguage}
        items={languages}
        setValue={handleLanguageSelect} // Pasamos la función para actualizar el idioma
        placeholder={`Select a ${name} language`}
        searchable={true} // Activa la búsqueda dentro del dropdown
        setOpen={setOpen}
        containerStyle={[styles.pickerContainer, { zIndex: open ? 1000 : 0 }]}  // Ajusta el zIndex dinámicamente
        searchablePlaceholder={`Search for ${name} language...`}
        searchableError="No languages found"
        style={styles.dropdown}
        dropDownStyle={styles.dropdownList}
      />

      <Text>Selected Language: {selectedLanguage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pickerContainer: {
    height: 50,
  },
  dropdown: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#fff', // Fondo blanco para evitar superposiciones
  },
  dropdownList: {
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 10,
    backgroundColor: '#fff', // Fondo blanco para evitar superposiciones
  },
});