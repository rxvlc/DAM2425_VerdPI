import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

const LanguageSelector = ({ name, onLanguageChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const languages = [
    { key: "es", value: "Español" },
    { key: "en", value: "Inglés" },
    { key: "fr", value: "Francés" },
    { key: "de", value: "Alemán" },
    { key: "it", value: "Italiano" },
    { key: "pt", value: "Portugués" },
  ];

  return (
    <View style={styles.container}>
      <SelectList
        data={languages}
        setSelected={(val) => {
          setSelectedLanguage(val);
          const selectedObj = languages.find((lang) => lang.value === val);
          onLanguageChange(selectedObj ? selectedObj.key : "");
        }}
        boxStyles={styles.dropdownBox}
        placeholder="Select a Language"
        search={true}
        searchPlaceholder="Search a Language"
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
