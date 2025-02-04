import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-native-paper';
import { Home, Busqueda, Chats, Perfil } from './screens'; // Asegúrate de importar las pantallas correctas
import { HomeOutlined, SearchOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons-react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let icon;

              switch (route.name) {
                case 'Home':
                  icon = <HomeOutlined size={size} color={color} />;
                  break;
                case 'Busqueda':
                  icon = <SearchOutlined size={size} color={color} />;
                  break;
                case 'Chats':
                  icon = <MessageOutlined size={size} color={color} />;
                  break;
                case 'Perfil':
                  icon = <UserOutlined size={size} color={color} />;
                  break;
                default:
                  icon = <HomeOutlined size={size} color={color} />;
              }

              return icon;
            },
          })}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Busqueda" component={Busqueda} />
          <Tab.Screen name="Chats" component={Chats} />
          <Tab.Screen name="Perfil" component={Perfil} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
