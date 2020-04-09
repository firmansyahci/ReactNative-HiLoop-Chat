import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Image, ActivityIndicator, StatusBar } from 'react-native'
import firebase from 'firebase';
import { FlatList } from 'react-native-gesture-handler'
import User from '../components/User';
import Friends from '../components/Friends';

export default class Home extends Component {

    state = {
        users: [],
        dbRef: firebase.database().ref('users'),
        isLoading: false
    }

    componentDidMount() {
        this.setState({
            isLoading: true
        })
        let data = [];
        this.state.dbRef.on('child_added', (val) => {
            let person = val.val();
            person.uid = val.key;
            if (person.uid === User.uid) {
              User.email = person.email;
              User.username = person.username;
              User.img = person.img ? person.img : null
            } else {
                data.push(person)
              this.setState((prevState) => {
                return {
                    users: [...prevState.users, person],
                    isLoading: false
                }
              })
            }
            Friends.data = data;
          })
    }

    componentWillUnmount() {
        this.state.dbRef.off();
    }

    renderRow = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Chat', item)}>
                <View style={{ flex: 1, flexDirection: 'row', padding: 15, borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                    <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={item.img ? { uri: item.img } : require('../assets/user.png')} />
                    <Text style={{ fontSize: 22, marginLeft: 15 }}>{item.username}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            this.state.isLoading ? <View>
            <ActivityIndicator />
            <StatusBar barStyle="default" />
        </View> :
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