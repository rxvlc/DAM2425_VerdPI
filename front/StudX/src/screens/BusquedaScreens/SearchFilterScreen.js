import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Platform, ScrollView, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useFilters } from "../../context/FiltersContext"; 
import Toast from 'react-native-toast-message';
import LanguageSelector from "../../components/LanguageSelector"; 

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

    updateFilter("nativeLanguage", nativeLanguage);
    updateFilter("targetLanguage", targetLanguage);
    updateFilter("academicLevel", academicLevel); 
    updateFilter("beginDate", beginDate);
    updateFilter("endDate", endDate);
    updateFilter("quantityStudentsMin", quantityStudentsMin);
    updateFilter("quantityStudentsMax", quantityStudentsMax);
    updateFilter("university", university);
    Toast.show({
        type: 'success', 
        position: 'bottom',
        text1: 'Filters saved', 
        text2: 'The filters have been saved successfully.'
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
    <View 
      style={styles.container}
    >
      <Text style={styles.title}>Filters</Text>


      <LanguageSelector onLanguageChange={handleLanguageNative} name="native" style={styles.languageSelector} />


 
      <LanguageSelector onLanguageChange={handleLanguageTarget} name="target" style={styles.languageSelector} />

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

      <TextInput
        placeholder="Begin Date (YYYY-MM-DD)"
        style={styles.input}
        value={beginDate}
        onChangeText={setBeginDate}
      />

      <TextInput
        placeholder="End Date (YYYY-MM-DD)"
        style={styles.input}
        value={endDate}
        onChangeText={setEndDate}
      />

      <TextInput
        placeholder="Min. Students"
        style={styles.input}
        value={quantityStudentsMin}
        onChangeText={(text) => setQuantityStudentsMin(Number(text))}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Max. Students"
        style={styles.input}
        value={quantityStudentsMax}
        onChangeText={(text) => setQuantityStudentsMax(Number(text))}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="University"
        style={styles.input}
        value={university}
        onChangeText={setUniversity}
      />

      <Button title="Save Filters" onPress={handleSaveFilters} />
    </View>
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
    marginBottom: 10, 
    borderRadius: 5,
    fontSize: 16,
  },
  languageSelector: {
    marginBottom: 10,
  }
});