import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const banderas = {
  Spanish: { img: require("../../../images/Banderas/ES.png"), emoji: "🇪🇸" },
  English: { img: require("../../../images/Banderas/GB.png"), emoji: "🇬🇧" },
  French: { img: require("../../../images/Banderas/FR.png"), emoji: "🇫🇷" },
  German: { img: require("../../../images/Banderas/DE.png"), emoji: "🇩🇪" },
  Italian: { img: require("../../../images/Banderas/IT.png"), emoji: "🇮🇹" },
  Portuguese: { img: require("../../../images/Banderas/PT.png"), emoji: "🇵🇹" },
  Dutch: { img: require("../../../images/Banderas/NL.png"), emoji: "🇳🇱" },
  Russian: { img: require("../../../images/Banderas/RU.png"), emoji: "🇷🇺" },
  Chinese: { img: require("../../../images/Banderas/CN.png"), emoji: "🇨🇳" },
  Japanese: { img: require("../../../images/Banderas/JP.png"), emoji: "🇯🇵" },
  Korean: { img: require("../../../images/Banderas/KR.png"), emoji: "🇰🇷" },
  Arabic: { img: require("../../../images/Banderas/SA.png"), emoji: "🇸🇦" },
  Turkish: { img: require("../../../images/Banderas/TR.png"), emoji: "🇹🇷" },
};


const nivelColors = {
  A1: "#A5D6A7", // Verde claro
  A2: "#4CAF50", // Verde más oscuro
  B1: "#FFB74D", // Naranja claro
  B2: "#FF9800", // Naranja fuerte
  C1: "#E57373", // Rojo claro
  C2: "#D32F2F", // Rojo fuerte
};


export default function ExchangeTarget({
  centro,
  profesor,
  alumnos,
  nivel,
  profesorImagen,
  idioma,
  onSolicitudPress,
  onChatPress
}) {
  const { darkMode } = useTheme();
  const navigation = useNavigation();

  // Obtener la bandera y el emoji del idioma o usar valores predeterminados
  const banderaInfo = banderas[idioma] || { img: require("../../../images/Banderas/ES.png"), emoji: "🌍" };

  return (
    <ImageBackground
      source={banderaInfo.img}
      style={[styles.card, { width: width * 0.9, maxWidth: 400 }]}
      resizeMode="cover"
    >
      <View style={[styles.overlay,{backgroundColor: darkMode?"#111":"white"},{borderColor:darkMode?"black":"cecfc7"}]}>
        <Text style={[styles.title, { color: darkMode ? "white" : "black" }]} numberOfLines={1} ellipsizeMode="tail">
          {centro}
        </Text>

        <View style={styles.profesorContainer}>
          {profesorImagen ? (
            <Image source={profesorImagen} style={styles.profesorImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={50} color="gray" />
          )}
          <Text style={[styles.profesorText, { color: darkMode ? "white" : "black" }]} numberOfLines={1} ellipsizeMode="tail">
            {profesor}
          </Text>
        </View>


        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color:darkMode? "white":"black", fontSize: 16 }}>🌍 Idioma: </Text>
          <Text style={{color:darkMode? "white":"black", fontSize: 16, fontWeight: "bold" }}>{idioma} {banderaInfo.emoji}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color:darkMode? "white":"black", fontSize: 16 }}>📚 Nivel: </Text>
          <View style={[styles.highlightContainer, { backgroundColor: nivelColors[nivel] || "#A5D6A7" }]}>
            <Text style={styles.highlightText}>{nivel.toUpperCase()}</Text>
          </View>
        </View>


        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color:darkMode? "white":"black", fontSize: 16 }}>🎓 Alumnos: </Text>
          <Text style={{ color:darkMode? "white":"black",fontSize: 16, fontWeight: "bold" }}>{alumnos}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.chatButton]}
            onPress={onChatPress}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Chatear</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.solicitudButton]}
            onPress={onSolicitudPress}
            activeOpacity={0.7}
          >
            <Ionicons name="document-text-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Solicitar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 12,
    marginVertical: 15,
    elevation: 5,
    alignSelf: "center",
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    borderColor: "#cecfc7",
    borderWidth: 0.5
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  profesorContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  profesorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: "left"
  },
  highlightContainer: {
    backgroundColor: "#A5D6A7", // Verde clarito
    paddingVertical: 4,
    paddingHorizontal: 7,
    borderRadius: 8,
    alignSelf: "flex-start", // Ajusta al tamaño del texto
    marginBottom: 5,
  },
  highlightText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
  },
  chatButton: {
    backgroundColor: "#1E88E5",
  },
  solicitudButton: {
    backgroundColor: "#FF5722",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
