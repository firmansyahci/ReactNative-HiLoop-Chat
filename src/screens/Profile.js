import React, { Component } from 'react'
import { Text, View, SafeAreaView, Alert, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native'
import User from '../components/User'
import firebase from 'firebase';
import styles from '../assets/styles';
import { AuthContext } from '../components/context'
import ImagePicker from 'react-native-image-picker'

export default class Profile extends Component {

    static contextType = AuthContext;

    state = {
        username: User.username,
        email: User.email,
        imgSrc: User.img ? { uri: User.img } : require('../assets/user.png'),
        upload: false,
    }

    signOut = () => {
        Alert.alert('Message', 'Are you sure to logout?', [{ text: 'Cancel', }, { text: 'Ok', onPress: () => this.context.signOut() }]);
    }

    changeName = async () => {
        if (username.length < 3) {
            Alert.alert('Error', 'Please enter valid name');
        } else if (User.username !== this.state.username) {
            User.username = this.state.username;
            this.updateUser();
        }
    }

    changeImg = () => {
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
                this.setState({
                    upload: true,
                    imgSrc: { uri: response.uri }
                }, this.uploadFile)
            }
        });
    }

    updateUser = () => {
        firebase.database().ref('users').child(User.uid).set(User)
        Alert.alert('Success', 'Successful saved.')
    }

    updateUserImg = (ImgUrl) => {
        User.img = ImgUrl;
        this.updateUser();
        this.setState({
            upload: false,
            imgSrc: { uri: ImgUrl }
        })
    }

    uploadFile = async () => {
        let file = await this.uriToBlob(this.state.imgSrc.uri);
        firebase.storage().ref(`profile_pictures/${User.uid}.png`)
            .put(file)
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => this.updateUserImg(url))
            .catch(error => {
                this.setState({
                    upload: false,
                    imgSrc: require('../assets/user.png')
                })
                Alert.alert('Error', 'OK');
            })
    }

    uriToBlob = (uri) => {
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

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={this.changeImg}>
                    {
                        this.state.upload ?
                            <ActivityIndicator size="large" />
                            :
                            <Image style={{ width: 100, height: 100, borderRadius: 100, resizeMode: 'cover', marginBottom: 10 }} source={this.state.imgSrc} />
                    }
                </TouchableOpacity>
                <Text style={{ fontSize: 20 }}>
                    {User.email}
                </Text>
                <Text style={{ fontSize: 20 }}>
                    {this.state.username}
                </Text>
                <TextInput
                    style={styles.input}
                    value={this.state.username}
                    onChangeText={e => this.setState({ username: e })}
                />
                <TouchableOpacity onPress={this.changeName}>
                    <Text style={styles.btnText}>Change Name</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.signOut}>
                    <Text style={styles.btnText}> <Image style={{width: 20, height: 20}} source={require('../assets/logout.png')} /> Logout</Text>
                </TouchableOpacity>
            </View>
        )
    }
}