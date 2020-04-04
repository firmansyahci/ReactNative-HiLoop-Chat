import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Image } from 'react-native'
import firebase from 'firebase';
import { FlatList } from 'react-native-gesture-handler'
import User from '../components/User';

export default class Home extends Component {

    state = {
        users: [],
        dbRef: firebase.database().ref('users')
    }

    componentDidMount() {
        this.state.dbRef.on('child_added', (val) => {
            let person = val.val();
            person.uid = val.key;
            if (person.uid === User.uid) {
                User.email = person.email;
                User.username = person.username;
            } else {
                this.setState((prevState) => {
                    return {
                        users: [...prevState.users, person]
                    }
                })
            }
        })
    }

    componentWillUnmount() {
        this.state.dbRef.off()
    }

    renderRow = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Chat', item)} >
                <View style={{ flex: 1, flexDirection: 'row', padding: 15, borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                    <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={require('../assets/user.png')} />
                    <Text style={{ fontSize: 22, marginLeft: 15 }}>{item.username}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <SafeAreaView>
                <FlatList
                    data={this.state.users}
                    renderItem={this.renderRow}
                    keyExtractor={(item) => item.uid}
                >
                </FlatList>
            </SafeAreaView>
        )
    }
}