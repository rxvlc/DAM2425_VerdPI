import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import ExchangeTarget from "./components/ExchangeTarget";
import profesores from "../../BDD/Profesores";

const imagenesProfesores = {
  "JuanPerezGomez.webp": require("../../images/FotosPerfil/JuanPerezGomez.webp"),
  "MariaRodriguezLopez.webp": require("../../images/FotosPerfil/MariaRodriguezLopez.webp"),
  "CarlosFernandezMartinez.webp": require("../../images/FotosPerfil/CarlosFernandezMartinez.webp"),
  "AnaSanchezRuiz.webp": require("../../images/FotosPerfil/AnaSanchezRuiz.webp"),
};

export default function Home() {
  const { darkMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#111" : "#ff5733" }]}>
      <FlatList
        data={profesores}
        keyExtractor={(profesor) => profesor.id.toString()}
        renderItem={({ item }) => {
          const profesorImagen = imagenesProfesores[item.imagen] || require("../../images/FotosPerfil/img1.jpg");

          return (
            <ExchangeTarget
              centro={item.centro}
              profesor={item.nombre}
              alumnos={"30"}
              nivel={item.materia}
              profesorImagen={profesorImagen}
              onChatPress={() => console.log(`Chat con ${item.nombre}`)}
              onSolicitudPress={() => console.log(`Solicitud a ${item.nombre}`)}
            />
          );
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false} 
        keyboardShouldPersistTaps="handled" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  listContent: {
    paddingVertical: 20, 
    alignItems: "center", 
  },
});
