import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoFont: {
        fontSize: 40,
        fontFamily: '',
        fontStyle: 'italic',
    },
    form: {
        flex: 3,
        alignItems: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: '90%',
        padding: 10,
        marginBottom: 10,
    },
    button: {
        borderWidth: 1,
        borderRadius: 5,
        color: '#ffffff',
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 75,
        marginTop: 5,
        marginBottom: 10,
        backgroundColor: '#0040ff'
    },
    btnText: {
        fontSize: 20,
        marginBottom: 10,
        color: 'darkblue'
    }
})

export default styles; 