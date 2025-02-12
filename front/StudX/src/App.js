import * as React from "react";
import { StatusBar, View, ImageBackground, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/Login";
import Registration from "./screens/Registration";
import HomeScreen from "./screens/HomeScreens/HomeScreen";
import ChatScreen from "./screens/MensajesScreens/Components/ChatScreen";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import CreateGroup from "./screens/HomeScreens/CreateExchange";
import CreatedExchange from "./screens/HomeScreens/CreateExchange";

const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <NavigationContainer>
        <AppWrapper />
      </NavigationContainer>
    </ThemeProvider>
  );
}

function AppWrapper() {
  const { darkMode } = useTheme();
  const backgroundImage = darkMode ? require("./images/Logos/logoFondoChatOscuro.png") : null;

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Registration" component={Registration} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="Crear Intercambios" component={CreatedExchange}/>
        </Stack.Navigator>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)", // Ajusta la opacidad si es necesario
  },
});
