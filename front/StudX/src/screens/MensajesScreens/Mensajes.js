import React, { useState, useLayoutEffect } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  TouchableWithoutFeedback, 
  Dimensions, 
  Image 
} from 'react-native';
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const getImageSource = (imageName) => {
  const images = {
    'img1.jpg': require('../../images/FotosPerfil/img2.jpg'),
    'img2.jpg': require('../../images/FotosPerfil/img1.jpg'),
  };
  return images[imageName] || require('../../images/FotosPerfil/img2.jpg');
};

export default function Mensajes() {
  const { darkMode } = useTheme();
  const navigation = useNavigation();
  const [selectedChatIds, setSelectedChatIds] = useState(new Set());

  const [chats, setChats] = useState([
    { id: '1', name: 'Juan', image: 'img1.jpg', messages: [
        { id: 'm1', text: 'Hola, ¿cómo estás?', isOwn: false },
        { id: 'm2', text: 'Con tu madre y tú?', isOwn: true }
      ]
    },
    { id: '2', name: 'Maria', image: 'img2.jpg', messages: [
        { id: 'm3', text: 'Nos vemos luego. Deberíamos de mirar cómo implementamos todo esto en la app', isOwn: false },
        { id: 'm4', text: 'Sí, hasta pronto.', isOwn: true }
      ]
    }
  ]);

  // Actualizar el header dinámicamente
  useLayoutEffect(() => {
    console.log("Updating header with selected chats:", selectedChatIds.size);

    if (selectedChatIds.size > 0) {
      navigation.setOptions({
        headerTitle: `${selectedChatIds.size} seleccionado(s)`,
        headerLeft: () => (
          <TouchableOpacity onPress={() => setSelectedChatIds(new Set())} style={{ marginLeft: 15 }}>
            <MaterialIcons name="close" size={28} color="black" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View style={{ flexDirection: 'row', marginRight: 15 }}>
          
            {/* Botón para eliminar */}
            <TouchableOpacity onPress={eliminarChats} style={styles.iconButton}>
              <MaterialIcons name="delete" size={28} color="black" />
            </TouchableOpacity>
          </View>
        ),
      });
    } else {
      navigation.setOptions({
        headerTitle: 'Mensajes',
        headerLeft: null,
        headerRight: null,
      });
    }
  }, [selectedChatIds, navigation]);

  const handleChatPress = (chat) => {
    if (selectedChatIds.size > 0) {
      toggleChatSelection(chat.id);
    } else {
      navigation.navigate('ChatScreen', { chat });
    }
  };

  const handleChatLongPress = (id) => {
    toggleChatSelection(id);
  };

  const toggleChatSelection = (id) => {
    setSelectedChatIds(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const eliminarChats = () => {
    setChats(chats.filter(chat => !selectedChatIds.has(chat.id)));
    setSelectedChatIds(new Set());
  };

 

  return (
    <TouchableWithoutFeedback onPress={() => setSelectedChatIds(new Set())}>
      <View style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}> 
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleChatPress(item)}
              onLongPress={() => handleChatLongPress(item.id)}
              style={[
                styles.chatWrapper, 
                darkMode ? styles.darkChatWrapper : styles.lightChatWrapper, 
                selectedChatIds.has(item.id) && styles.selectedChat
              ]}
            >
              <View style={styles.imageContainer}>
                <Image source={getImageSource(item.image)} style={styles.profileImage} />
                {selectedChatIds.has(item.id) && (
                  <View style={styles.checkOverlay}>
                    <MaterialIcons name="check" size={24} color="white" />
                  </View>
                )}
              </View>
              <View style={styles.chatTextContainer}>
                <Text style={[styles.chatTitle, darkMode ? styles.darkText : styles.lightText]}>
                  {item.name}
                </Text>
                <Text style={[styles.lastMessage, darkMode ? styles.darkSubText : styles.lightSubText]}>
                  {item.messages[item.messages.length - 1]?.text}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  darkContainer: {
    backgroundColor: '#111',
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  chatWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderRadius: 8,
  },
  darkChatWrapper: {
    backgroundColor: '#222',
    borderBottomColor: '#555',
  },
  lightChatWrapper: {
    backgroundColor: 'white',
    borderBottomColor: '#ccc',
  },
  selectedChat: {
    backgroundColor: 'tomato',
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  checkOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'green',
    borderRadius: 12,
    padding: 2,
  },
  chatTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
  },
  darkText: {
    color: 'white',
  },
  lightText: {
    color: 'black',
  },
  darkSubText: {
    color: 'lightgray',
  },
  lightSubText: {
    color: 'gray',
  },
  iconButton: {
    marginHorizontal: 10,
  },
});
