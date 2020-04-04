import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import User from '../components/User';
import firebase from 'firebase';

class Splash extends Component {
    render() {
        return(
            <View style = { styles.container } >
                <Text style={styles.textLogo}>Hi Loop!</Text>
            </View>
        )
    }  
}

export default Splash

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4511e'
    },
    textLogo: {
        fontSize: 50,
        color: '#fff',
        fontStyle: 'italic',
        fontWeight: 'bold'
    }
})
