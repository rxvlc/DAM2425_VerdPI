import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity,StyleSheet, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function Registration() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Profesor', value: 'profesor' },
        { label: 'Alumno', value: 'alumno' },
    ]);

    return (
       <View style={styles.container}>
      <View style={styles.zonaLogo}>
      {/* <Image source={require("../assets/logoIndividual.png")} style={styles.image} /> */}
      </View>
      <View style={styles.zonaUsuariContrasenya}>
        <TextInput style={styles.input} placeholder="Usuario" placeholderTextColor="#888" />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888" />
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                style={{ marginBottom: 10 }}
            />
            <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#888"  secureTextEntry />
      </View>
      <View style={styles.zonaBoton}>
        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("Pantallas")}>
          <Text style={styles.botonTexto}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zonaLogo:{
    flex: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zonaUsuariContrasenya:{
    flex: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  zonaBoton:{
    flex: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  Logo:{
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  boton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
});