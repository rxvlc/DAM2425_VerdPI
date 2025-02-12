import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, Dimensions } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext"; 

const { width, height } = Dimensions.get("window");

export default function Perfil() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme(); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        if (!token) {
          console.log("No hay sesión activa.");
          setUserData(null);
          return;
        }

        const response = await fetch(
          `http://44.220.1.21:8080/api/users/me?token=${token}`
        );

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.log("Error: No se pudo obtener la información del usuario.");
          setUserData(null);
        }
      } catch (error) {
        console.log("Error al obtener datos del usuario:", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[styles.container, { backgroundColor: darkMode ? "#121212" : "#F5F5F5" }]}>
        <View style={[styles.profileCard, { backgroundColor: darkMode ? "#1E1E1E" : "#FFF" }]}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../../images/fotoPerfil.jpg")}
              style={styles.avatar}
            />
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="person-circle-outline" size={24} color={darkMode ? "#FFA500" : "#555"} />
              <Text style={[styles.label, { color: darkMode ? "#FFF" : "#333" }]}>Name:</Text>
            </View>
            <Text style={[styles.info, { color: darkMode ? "#BBB" : "#666" }]}>{userData?.name || "No disponible"}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={24} color={darkMode ? "#FFA500" : "#555"} />
              <Text style={[styles.label, { color: darkMode ? "#FFF" : "#333" }]}>Email:</Text>
            </View>
            <Text style={[styles.info, { color: darkMode ? "#BBB" : "#666" }]}>{userData?.email || "No disponible"}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="school-outline" size={24} color={darkMode ? "#FFA500" : "#555"} />
              <Text style={[styles.label, { color: darkMode ? "#FFF" : "#333" }]}>University:</Text>
            </View>
            <Text style={[styles.info, { color: darkMode ? "#BBB" : "#666" }]}>{userData?.university || "No disponible"}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    width: '100%',
    justifyContent: "center",
    alignItems: "center", justifyContent: "center",
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: "flex-start", 
    alignItems: "center",
    
    paddingTop: height * 0.05, 
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    width: '70%',
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    elevation: 5, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 10, 
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    borderWidth: 3,
    borderColor: "#FFA500",
  },
  infoContainer: {
    width: "100%",
    alignItems: "flex-start",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  info: {
    fontSize: 16,
    marginBottom: 15,
  },
});
