import React, { useState } from 'react'
import { Text, View, TextInput, TouchableOpacity, ToastAndroid, ActivityIndicator, StatusBar } from 'react-native'
import styles from '../assets/styles'
import { AuthContext } from '../components/context'
import firebase from '../configs/firebase'

const SignUp = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async () => {
        setIsLoading(true)
        if (username == '') {
            setIsLoading(false);
            ToastAndroid.show('username must be fill', ToastAndroid.SHORT);
            return
        }

        if (password != passwordMatch) {
            setIsLoading(false);
            ToastAndroid.show('password not match', ToastAndroid.SHORT);
            return
        }
        await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(res => {
                firebase.database().ref('users/' + res.user.uid)
                .set({
                    username: username,
                    email: email
                })
                navigation.navigate('SignIn');
            })
            .catch(function (error) {
                setIsLoading(false);
                ToastAndroid.show(error.message, ToastAndroid.SHORT);
            });
        
    }

    return (
        isLoading ? (
            <View>
            <ActivityIndicator />
            <StatusBar barStyle="default" />
        </View>
        ) : (
        <View style={styles.container}>
            <View style={styles.logo}>
                <Text style={styles.logoFont}>Hi Loop !</Text>
            </View>
            <View style={styles.form}>
                <TextInput
                    placeholder="Username"
                    style={styles.input}
                    onChangeText={e => setUsername(e)}
                    value={username}
                />
                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    onChangeText={e => setEmail(e)}
                    value={email}
                />
                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    onChangeText={e => setPassword(e)}
                    value={password}
                    secureTextEntry
                />
                <TextInput
                    placeholder="Retype Password"
                    style={styles.input}
                    onChangeText={e => setPasswordMatch(e)}
                    value={passwordMatch}
                    secureTextEntry
                />
                <TouchableOpacity onPress={handleSignUp}>
                    <Text style={styles.button}>Sign up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                    <Text>Have an account? Log in</Text>
                </TouchableOpacity>
            </View>
        </View>
        )
    )
}

export default SignUp