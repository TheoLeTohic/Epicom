import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, child, get } from "firebase/database";
import { firebase } from "../../firebase/config";
import { Icon } from "react-native-elements";

import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google';


import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

// Web ID: 369529277140-pga4jhbv3rmci09depin56b7iqadmgg9.apps.googleusercontent.com
// iOS ID: 369529277140-6uqt64n5jmok1tu94rs3qkcms24bt1bi.apps.googleusercontent.com
// Android ID: 369529277140-r6iprukdgge2jsmej50r4hgkeiuha4dn.apps.googleusercontent.com
export default function App({ navigation }) {
  const [Username, setUsername] = useState("theo@gmail.fr");
  const [Password, setPassword] = useState("123456");
  const [object, setObject] = useState([]);
  const dbRef = ref(getDatabase(firebase));
  const [actualUser, setActualUser] = useState(null);
  
  
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "369529277140-pga4jhbv3rmci09depin56b7iqadmgg9.apps.googleusercontent.com",
    iosClientId: "369529277140-6uqt64n5jmok1tu94rs3qkcms24bt1bi.apps.googleusercontent.com",
    androidClientId: "369529277140-r6iprukdgge2jsmej50r4hgkeiuha4dn.apps.googleusercontent.com",
  })

  useEffect(() => {
    if (response?.type === 'success') {
      setAccessToken(response.params.accessToken);
      accessToken && fetchUserInfo();
    }

  }, [response, accessToken])

  const fetchUserInfo = async () => {
    let response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const useInfo = await response.json();
    setUser(useInfo);
  };

  const auth = getAuth();

  async function getinfoindatabase() {
    try {
      let snapshot = await get(child(dbRef, `users`));
      snapshot = snapshot.val();
      const tmp = Object.keys(snapshot);
      let objectlist = [];
      for (const obj of tmp) {
        objectlist.push(snapshot[obj]);
      }
      setObject(objectlist);
    } catch (e) {
      setObject("error");
    }
  }
  console.log(object);

  function onLoginPress() {
    signInWithEmailAndPassword(auth, Username, Password)
      .then((userCredential) => {
        if (object === "error") {
          return null;
        }
        if (object.length === 0) {
          return null;
        }
        for (const obj of object) {
          if (obj.id === userCredential.user.uid) {
            navigation.navigate("HomeScreen", { user: obj, all: object });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return;
  }

  useEffect(() => {
    getinfoindatabase();
  }, []);

  useEffect(() => {}, [object]);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={{ fontWeight: "bold", fontSize: 40 }}>Welcome</Text>
      </View>
      <View style={styles.body}>
        <TouchableOpacity onPress={() => {
          promptAsync()
        }}>
          <Image
            style={{
              width: 60,
              height: 60,
              resizeMode: "contain",
              alignSelf: "center",
              marginTop: 30,
            }}
            source={require("./google.png")}
          />
        </TouchableOpacity>
        <View style={styles.orbloc}>
          <View style={styles.line}></View>
          <Text style={styles.orb}>OR</Text>
          <View style={styles.line}></View>
        </View>
        <View style={styles.form}>
          <Text style={styles.formText}>Email</Text>
          <TextInput
            style={styles.formInput}
            onChangeText={(text) => setUsername(text)}
            defaultValue={Username}
          />
          <Text style={styles.formText}>Password</Text>
          <TextInput
            style={styles.formInput}
            onChangeText={(text) => setPassword(text)}
            defaultValue={Password}
          />
          <Text style={styles.forgot}>Forgot Password?</Text>
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => onLoginPress()}
        >
          <Text style={{ color: "#24207B", fontSize: 15, fontWeight: "bold" }}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("RegisterScreen")}
        >
          <Text style={{ color: "white" }}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  body: {
    width: "100%",
    height: "85%",
    marginTop: "20%",
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    backgroundColor: "#24207B",
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
    borderRadius: 50,
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
  },
});
