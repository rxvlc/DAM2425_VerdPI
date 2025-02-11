import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, CommonActions } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  PixelRatio,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../../context/ThemeContext";
import Home from "../HomeScreens/Home";
import Perfil2 from "../PerfilScreens/Perfil2";
import Busqueda from "../BusquedaScreens/Busqueda";
import Mensajes from "../MensajesScreens/Mensajes";

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const { darkMode, setDarkMode } = useTheme();
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const modo = darkMode ? "Modo Claro" : "Modo Oscuro";

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      // Obtener el token almacenado
      const token = await SecureStore.getItemAsync("userToken");
      const email = await SecureStore.getItemAsync("email");

      if (!token) {
        Alert.alert("Error", "No hay sesión activa.");
        return;
      }

      // Enviar petición de logout a la API
      const response = await fetch("http://44.220.1.21:8080/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el header
        },
        body: JSON.stringify({ email, token }), // Enviar datos en el body
      });

      if (response.ok) {
        // Eliminar el token y email de SecureStore
        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("email");

        Alert.alert("Éxito", "Cierre de sesión exitoso");

        // Redirigir al usuario a la pantalla de Login limpiando la pila
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }], // Asegúrate de que "Login" es el nombre correcto de la pantalla
          })
        );
      } else {
        const responseText = await response.text();
        Alert.alert("Error", responseText || `Error ${response.status}: No se pudo cerrar sesión`);
      }
    } catch (error) {
      Alert.alert("Error", "Error en la conexión con el servidor");
      console.error("Error en el logout:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: darkMode ? "#222" : "#fff" },
          headerTintColor: darkMode ? "#fff" : "#000",
          headerTitleAlign: "left",
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <Image
                source={darkMode ? require("../../images/Logos/StudXBlanco.png") : require("../../images/Logos/StudX.png")}
                style={[styles.headerLogo, { width: width * 0.1, height: height * 0.05 }]}
              />
              <Text style={[styles.headerTitleText, { color: darkMode ? "white" : "black" }]}>{route.name}</Text>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              {/* Botón "+" más grande */}
              <TouchableOpacity onPress={() => navigation.navigate("CrearIntercambio")} style={styles.addButton}>
                <Ionicons name="add-circle-outline" size={PixelRatio.getPixelSizeForLayoutSize(12)} color={darkMode ? "white" : "black"} />
              </TouchableOpacity>

              {/* Menú de opciones */}
              <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.menuButton}>
                <Ionicons name="ellipsis-vertical" size={PixelRatio.getPixelSizeForLayoutSize(8)} color={darkMode ? "white" : "black"} />
              </TouchableOpacity>

              {menuVisible && (
                <View style={[styles.menuDropdown, { backgroundColor: darkMode ? "#333" : "white", right: 0 }]}>
                  <TouchableOpacity style={styles.menuItem} onPress={() => { setDarkMode(!darkMode); setMenuVisible(false); }}>
                    <Text style={{ color: darkMode ? "white" : "black", fontSize: width * 0.04 }}>{modo}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                    <Text style={{ color: darkMode ? "white" : "black", fontSize: width * 0.04 }}>Logout</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ),
          tabBarStyle: {
            backgroundColor: darkMode ? "#222" : "#fff",
            borderTopWidth: 0,
          },
          tabBarPressColor: "transparent",
          tabBarButton: (props) => (
            <TouchableOpacity {...props} activeOpacity={1} onPress={() => { setMenuVisible(false); props.onPress(); }} />
          ),
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;
            if (route.name === "Home") iconName = "home-outline";
            else if (route.name === "Busqueda") iconName = "search-outline";
            else if (route.name === "Mensajes") iconName = "chatbubble-outline";
            else if (route.name === "Perfil") iconName = "person-outline";

            return <Ionicons name={iconName} size={size} color={focused ? (darkMode ? "#FFA500" : "tomato") : darkMode ? "white" : color} />;
          },
          tabBarActiveTintColor: darkMode ? "#FFA500" : "tomato",
          tabBarInactiveTintColor: darkMode ? "lightgray" : "gray",
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Busqueda" component={Busqueda} />
        <Tab.Screen name="Mensajes" component={Mensajes} />
        <Tab.Screen name="Perfil" component={Perfil2} options={{ headerShown: false }} />
      </Tab.Navigator>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: width * 0.03,
  },
  addButton: {
    marginRight: width * 0.05,
  },
  menuButton: {
    padding: width * 0.015,
  },
  menuDropdown: {
    position: "absolute",
    top: height * 0.05,
    padding: width * 0.02,
    borderRadius: 8,
    minWidth: width * 0.4,
    elevation: 5,
    alignSelf: "flex-end",
    right: 0,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitleText: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginLeft: 10,
  },
  headerLogo: {
    resizeMode: "contain",
  },
  menuItem: {
    paddingVertical: height * 0.015,
  },
});
