import React from "react";
import { 
  View, 
  FlatList, 
  StyleSheet 
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import ExchangeTarget from "./components/ExchangeTarget";
import profesores from "../../BDD/Profesores";
import createdExchanges from "../../BDD/CreatedExchanges";
import { useNavigation } from "@react-navigation/native";

const imagenesProfesores = {
  "JuanPerezGomez.webp": require("../../images/FotosPerfil/JuanPerezGomez.webp"),
  "MariaRodriguezLopez.webp": require("../../images/FotosPerfil/MariaRodriguezLopez.webp"),
  "CarlosFernandezMartinez.webp": require("../../images/FotosPerfil/CarlosFernandezMartinez.webp"),
  "AnaSanchezRuiz.webp": require("../../images/FotosPerfil/AnaSanchezRuiz.webp"),
};

export default function Home() {
  const { darkMode } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#111" : "#ff5733" }]}>
      <FlatList
        data={createdExchanges}
        keyExtractor={(profesor) => profesor.id.toString()}
        renderItem={({ item }) => {
          const profesorImagen = imagenesProfesores[item.imagen] || require("../../images/FotosPerfil/img1.jpg");

          return (
            <ExchangeTarget
              centro={item.centro}
              profesor={item.nombre}
              alumnos={item.alumnos}
              nivel={item.dificultad}
              idioma={item.idioma}
              profesorImagen={profesorImagen}
              onChatPress={() => navigation.navigate("Mensajes", { profesor: item.nombre })}
              onSolicitudPress={() => console.log(`Solicitud a ${item.nombre}`)}
            />
          );
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false} 
        keyboardShouldPersistTaps="handled" // Evita que los toques sean bloqueados por el teclado
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
