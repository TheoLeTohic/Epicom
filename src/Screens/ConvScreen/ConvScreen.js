import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { getDatabase, ref, child, get, set } from "firebase/database";
import { firebase } from '../../firebase/config'
import { Icon } from 'react-native-elements';

export default function App({ navigation, route }) {
  function strSort(a)
  {
    return a.sort(function(x,y) {
      return x.toString().localeCompare(y.toString());
    });
  }
    const [object, setObject] = useState([]);
    const [object2, setObject2] = useState([]);
    const [message, setMessage] = useState([]);
    const [send, setSend] = useState('');
    const [valeurs, setValeurs] = useState([]);
    const dbRef = ref(getDatabase(firebase));
    const user = route.params.user;
    const me = route.params.me;
    const name = strSort([user.id, me.id]);
    const namea = name[0] + name[1];

    async function getinfoindatabase()
    {
      try {
        let snapshot = await get(child(dbRef, `conversation/${namea}`));
        snapshot = snapshot.val();
        const tmp = Object.keys(snapshot);
        let objectlist = [];
        for (const obj of tmp) {
          objectlist.push(snapshot[obj]);
        }
        setObject(objectlist);
      } catch(e) {
        setObject("error");
      }

      try {
        let snapshot2 = await get(child(dbRef, `conversation/${namea}`));
        snapshot2 = snapshot2.val();
        const tmp2 = Object.keys(snapshot2);
        let objectlist2 = [];
        for (const obj of tmp2) {
            objectlist2.push(snapshot2[obj]);
            }
        setObject2(objectlist2);
      } catch(e) {
        setObject2("error");
      }
    }

    function createConversation()
    {
      const db = getDatabase(firebase);
            const dbname = user.id + me.id;
            set(ref(db, 'conversation/' + namea), {
                user1: me.username,
                user2: user.username,
                user1id: me.id,
                user2id: user.id,
                messages: []
            });
    }

    function sendMessage()
    {
      const db = getDatabase(firebase);
      const dbname = user.id + me.id;
      const newMessage = {
        sender: me.username,
        message: send,
        date: Date.now()
      }
      const lastname = newMessage.sender + newMessage.date;
      set(ref(db, 'conversation/' + namea + '/messages/' + lastname), {
        sender: newMessage.sender,
        message: newMessage.message,
        date: newMessage.date
      });
      set(ref(db, 'users/' + user.username + '/feed/' + me.username), {
        sender: me.username,
        message: send,
        date: Date.now()
      });
      setSend('');
      getinfoindatabase();
    }

    useEffect(() => {
        getinfoindatabase()
    }, []);

    useEffect(() => {
      if (object === "error" && object2 === "error") {
        createConversation();
      }
      if (object === "error" && object2 !== "error") {
        setMessage(object2);
      }
      if (object !== "error" && object2 === "error") {
        setMessage(object);
      }
      if (object !== "error" && object2 !== "error") {
        setMessage(object);
      }
    }, [object, object2]);
 
    useEffect(() => {
      const interval = setInterval(() => {
        getinfoindatabase();
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      if (message !== [] && message !== undefined && message !== "error" && message !== null && message.length > 0) {
        message.pop();
        message.pop();
        message.pop();
        message.pop();
        const monDictionnaire = message[0];
        const valeur = Object.values(monDictionnaire);
        valeur.sort(function(a, b) {
          return a.date - b.date;
        });
        setValeurs(valeur);
      }
    }, [message]);
  
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={{marginLeft: 10, marginTop: 10}}
                    onPress={() => navigation.navigate('HomeScreen')}>
                    <Icon
                        name='arrow-left'
                        type='font-awesome'
                        color='#000'
                    />
                </TouchableOpacity>
                <View style = {styles.avatar}></View>
                <View style = {styles.nameandStatus}>
                  <Text style = {styles.name}>{user.username}</Text>
                  <Text style = {styles.status}>online</Text>
                </View>
            </View>
            <ScrollView style = {{height: "70%", marginTop: 20}}>
              {valeurs.map((valeur, index) => (
                (valeur.sender === me.username) ?
                <View style = {{display: 'flex', flexDirection: "row"}}>
                <View style = {styles.messinfo}>
                <Text style = {{marginLeft: "82%"}}>{valeur.sender}</Text>
                  <View style={styles.mt}>
                    <Text style = {styles.mymessage} key={index}>{valeur.message}</Text>
                  </View>
                </View>
                <View style = {{width: 50, height: 50, borderRadius: 50, backgroundColor: "grey"}}></View>
                </View>
                :
                <View style = {{display: 'flex', flexDirection: "row"}}>
                <View style = {{width: 50, height: 50, borderRadius: 50, backgroundColor: "grey"}}></View>
                <View style = {styles.messinfo}>
                  <Text style = {styles.sendername}>{valeur.sender}</Text>
                  <View style={styles.ht}>
                    <Text style = {styles.himmessage} key={index}>{valeur.message}</Text>
                  </View>
                </View>
                </View>
              ))}
            </ScrollView>
            <View style = {styles.sender}>
              <TextInput
                  style={{ height: 40, width: "70%", backgroundColor: "#F3F6F6", marginRight: 10, marginLeft: 10, borderRadius: 10}}
                  placeholder="Message"
                  onChangeText={text => setSend(text)}
                  defaultValue={send}
              />
              <TouchableOpacity
                  onPress={() => sendMessage()}>
                  <Text>Send</Text>
              </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  messinfo: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    backgroundColor: '#fff',
    padding: 10
  },
  nameandStatus: {
    marginLeft: 20
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  status: {
    fontSize: 15,
    color: 'grey'
  },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 50,
      backgroundColor: 'grey',
      marginLeft: 40
    },
    header: {
        marginTop: 30,
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#fff',
        padding: 10
    },
    mt: {
      marginTop: 10,
      backgroundColor: '#20A090',
      width: '55%',
      marginLeft: "42%",
      borderBottomLeftRadius: 25,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
    },
    ht: {
      marginTop: 10,
      backgroundColor: '#F2F7FB',
      width: '55%',
      marginRight: "42%",
      marginLeft: "3%",
      borderBottomRightRadius: 25,
      borderTopRightRadius: 25,
      borderBottomLeftRadius: 25,
    },
    mymessage: {
      color: 'white',
      padding: 6,
      margin: 10,
      textAlign: 'right'
    },
    himmessage: {
      color: 'black',
      padding: 10,
      margin: 10,
      textAlign: 'left'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    sender: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'white',
      alignItems: 'center',
      padding: 10,
      marginBottom: 10
    },
});