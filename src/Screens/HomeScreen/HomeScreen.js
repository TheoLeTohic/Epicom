import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ScrollView, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { getDatabase, ref, child, get } from "firebase/database";
import { firebase } from '../../firebase/config'
import { getAuth } from "firebase/auth";

export default function App({ navigation, route }) {
  const [object, setObject] = useState(route.params?.all ?? []);
  const [feed, setFeed] = useState([]);
  const [searchUsername, setSearchUsername] = useState('');
  const dbRef = ref(getDatabase(firebase));
  const [me, setMe] = useState(route.params?.user ?? null);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState(false);

  async function getinfoindatabase()
  {
    try {
      let snapshot = await get(child(dbRef, `users`));
      const tmp = Object.keys(snapshot);
      let objectlist = [];
      for (const obj of tmp) {
        objectlist.push(snapshot[obj]);
      }
      setObject(objectlist);
    } catch(e) {
      setObject("error");
    }
  }

  function searchUsernameInDatabase()
  {
    const auth = getAuth();
    const user = auth.currentUser;
    if (object === "error") {
      return null;
    }
    if (object.length === 0) {
      return null;
    }
    for (const obj of object) {
      if (obj.username === searchUsername) {
        setUser(obj);
      }
    }
    return null;
  }

  function launchSearch()
  {
    setSearch(false);
    searchUsernameInDatabase()
    if (user === null) {
    } else {
      navigation.navigate('ConvScreen', { user: user, me: me });
    }
  }

  function getuser(name)
  {
    if (object === "error") {
      return null;
    }
    if (object.length === 0) {
      return null;
    }
    for (const obj of object) {
      if (obj.username == name) {
        navigation.navigate('ConvScreen', { user: obj, me: me });
      }
    }
    return null;
  }

  useEffect(() => {
    if (object !== null && me !== null) {
      setFeed(Object.values(me.feed));
    }
  }, [object]);

  useEffect(() => {
  }, [feed]);

  return (
    <View style={styles.container}>
      <View style = {styles.header}>
        <View style = {styles.search}>
          {(search === false) ?
          <View style = {{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <TouchableOpacity onPress={() => setSearch(true)}>
              <Image style = {{width: 50, height: 50, resizeMode: "contain"}} source = {require("./loop.png")}></Image>
            </TouchableOpacity>
            <Text style = {{color: "white", fontSize: 20, marginLeft: 10, fontWeight: "bold"}}>Home</Text>
          </View>
          :
            <View style = {{flexDirection: "row"}}> 
              <TextInput style = {{width: "80%", height: 50, backgroundColor: "white", borderRadius: 50, paddingLeft: 20}} placeholder = "Search" onChangeText = {(text) => setSearchUsername(text)}></TextInput>
              <TouchableOpacity onPress = {() => launchSearch()}>
                <Image style = {{width: 50, height: 50, resizeMode: "contain"}} source = {require("./loop.png")}></Image>
              </TouchableOpacity>
            </View>
         }
          <TouchableOpacity style = {{marginLeft: "45%"}} onPress={() => navigation.navigate("ProfilScreen", {user: me})}>
            <View style = {{width: 50, height: 50, borderRadius: 50, backgroundColor: "grey"}}></View>
          </TouchableOpacity>
        </View>
        <View style = {styles.carousel}>
          <ScrollView horizontal = {true}>
            <View style = {{width: 100, height: 100, borderRadius: 50, backgroundColor: "grey", marginLeft: 10}}></View>
            <View style = {{width: 100, height: 100, borderRadius: 50, backgroundColor: "grey", marginLeft: 10}}></View>
            <View style = {{width: 100, height: 100, borderRadius: 50, backgroundColor: "grey", marginLeft: 10}}></View>
            <View style = {{width: 100, height: 100, borderRadius: 50, backgroundColor: "grey", marginLeft: 10}}></View>
            <View style = {{width: 100, height: 100, borderRadius: 50, backgroundColor: "grey", marginLeft: 10}}></View>
            <View style = {{width: 100, height: 100, borderRadius: 50, backgroundColor: "grey", marginLeft: 10}}></View>
          </ScrollView>
        </View>
      </View>
      <View style = {styles.body}>
      <View style = {{width: "100%", height: "5%"}}></View>
      <ScrollView>
        {feed.map((item, index) => (
          <TouchableOpacity onPress={() => getuser(item.sender)} style = {styles.card} key={index}>
            <View style = {styles.pp}></View>
            <View style = {styles.information}>
              <Text style = {styles.name}>{item.sender}</Text>
              <Text style = {styles.mess}>{item.message}</Text>
            </View>
            <View style = {styles.date}>
              <Text>2 min ago</Text>
              <Text></Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: {
    width: "100%",
    height: "85%",
    backgroundColor: "#130856",
    marginTop: "5%",
  },
  header: {
    width: "100%",
    height: "15%",
    backgroundColor: "#130856",
    marginTop: "10%",
  },
  search: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "5%",
  },
  body: {
    flex: 1,
    backgroundColor: '#fff',
    width: "100%",
    height: "70%",
    marginTop: "20%",
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#130856',
  },
  card: {
    display: "flex",
    flexDirection: "row",
    width: "85%",
    marginLeft: "2%",
    height: 60,
    marginTop: 10,
    alignItems: "center",
  },
  pp: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "grey",
  },
  information: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 10,
  },
  date: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "55%",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  mess: {
    fontSize: 15,
    color: "grey",
  },
});
