import React, { useState } from 'react'
import { Text, View, TextInput, TouchableOpacity, ToastAndroid, ActivityIndicator, StatusBar } from 'react-native'
import styles from '../assets/styles'
import { AuthContext } from '../components/context'
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '../configs/firebase'

const SignIn = ({ navigation }) => {
    const { signIn } = React.useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        setIsLoading(true)
        await firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(res => {
                signIn(res.user.uid);
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
                <TouchableOpacity onPress={handleSignIn}>
                    <Text style={styles.button}>Sign in</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text>Don't have an account? Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
        )
    )
}

export default SignIn