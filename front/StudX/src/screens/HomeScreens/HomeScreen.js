import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { 
  View, StyleSheet, TouchableOpacity, Text, Dimensions, Image, PixelRatio, TouchableWithoutFeedback, Keyboard 
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Home from "../HomeScreens/Home";
import Perfil from "../PerfilScreens/Perfil";
import Busqueda from "../BusquedaScreens/Busqueda";
import Mensajes from "../MensajesScreens/Mensajes";

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const { darkMode, setDarkMode } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const modo = darkMode ? "Modo Claro" : "Modo Oscuro";

  const cerrarMenu = () => {
    if (menuVisible) setMenuVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={cerrarMenu}>
      <View style={{ flex: 1 }}>
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
              <View style={styles.menuContainer}>
                <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
                  <Ionicons name="ellipsis-vertical" size={PixelRatio.getPixelSizeForLayoutSize(8)} color={darkMode ? "white" : "black"} />
                </TouchableOpacity>
                {menuVisible && (
                  <View style={[styles.menuDropdown, { backgroundColor: darkMode ? "#333" : "white", right: 0 }]}> 
                    <TouchableOpacity style={styles.menuItem} onPress={() => { setDarkMode(!darkMode); cerrarMenu(); }}>
                      <Text style={{ color: darkMode ? "white" : "black", fontSize: width * 0.04 }}>{modo}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={cerrarMenu}>
                      <Text style={{ color: darkMode ? "white" : "black", fontSize: width * 0.04 }}>Ajustes de Perfil</Text>
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
              <TouchableOpacity {...props} activeOpacity={1} onPress={() => { cerrarMenu(); props.onPress(); }} />
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
          <Tab.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
        </Tab.Navigator>
      </View>
    </TouchableWithoutFeedback>
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
    top: height * 0.05,
    backgroundColor: "#333",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.015,
  },
});
