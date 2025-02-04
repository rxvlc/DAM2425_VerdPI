import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, TouchableOpacity, Text, Switch, Dimensions } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Home from "../HomeScreens/Home";
import Perfil from "../PerfilScreens/Perfil";
import Busqueda from "../BusquedaScreens/Busqueda";
import Mensajes from "../MensajesScreens/Mensajes";

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { darkMode, setDarkMode } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: darkMode ? "#222" : "#fff" },
          headerTintColor: darkMode ? "#fff" : "#000",
          headerRight: () => (
            <View style={styles.menuContainer}>
              <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
                <Ionicons name="ellipsis-vertical" size={24} color={darkMode ? "#fff" : "#000"} />
              </TouchableOpacity>
              {menuVisible && (
               <View style={[styles.menuDropdown, { backgroundColor: darkMode ? "#333" :"white", right: width * 0.05, top: 50 }]}> 
                  <TouchableOpacity style={styles.menuItem} onPress={() => setDarkMode(!darkMode)}>
                    <Text style={{ color: darkMode?"white":"black", fontSize: 16 }}>Modo Oscuro</Text>
                    <Switch value={darkMode} onValueChange={setDarkMode} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem}>
                    <Text style={{ color: darkMode?"white":"black", fontSize: 16 }}>Ajustes de Perfil</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ),
          tabBarStyle: {
            backgroundColor: darkMode ? "#222" : "#fff",
            borderTopColor: darkMode ? "#444" : "#ccc",
          },
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;
            if (route.name === "Home") iconName = "home-outline";
            else if (route.name === "Busqueda") iconName = "search-outline";
            else if (route.name === "Mensajes") iconName = "chatbubble-outline";
            else if (route.name === "Perfil") iconName = "person-outline";

            return <Ionicons name={iconName} size={size} color={focused ? "tomato" : darkMode ? "white" : color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: darkMode ? "lightgray" : "gray",
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Busqueda" component={Busqueda} />
        <Tab.Screen name="Mensajes" component={Mensajes} />
        <Tab.Screen name="Perfil" component={Perfil} />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    marginRight: 0,
    position: "relative",
    alignItems: "flex-end",
  },
  menuDropdown: {
    position: "absolute",
    marginTop: "-30%", 
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    minWidth: 150,
    elevation: 5,
}
,
  text: {
    color: "#fff",
  },
  textLight: {
    color: "#000", 
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
});
