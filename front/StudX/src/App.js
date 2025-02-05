import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/Inicio/Login";
import Registration from "./screens/Inicio/Registration";
import Pantallas from "./screens/Home/Pantallas";
import { Text } from "react-native-paper";


const Stack = createStackNavigator();

export default function App() {
  return (
    
       <NavigationContainer>
         <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
           <Stack.Screen name="Login" component={Login} />
           <Stack.Screen name="Registration" component={Registration} />
           <Stack.Screen name="Pantallas" component={Pantallas} />

         </Stack.Navigator>
       </NavigationContainer>

  );
}
