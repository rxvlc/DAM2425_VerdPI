import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function Perfil() {
  const { darkMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#111" : "#fff" }]}>
      <Text style={[styles.texto, { color: darkMode ? "#fff" : "#000" }]}>Aquí irá el perfil</Text>
      <StatusBar style={darkMode ? "light" : "dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  texto: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
