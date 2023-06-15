import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { firebase } from '../../firebase/config'
import { storage, getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Icon, Input } from 'react-native-elements';

export default function App({ navigation, route }) {
    const [me, setMe] = useState(route.params?.user ?? null);

    async function uploadImage(e) {
        var files = e.target.files
        var image = files[0]

        const Buffer = await image.arrayBuffer()

        var storageRef = firebase.storage().ref('/MyPix')
        var picPath = "pic_awesome.jpg"
        var ref = storageRef.child(picPath)
        var metadata = { contentType: 'image/jpeg', public: true }

        await ref.put(Buffer, metadata)
        var downloadUrl = await ref.getDownloadURL()
        console.log('Download Url :: ' + downloadUrl)
        return downloadUrl; 
    }

    return (
        <View style={styles.container}>
            <View style = {styles.header}>
                <View style = {styles.arrowcontainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style = {{backgroundColor: '#133856', width: 45, height: 45, justifyContent: "center", borderRadius: 100, marginLeft: 20  }}>
                        <Icon name='arrow-back' color='#fff' size={30} />
                    </TouchableOpacity>
                </View>
                <View style = {styles.informationcontainer}>
                    <View style = {styles.ppcontainer}>
                    </View>
                    <View style = {styles.namecontainer}>
                        <Text style = {{color: '#fff', fontSize: 30, fontWeight: 'bold'}}>{me.username}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    namecontainer: {
        width: '100%',
        marginTop: 20,
        marginLeft: 17,
    },
    container: {
        flex: 1,
        backgroundColor: '#130856',
    },
    header: {
        width: '100%',
        marginTop: 70,
        backgroundColor: '#130856',
    },
    informationcontainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginTop: "15%",
        marginLeft: "15%",
    },
    ppcontainer: {
        width: 100,
        height: 100,
        backgroundColor: 'grey',
        borderRadius: 100,
        marginLeft: 20,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        marginTop: 70,
    },
});