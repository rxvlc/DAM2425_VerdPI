import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

const LanguageSelector = ({ name, onLanguageChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const languages = [
    { key: "es", value: "Español" },
    { key: "en", value: "Inglés" },
    { key: "fr", value: "Francés" },
    { key: "de", value: "Alemán" },
    { key: "it", value: "Italiano" },
    { key: "it", value: "Italiano" },
    // Puedes agregar más idiomas según lo necesites
  ];

  return (
    <View style={styles.container}>
      <SelectList
        data={languages}
        setSelected={setSelectedLanguage}
        onSelect={(value) => onLanguageChange(value)} // Esta función se pasa como prop para actualizar el idioma seleccionado
        boxStyles={styles.dropdownBox}
        placeholder="Buscar"
        search={true} // Habilita la búsqueda
        searchPlaceholder="Escribe"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
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
});

export default LanguageSelector;
