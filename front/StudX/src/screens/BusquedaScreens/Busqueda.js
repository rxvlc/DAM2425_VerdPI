import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import SearchedExchange from "../../components/SearchedExchange";
import { useNavigation } from '@react-navigation/native';

export default function Busquedas(props) {
  const { darkMode } = useTheme();
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://44.220.1.21:8080/api/exchanges")
      .then((response) => response.json())
      .then((data) => setResultados(data))
      .catch((error) =>
        console.error("Error fetching random exchanges:", error)
      );
  }, []);

  const buscarExchanges = () => {
    setLoading(true);
    const paramsArray = [
      'nativeLanguage',
      'targetLanguage',
      'educationalLevel',
      'academicLevel',
      'university',
      'status',
      'userId', 
    ];
  
    const resultadosCompletos = [];
  
    const peticiones = paramsArray.map((param) => {
      const params = new URLSearchParams({ [param]: query });
  
      return fetch(`http://44.220.1.21:8080/api/exchanges?${params.toString()}`)
        .then((response) => response.json())
        .then((data) => {
          // Agregar el resultado al array de resultados completos
          resultadosCompletos.push(...data); // Usamos "push(...)" para aplanar el array
        })
        .catch((error) => console.error(`Error fetching ${param}:`, error));
    });
  
    // Esperar a que todas las peticiones terminen
    Promise.all(peticiones)
      .then(() => {
        // Ahora setResultados recibe el array único de todos los datos
        setResultados(resultadosCompletos);
      })
      .finally(() => setLoading(false));
  };
  
  
  const navigation = useNavigation();
  navigation.setOptions({
    headerTitle: "Search"});

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <View style={styles.zonaBusqueda}>
        <View style={[styles.searchBar, darkMode && styles.searchBarDark]}>
          <Ionicons
            name="search"
            size={20}
            color={darkMode ? "#ccc" : "#A0A0A0"}
          />
          <TextInput
            placeholder="Search..."
            placeholderTextColor={darkMode ? "#bbb" : "#A0A0A0"}
            style={[styles.input, darkMode && styles.inputDark]}
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <Pressable
          onPress={() => props.navigation.navigate("SearchFilterScreen")}
        >
          <Ionicons
            name="filter"
            size={24}
            color={darkMode ? "#ccc" : "#A0A0A0"}
            style={styles.filterIcon}
          />
        </Pressable>
        <Pressable onPress={() => buscarExchanges()}>
          <Ionicons
            name="search"
            size={24}
            color={darkMode ? "#ccc" : "#A0A0A0"}
            style={styles.filterIcon}
          />
        </Pressable>
      </View>

      <ScrollView style={styles.zonaResultados}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={darkMode ? "#ffffff" : "#000000"}
            />
          </View>
        ) : resultados.length > 0 ? (
          resultados.map((exchange,index) => (
            <SearchedExchange key={index} exchange={exchange} />
          ))
        ) : (
          <Text style={darkMode && styles.textDark}>No results</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
    padding: 10,
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  zonaBusqueda: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "yellow",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  zonaResultados: {
    flex: 1,
    width: "100%",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E5E5",
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 40,
    flex: 1,
  },
  searchBarDark: {
    backgroundColor: "#333",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  inputDark: {
    color: "white",
  },
  textDark: {
    color: "white",
  },
  filterIcon: {
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
});
