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

const { width } = Dimensions.get("window");

const flags = {
  Spanish: { img: require("../../../images/Banderas/ES.png"), emoji: "🇪🇸" }, // Español
  English: { img: require("../../../images/Banderas/GB.png"), emoji: "🇬🇧" }, // Inglés
  French: { img: require("../../../images/Banderas/FR.png"), emoji: "🇫🇷" }, // Francés
  German: { img: require("../../../images/Banderas/DE.png"), emoji: "🇩🇪" }, // Alemán
  Italian: { img: require("../../../images/Banderas/IT.png"), emoji: "🇮🇹" }, // Italiano
  Portuguese: { img: require("../../../images/Banderas/PT.png"), emoji: "🇵🇹" }, // Portugués
  Dutch: { img: require("../../../images/Banderas/NL.png"), emoji: "🇳🇱" }, // Holandés
  Russian: { img: require("../../../images/Banderas/RU.png"), emoji: "🇷🇺" }, // Ruso
  Chinese: { img: require("../../../images/Banderas/CN.png"), emoji: "🇨🇳" }, // Chino
  Japanese: { img: require("../../../images/Banderas/JP.png"), emoji: "🇯🇵" }, // Japonés
  Korean: { img: require("../../../images/Banderas/KR.png"), emoji: "🇰🇷" }, // Coreano
  Arabic: { img: require("../../../images/Banderas/SA.png"), emoji: "🇸🇦" }, // Árabe
  Turkish: { img: require("../../../images/Banderas/TR.png"), emoji: "🇹🇷" }, // Turco
  Bulgarian: { img: require("../../../images/Banderas/BG.png"), emoji: "🇧🇬" }, // Búlgaro
  Czech: { img: require("../../../images/Banderas/CZ.png"), emoji: "🇨🇿" }, // Checo
  Danish: { img: require("../../../images/Banderas/DK.png"), emoji: "🇩🇰" }, // Danés
  Finnish: { img: require("../../../images/Banderas/FI.png"), emoji: "🇫🇮" }, // Finlandés
  Greek: { img: require("../../../images/Banderas/GR.png"), emoji: "🇬🇷" }, // Griego
  Hungarian: { img: require("../../../images/Banderas/HU.png"), emoji: "🇭🇺" }, // Húngaro
  Indonesian: { img: require("../../../images/Banderas/ID.png"), emoji: "🇮🇩" }, // Indonesio
  Hebrew: { img: require("../../../images/Banderas/IL.png"), emoji: "🇮🇱" }, // Hebreo
  Hindi: { img: require("../../../images/Banderas/IN.png"), emoji: "🇮🇳" }, // Hindi
  Persian: { img: require("../../../images/Banderas/IR.png"), emoji: "🇮🇷" }, // Persa
  Malay: { img: require("../../../images/Banderas/MY.png"), emoji: "🇲🇾" }, // Malayo
  Norwegian: { img: require("../../../images/Banderas/NO.png"), emoji: "🇳🇴" }, // Noruego
  Filipino: { img: require("../../../images/Banderas/PH.png"), emoji: "🇵🇭" }, // Filipino
  Polish: { img: require("../../../images/Banderas/PL.png"), emoji: "🇵🇱" }, // Polaco
  Romanian: { img: require("../../../images/Banderas/RO.png"), emoji: "🇷🇴" }, // Rumano
  Swedish: { img: require("../../../images/Banderas/SE.png"), emoji: "🇸🇪" }, // Sueco
  Thai: { img: require("../../../images/Banderas/TH.png"), emoji: "🇹🇭" }, // Tailandés
  Ukrainian: { img: require("../../../images/Banderas/UA.png"), emoji: "🇺🇦" }, // Ucraniano
  Vietnamese: { img: require("../../../images/Banderas/VN.png"), emoji: "🇻🇳" }, // Vietnamita
};



const learningImg = require("../../../images/LogosExchanges/Studying.png");
const speak = require("../../../images/LogosExchanges/Speak.png")
const level = require("../../../images/LogosExchanges/Nivel.png")
const students = require("../../../images/LogosExchanges/Estudiante.png")


