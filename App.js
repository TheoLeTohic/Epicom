import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, LoginScreen, RegisterScreen, ConvScreen, ProfilScreen } from './src/Screens';
import { firebase } from './src/firebase/config';
import 'expo-dev-client'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false,}}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ConvScreen" component={ConvScreen} />
        <Stack.Screen name="ProfilScreen" component={ProfilScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}