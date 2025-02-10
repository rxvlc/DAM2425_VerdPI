import React from "react";
import { View, Text, StyleSheet, Pressable, ImageBackground, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native"; 

const { width } = Dimensions.get("window");

// Importar todas las banderas de forma estática
const banderas = {
  Spanish: require("../../../images/Banderas/ES.png"),
  English: require("../../../images/Banderas/GB.png"),
  French: require("../../../images/Banderas/FR.png"),
  German: require("../../../images/Banderas/DE.png"),
  Italian: require("../../../images/Banderas/IT.png"),
  Portuguese: require("../../../images/Banderas/PT.png"),
  Dutch: require("../../../images/Banderas/NL.png"),
  Russian: require("../../../images/Banderas/RU.png"),
  Chinese: require("../../../images/Banderas/CN.png"),
  Japanese: require("../../../images/Banderas/JP.png"),
  Korean: require("../../../images/Banderas/KR.png"),
  Arabic: require("../../../images/Banderas/SA.png"),
  Turkish: require("../../../images/Banderas/TR.png"),
  Greek: require("../../../images/Banderas/GR.png"),
  Swedish: require("../../../images/Banderas/SE.png"),
  Norwegian: require("../../../images/Banderas/NO.png"),
  Danish: require("../../../images/Banderas/DK.png"),
  Finnish: require("../../../images/Banderas/FI.png"),
  Polish: require("../../../images/Banderas/PL.png"),
  Czech: require("../../../images/Banderas/CZ.png"),
  Hungarian: require("../../../images/Banderas/HU.png"),
  Hebrew: require("../../../images/Banderas/IL.png"),
  Thai: require("../../../images/Banderas/TH.png"),
  Hindi: require("../../../images/Banderas/IN.png"),
  Vietnamese: require("../../../images/Banderas/VN.png"),
  Indonesian: require("../../../images/Banderas/ID.png"),
  Ukrainian: require("../../../images/Banderas/UA.png"),
  Romanian: require("../../../images/Banderas/RO.png"),
  Bulgarian: require("../../../images/Banderas/BG.png"),
  Malay: require("../../../images/Banderas/MY.png"),
  Filipino: require("../../../images/Banderas/PH.png"),
  Persian: require("../../../images/Banderas/IR.png"),
};

export default function ExchangeTarget({ 
  centro, 
  profesor, 
  alumnos, 
  nivel, 
  profesorImagen, 
  idioma,
  onSolicitudPress 
}) {
  const { darkMode } = useTheme();
  const navigation = useNavigation();

  // Obtener la bandera correspondiente o una predeterminada
  const banderaPath = banderas[idioma] || require("../../../images/Banderas/ES.png");

  return (
    <ImageBackground source={banderaPath} style={[styles.card, { width: width * 0.9, maxWidth: 400 }]} resizeMode="cover">
      
      <View style={styles.overlay}>
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

        <Text style={[styles.text, { color: darkMode ? "lightgray" : "black" }]}>
          🎓 Alumnos: {alumnos}
        </Text>
        <Text style={[styles.text, { color: darkMode ? "lightgray" : "black" }]}>
          📚 Nivel: {nivel.toUpperCase()}
        </Text>

        <Text style={[styles.text, { color: darkMode ? "lightgray" : "black" }]}>
          {idioma === "Spanish" ? "🇪🇸" : 
          idioma === "English" ? "🇬🇧" : 
          idioma === "French" ? "🇫🇷" : 
          idioma === "German" ? "🇩🇪" : 
          idioma === "Italian" ? "🇮🇹" : 
          idioma === "Portuguese" ? "🇵🇹" : 
          idioma === "Dutch" ? "🇳🇱" : 
          idioma === "Russian" ? "🇷🇺" : 
          idioma === "Chinese" ? "🇨🇳" : 
          idioma === "Japanese" ? "🇯🇵" : 
          idioma === "Korean" ? "🇰🇷" : 
          idioma === "Arabic" ? "🇸🇦" : 
          idioma === "Turkish" ? "🇹🇷" : 
          idioma === "Greek" ? "🇬🇷" : 
          idioma === "Swedish" ? "🇸🇪" : 
          idioma === "Norwegian" ? "🇳🇴" : 
          idioma === "Danish" ? "🇩🇰" : 
          idioma === "Finnish" ? "🇫🇮" : 
          idioma === "Polish" ? "🇵🇱" : 
          idioma === "Czech" ? "🇨🇿" : 
          idioma === "Hungarian" ? "🇭🇺" : 
          idioma === "Hebrew" ? "🇮🇱" : 
          idioma === "Thai" ? "🇹🇭" : 
          idioma === "Hindi" ? "🇮🇳" : 
          idioma === "Vietnamese" ? "🇻🇳" : 
          idioma === "Indonesian" ? "🇮🇩" : 
          idioma === "Ukrainian" ? "🇺🇦" : 
          idioma === "Romanian" ? "🇷🇴" : 
          idioma === "Bulgarian" ? "🇧🇬" : 
          idioma === "Malay" ? "🇲🇾" : 
          idioma === "Filipino" ? "🇵🇭" : 
          idioma === "Persian" ? "🇮🇷" : "🌍"} Idioma: {idioma}
        </Text>

        <View style={styles.buttonContainer}>
          <Pressable style={[styles.button, styles.chatButton]} onPress={() => navigation.navigate("Mensajes", { profesor })}>
            <Ionicons name="chatbubble-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Chatear</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.solicitudButton]} onPress={onSolicitudPress}>
            <Ionicons name="send-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Solicitar</Text>
          </Pressable>
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
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

