import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  Text, 
  Animated, 
  Dimensions
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../../context/ThemeContext";
import ExchangeTarget from "./components/ExchangeTarget";
import { useNavigation } from "@react-navigation/native";

const API_URL = "http://44.220.1.21:8080/api/exchanges";
const USER_API_URL = "http://44.220.1.21:8080/api/users/me";

const { width } = Dimensions.get("window");
const scaleFont = (size) => (width / 375) * size; 

export default function Home() {
  const { darkMode } = useTheme();
  const navigation = useNavigation();

  const [exchanges, setExchanges] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(false);
  const [userName, setUserName] = useState("Usuario"); 

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        if (!token) {
          console.log("⚠ No hay token guardado.");
          return;
        }
        const response = await fetch(`${USER_API_URL}?token=${token}`);
        if (response.ok) {
          const data = await response.json();
          setUserName(data.name || "Usuario");
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        } else {
          console.log("⚠ Error al obtener el usuario:", response.status);
        }
      } catch (error) {
        console.log("⚠ No se pudo conectar al servidor para obtener el usuario.");
      }
    };
    fetchUserName();
  }, []);

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          console.log("⚠ Error en la respuesta del servidor:", response.status);
          throw new Error("Error en la respuesta del servidor");
        }
        const data = await response.json();
        setExchanges(data);
        setError(false); 
      } catch (error) {
        console.log("⚠ No se pudo conectar al servidor para obtener intercambios.");
        setError(true); 
      } finally {
        setLoading(false);
      }
    };
    fetchExchanges();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#111" : "#ff5733", width }]}>      
      <Animated.View style={[styles.welcomeContainer, { opacity: fadeAnim }]}>
        <Text style={[styles.welcomeText, { color: "white" }]}> 
          ¡Welcome <Text style={styles.userName}>{userName}</Text>!
        </Text>
      </Animated.View>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No hay conexión con el servidor.</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <Text style={styles.exchangesAvailable}>Exchanges Available</Text>
          <FlatList
            data={exchanges}
            key={width > 600 ? "horizontal" : "horizontal-small"}
            keyExtractor={(item) => item.id}
            horizontal
            renderItem={({ item }) => (
              <ExchangeTarget
                centro={item.university}
                profesor={item.idTeacherCreator}
                alumnos={item.quantityStudents}
                nivel={item.academicLevel.toString()}
                idiomaDeseado={item.targetLanguage}
                idioma={item.nativeLanguage}
                onChatPress={() => navigation.navigate("Mensajes", { profesor: item.idTeacherCreator })}
                onSolicitudPress={() => console.log(`Solicitud a ${item.idTeacherCreator}`)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsHorizontalScrollIndicator={false} 
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  listContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  welcomeContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: scaleFont(26), 
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  userName: {
    color: "#FFD700", 
    fontSize: scaleFont(26),
    fontWeight: "bold",
  },
  exchangesAvailable: {
    fontSize: scaleFont(22),
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "left",
    alignSelf: "flex-start",
    marginLeft: 18,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  listContent: {
    alignItems: "center", 
    paddingBottom: 20,
  }
});