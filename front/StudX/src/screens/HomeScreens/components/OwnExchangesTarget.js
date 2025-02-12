import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";

const { width } = Dimensions.get("window");

const banderas = {
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

const nivelColors = {
  A1: "#A5D6A7",
  A2: "#4CAF50",
  B1: "#FFB74D",
  B2: "#FF9800",
  C1: "#E57373",
  C2: "#D32F2F",
};

export default function OwnExchangesTarget({
  alumnos,
  nivel,
  idiomaDeseado,
  idioma,
}) {
  const { darkMode } = useTheme();

  const banderaInfo = banderas[idiomaDeseado] || { img: require("../../../images/Banderas/ES.png"), emoji: "\ud83c\udf0d" };
  const banderaInfo2 = banderas[idioma] || { img: require("../../../images/Banderas/ES.png"), emoji: "\ud83c\udf0d" };

  return (
    <ImageBackground
      source={banderaInfo.img}
      style={[styles.card, { width: width * 0.56, maxWidth: 250 }]}
      resizeMode="cover"
    >
      <View style={[styles.overlay, { backgroundColor: darkMode ? "#242323" : "white" }]}>        
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: darkMode ? "white" : "black", fontSize: 12 }}>🌍 Learning: </Text>
          <Text style={{ color: darkMode ? "white" : "black", fontSize: 12, fontWeight: "bold" }}>{idiomaDeseado} {banderaInfo.emoji}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: darkMode ? "white" : "black", fontSize: 12 }}>🌍 Speak: </Text>
          <Text style={{ color: darkMode ? "white" : "black", fontSize: 12, fontWeight: "bold" }}>{idioma} {banderaInfo2.emoji}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: darkMode ? "white" : "black", fontSize: 12 }}>📚 Level: </Text>
          <View style={[styles.highlightContainer, { backgroundColor: nivelColors[nivel] || "#A5D6A7" }]}>
            <Text style={styles.highlightText}>{nivel.toUpperCase()}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: darkMode ? "white" : "black", fontSize: 12 }}>🎓 Students: </Text>
          <Text style={{ color: darkMode ? "white" : "black", fontSize: 12, fontWeight: "bold" }}>{alumnos}</Text>
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
});
