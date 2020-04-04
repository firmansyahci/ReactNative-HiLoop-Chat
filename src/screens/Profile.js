import React, { useState } from 'react'
import { Text, View, SafeAreaView, Alert, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native'
import User from '../components/User'
import * as firebase from 'firebase';
import styles from '../assets/styles';
import { AuthContext } from '../components/context'
import ImagePicker from 'react-native-image-picker'

const Profile = ({ }) => {
    const { signOut } = React.useContext(AuthContext);
    const [username, setUsername] = useState(User.username);
    const [email, setEmail] = useState(User.email);
    const [imgSrc, setImgSrc] = useState(require('../assets/user.png'));
    const [upload, setUpload] = useState(false)

    const changeName = async () => {
        if (username.length < 3) {
            Alert.alert('Error', 'Please enter valid name');
        } else if (User.username !== username) {
            User.username = username;
            this.updateUser();
        }
    }

    const changeImg = () => {
        const options = {
            quality: 0.7, allowsEditing: true, mediaType: 'photo', noData: true,
            storageOptions: {
                skipBackup: true, waitUntilSaved: true, path: 'images', cameraRoll: true
            }
        }

        ImagePicker.showImagePicker(options, response => {
            if (response.error) {
                console.log(error);
            } else if (!response.didCancel) {
                setImgSrc({ uri: response.uri });
                console.log(response)
                setTimeout(() => {
                    uploadFile();
                }, 2000)
                
            }
        })
    }

    const updateUser = () => {
        firebase.database().ref('users').child(User.uid).set(User)
        Alert.alert('Success', 'Successful saved.')
    }

    const updateUserImg = (ImgUrl) => {
        User.img = ImgUrl;
        updateUser();
        setUpload(false);
        setImgSrc({ uri: ImgUrl });
    }

    const uploadFile = async () => {
        let file = await uriToBlob(imgSrc.uri);
        firebase.storage().ref(`profile_pictures/${User.uid}.png`)
            .put(file)
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => updateUserImg(url))
            .catch(error => {
                setUpload(false);
                setImgSrc(require('../assets/user.png'));
                Alert.alert('Error', 'Error on upload image');
            })
    }

    const uriToBlob = (uri) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };

            xhr.onerror = function () {
                reject(new Error('Error on upload image'))
            };

            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        })
    }

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={changeImg}>
                {
                    upload ?
                        <ActivityIndicator size="large" />
                        :
                        <Image style={{ width: 100, height: 100, borderRadius: 100, resizeMode: 'cover', marginBottom: 10 }} source={imgSrc} />
                }
            </TouchableOpacity>
            <Text style={{ fontSize: 20 }}>
                {User.email}
            </Text>
            <Text style={{ fontSize: 20 }}>
                {User.username}
            </Text>
            <TextInput
                style={styles.input}
                value={username}
                onChangeText={e => setUsername(e)}
            />
            <TouchableOpacity onPress={changeName}>
                <Text style={styles.btnText}>Change Name</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => signOut()}>
                <Text style={styles.btnText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default Profile;