import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";

export default function CreateGroup({ onClose }) {
  const [name, setName] = useState("");
  const [nivel, setNivel] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [language, setLanguage] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("userToken");
        if (!storedToken) {
          Alert.alert("Error", "there is no active session.");
          return;
        }
        setToken(storedToken);
      } catch (error) {
        console.log("Error getting token:", error);
      }
    };
    fetchToken();
  }, []);

  const handleNivelPress = (selectedNivel) => {
    if (nivel === selectedNivel) {
      switch (selectedNivel) {
        case "A1":
          setNivel("A2");
          break;
        case "A2":
          setNivel(null);
          break;
        case "B1":
          setNivel("B2");
          break;
        case "B2":
          setNivel(null);
          break;
        case "C1":
          setNivel("C2");
          break;
        case "C2":
          setNivel(null);
          break;
        default:
          setNivel(null);
      }
    } else {
      setNivel(selectedNivel);
    }
  };

  const handleSave = async () => {
    if (!name || !language || !nivel) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (!token) {
      Alert.alert("Error", "Could not get authentication token.");
      return;
    }

    const apiUrl = "http://44.220.1.21:8080/api/groups";
    const data = {
      name,
      level: nivel,
      quantity,
      language,
      token,
    };

    try {
      console.log("Enviando datos:", data);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Alert.alert("Succes", "Group created successfully");
        onClose();
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Could not create group");
      }
    } catch (error) {
      Alert.alert("Connection error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Group Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter the group name"
        />

        <Text style={styles.label}>Level {nivel ? `(${nivel.toUpperCase()})` : ""}</Text>
        <View style={styles.trafficLight}>
          <TouchableOpacity style={[styles.light, nivel === "A1" && styles.lightGreen]} onPress={() => handleNivelPress("A1")} />
          <TouchableOpacity style={[styles.light, nivel === "B1" && styles.lightYellow]} onPress={() => handleNivelPress("B1")} />
          <TouchableOpacity style={[styles.light, nivel === "C1" && styles.lightRed]} onPress={() => handleNivelPress("C1")} />
        </View>

        <Text style={styles.label}>Nº of Students</Text>
        <TextInput
          style={styles.input}
          value={quantity.toString()}
          onChangeText={(text) => setQuantity(parseInt(text) || 1)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Language</Text>
        <TextInput
          style={styles.input}
          value={language}
          onChangeText={setLanguage}
          placeholder="Enter the Language"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  trafficLight: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  light: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
  },
  lightGreen: {
    backgroundColor: "#4CAF50",
  },
  lightYellow: {
    backgroundColor: "#FFCC00",
  },
  lightRed: {
    backgroundColor: "#FF3B30",
  },
  saveButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 40,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