const levelColors = {
  A1: "#A5D6A7",
  A2: "#4CAF50",
  B1: "#FFB74D",
  B2: "#FF9800",
  C1: "#E57373",
  C2: "#D32F2F",
};

export default function ExchangeTarget({
  centro,
  profesor,
  alumnos,
  nivel,
  profesorImagen,
  idiomaDeseado,
  idioma,
  onChatPress
}) {
  const { darkMode } = useTheme();

  const flagInfo = flags[idiomaDeseado] || { img: require("../../../images/Banderas/Grey.jpg")};
  const flagInfo2 = flags[idioma] || { img: require("../../../images/Banderas/Grey.jpg")};

  return (
    <ImageBackground
      source={flagInfo.img}
      style={[styles.card, { width: width * 0.56, maxWidth: 250 }]}
      resizeMode="cover"
    >
      <View style={[styles.overlay, { backgroundColor: darkMode ? "#242323" : "white" },{ borderColor: darkMode ? null : "#d6d4d4" }]}>
        <Text style={[styles.title, { color: darkMode ? "white" : "black" }]} numberOfLines={1} ellipsizeMode="tail">
          {centro}
        </Text>

        <View style={styles.profesorContainer}>
          {profesorImagen ? (
            <Image source={profesorImagen} style={styles.profesorImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={40} color="gray" />
          )}
          <Text style={[styles.profesorText, { color: darkMode ? "white" : "black" }]} numberOfLines={1} ellipsizeMode="tail">
            {profesor}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image source={learningImg} style={styles.studyIcon} />
          <Text style={{ color: darkMode ? "white" : "black", fontSize: 12 }}> Learning: </Text>
          <Text style={{ color: darkMode ? "white" : "black", fontSize: 12, fontWeight: "bold" }}>{idiomaDeseado} </Text>
          <Image source={flagInfo.img} style={styles.flag} />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image source={speak} style={styles.studyIcon} />
          <Text style={{ color: darkMode ? "white" : "black", fontSize: 12 }}> Speak: </Text>
          <Text style={{ color: darkMode ? "white" : "black", fontSize: 12, fontWeight: "bold" }}>{idioma} </Text>
               <Image source={flagInfo2.img} style={styles.flag} />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image source={level} style={styles.studyIcon} />
          <Text style={{ color: darkMode ? "white" : "black", fontSize: 12 }}> Level: </Text>
          <View style={[styles.highlightContainer, { backgroundColor: levelColors[nivel] || "#A5D6A7" }]}>
            <Text style={styles.highlightText}>{nivel.toUpperCase()}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image source={students} style={styles.studyIcon} />
          <Text style={{ color: darkMode ? "white" : "black", fontSize: 12 }}> Students: </Text>
          <Text style={{ color: darkMode ? "white" : "black", fontSize: 12, fontWeight: "bold" }}>{alumnos}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.chatButton]}
            onPress={onChatPress}
            activeOpacity={0.7}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="chatbubble-outline" size={16} color="white" />
              <Text style={styles.buttonText}>Chat</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 10,
    elevation: 8, 
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 4, 
    shadowRadius: 6, 
    alignSelf: "center",
    overflow: "hidden",
  },

  overlay: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.92)", 
    borderColor: "#d6d4d4",
    borderWidth: 0.5,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  profesorContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  profesorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: "left"
  },
  highlightContainer: {
    backgroundColor: "#A5D6A7",
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  highlightText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
   flag: {
    width: 20,
    height: 15,
    marginRight: 5,
    resizeMode: "contain",
  },
  studyIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
    resizeMode: "contain",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent:"center",
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "48%",
    elevation: 2,
  },
  chatButton: {
    backgroundColor: "#1E88E5",
  },
  solicitudButton: {
    backgroundColor: "#FF5722",
  },
  buttonContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    marginTop: 2, 
  },
});
