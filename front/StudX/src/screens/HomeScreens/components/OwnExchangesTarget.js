import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { useTheme } from "../../../context/ThemeContext";

const { width } = Dimensions.get("window");

const flags = {
  Spanish: { img: require("../../../images/Banderas/ES.png")}, // Español
  English: { img: require("../../../images/Banderas/GB.png")}, // Inglés
  French: { img: require("../../../images/Banderas/FR.png")}, // Francés
  German: { img: require("../../../images/Banderas/DE.png")}, // Alemán
  Italian: { img: require("../../../images/Banderas/IT.png")}, // Italiano
  Portuguese: { img: require("../../../images/Banderas/PT.png")}, // Portugués
  Dutch: { img: require("../../../images/Banderas/NL.png")}, // Holandés
  Russian: { img: require("../../../images/Banderas/RU.png")}, // Ruso
  Chinese: { img: require("../../../images/Banderas/CN.png")}, // Chino
  Japanese: { img: require("../../../images/Banderas/JP.png")}, // Japonés
  Korean: { img: require("../../../images/Banderas/KR.png")}, // Coreano
  Arabic: { img: require("../../../images/Banderas/SA.png")}, // Árabe
  Turkish: { img: require("../../../images/Banderas/TR.png")}, // Turco
  Bulgarian: { img: require("../../../images/Banderas/BG.png")}, // Búlgaro
  Czech: { img: require("../../../images/Banderas/CZ.png")}, // Checo
  Danish: { img: require("../../../images/Banderas/DK.png")}, // Danés
  Finnish: { img: require("../../../images/Banderas/FI.png")}, // Finlandés
  Greek: { img: require("../../../images/Banderas/GR.png")}, // Griego
  Hungarian: { img: require("../../../images/Banderas/HU.png")}, // Húngaro
  Indonesian: { img: require("../../../images/Banderas/ID.png")}, // Indonesio
  Hebrew: { img: require("../../../images/Banderas/IL.png")}, // Hebreo
  Hindi: { img: require("../../../images/Banderas/IN.png")}, // Hindi
  Persian: { img: require("../../../images/Banderas/IR.png")}, // Persa
  Malay: { img: require("../../../images/Banderas/MY.png")}, // Malayo
  Norwegian: { img: require("../../../images/Banderas/NO.png")}, // Noruego
  Filipino: { img: require("../../../images/Banderas/PH.png")}, // Filipino
  Polish: { img: require("../../../images/Banderas/PL.png")}, // Polaco
  Romanian: { img: require("../../../images/Banderas/RO.png")}, // Rumano
  Swedish: { img: require("../../../images/Banderas/SE.png")}, // Sueco
  Thai: { img: require("../../../images/Banderas/TH.png")}, // Tailandés
  Ukrainian: { img: require("../../../images/Banderas/UA.png")}, // Ucraniano
  Vietnamese: { img: require("../../../images/Banderas/VN.png")}, // Vietnamita
};

const levelColors = {
  A1: "#A5D6A7",
  A2: "#4CAF50",
  B1: "#FFB74D",
  B2: "#FF9800",
  C1: "#E57373",
  C2: "#D32F2F",
};

const learningImg = require("../../../images/LogosExchanges/Studying.png");
const speak = require("../../../images/LogosExchanges/Speak.png")
const level = require("../../../images/LogosExchanges/Nivel.png")
const students = require("../../../images/LogosExchanges/Estudiante.png")

export default function OwnExchangesTarget({ alumnos, nivel, idiomaDeseado, idioma }) {
  const { darkMode } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const flagInfo = flags[idiomaDeseado] || flags.Spanish;
  const flagInfo2 = flags[idioma] || flags.Spanish;

  return (
    <>
      <TouchableOpacity
        onLongPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <ImageBackground
          source={flagInfo}
          style={[styles.card, { width: width * 0.56, maxWidth: 250 }]}
          resizeMode="cover"
        >
          <View style={[styles.overlay, { backgroundColor: darkMode ? "#242323" : "white" }]}>        
            <View style={styles.row}>
              <Image source={learningImg} style={styles.studyIcon} />
              <Text style={[styles.text, { color: darkMode ? "white" : "black" }]}> Learning: </Text>
              <Text style={[styles.textBold, { color: darkMode ? "white" : "black" }]}>{idiomaDeseado} </Text>
              <Image source={flagInfo} style={styles.flag} />
            </View>

            <View style={styles.row}>
            <Image source={speak} style={styles.studyIcon} />
              <Text style={[styles.text, { color: darkMode ? "white" : "black" }]}> Speak: </Text>
              <Text style={[styles.textBold, { color: darkMode ? "white" : "black" }]}>{idioma} </Text>
              <Image source={flagInfo2} style={styles.flag} />
            </View>

            <View style={styles.row}>
            <Image source={level} style={styles.studyIcon} />
              <Text style={[styles.text, { color: darkMode ? "white" : "black" }]}> Level: </Text>
              <View style={[styles.highlightContainer, { backgroundColor: levelColors[nivel] || "#A5D6A7" }]}>
                <Text style={styles.highlightText}>{nivel.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.row}>
            <Image source={students} style={styles.studyIcon} />
              <Text style={[styles.text, { color: darkMode ? "white" : "black" }]}> Students: </Text>
              <Text style={[styles.textBold, { color: darkMode ? "white" : "black" }]}>{alumnos}</Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      {/* Modal del menú */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Pressable style={styles.menuItem} onPress={() => { setModalVisible(false); alert("Editar"); }}>
              <Text style={styles.menuText}>✏️ Edit</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => { setModalVisible(false); alert("Deshabilitar"); }}>
              <Text style={styles.menuText}>🚫 Disable</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => { setModalVisible(false); alert("Borrar"); }}>
              <Text style={styles.menuText}>🗑️ Delete</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  text: {
    fontSize: 12,
  },
  textBold: {
    fontSize: 12,
    fontWeight: "bold",
  },
  highlightContainer: {
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
  },
  menuItem: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
  },
});