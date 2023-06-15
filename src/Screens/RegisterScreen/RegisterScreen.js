import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebase } from '../../firebase/config';
import { getDatabase, ref, set } from "firebase/database";

export default function App({ navigation }) {
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [Email, setEmail] = useState('');

    function onRegisterPress() {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, Email, Password).then((userCredential) => {
            const db = getDatabase(firebase);
            const dbname = Username;
            set(ref(db, 'users/' + dbname), {
                username: Username,
                id: userCredential.user.uid,
            });
            navigation.navigate('HomeScreen');
        }).catch((error) => {
            console.log(error);
        });
        return
    }
    
    return (
        <View style={styles.container}>
          <View style = {styles.top}>
            <Text style = {{fontWeight: "bold", fontSize: 40}}>Register</Text>
          </View>
          <View style = {styles.body}>
            <Image style={{ width: 60, height: 60, resizeMode: "contain", alignSelf: 'center', marginTop: 30 }} source={require('./google.png')} />
            <View style = {styles.orbloc}>
              <View style = {styles.line}></View>
              <Text style = {styles.orb}>OR</Text>
              <View style = {styles.line}></View>
            </View>
            <View style = {styles.form}>
              <Text style = {styles.formText}>Username</Text>
              <TextInput
                style={styles.formInput}
                onChangeText={text => setUsername(text)}
                defaultValue={Username}/>
                <Text style = {styles.formText}>Email</Text>
                <TextInput
                style={styles.formInput}
                onChangeText={text => setEmail(text)}
                defaultValue={Email}/>
              <Text style = {styles.formText}>Password</Text>
              <TextInput
                style={styles.formInput}
                onChangeText={text => setPassword(text)}
                defaultValue={Password}
              />
              <Text style = {styles.forgot}>Forgot Password?</Text>
            </View>
            <TouchableOpacity
                style={styles.loginButton}
                onPress={() => onRegisterPress()}
              ><Text style={{ color: '#24207B', fontSize: 15, fontWeight: "bold" }}>Register</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate('LoginScreen')}
              ><Text style={{ color: 'white' }}>Login</Text>
              </TouchableOpacity>
          </View>
        </View>
      )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    body: {
      width: "100%",
      height: "85%",
      marginTop: "10%",
      borderTopRightRadius: 50,
      borderTopLeftRadius: 50,
      backgroundColor: '#24207B',
    },
    orbloc: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginTop: 40,
    },
    orb: {
      color: "white",
      fontSize: 20,
      fontWeight: "bold",
    },
    line: {
      width: "35%",
      height: 1,
      backgroundColor: "white",
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 50
    },
    form: {
      width: "80%",
      alignSelf: "center",
    },
    formText: {
      marginTop: 20,
      color: "white",
      fontSize: 20,
    },
    forgot: {
      color: "grey",
      fontSize: 15,
      fontWeight: "bold",
      alignSelf: "flex-end",
    },
    formInput: {
      width: "100%",
      height: 40,
      borderBottomWidth: 1,
      borderBottomColor: "white",
      borderRadius: 5,
      paddingLeft: 10,
    },
    loginButton: {
      width: "80%",
      height: 40,
      backgroundColor: "white",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      marginTop: 30,
    },
    registerButton: {
      width: "80%",
      height: 40,
      backgroundColor: "#24207B",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      marginTop: 10,
    },
    top: {
      width: "100%",
      height: "15%",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "10%",
    }
});
