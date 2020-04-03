import React, { Component } from 'react'
import { Text, View, KeyboardAvoidingView, Animated, TextInput, TouchableOpacity, Dimensions, Keyboard, Platform, Image, FlatList, StyleSheet } from 'react-native'
import * as firebase from 'firebase';
import User from './User';

const isIOS = Platform.OS === 'ios'

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            person: {
                username: props.route.params.username,
                uid: props.route.params.uid,
            },
            textMessage: '',
            messagesList: [],
            dbRef: firebase.database().ref('messages')
        }
        this.keyboardHeight = new Animated.Value(0);
        this.bottomPadding = new Animated.Value(60);
    }

    componentDidMount() {
        this.keyboardShowListener = Keyboard.addListener(isIOS ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => this.keyboardEvent(e, true));
        this.keyboardHideListener = Keyboard.addListener(isIOS ? 'keyboardWillHide' : 'keyboardDidHide',
            (e) => this.keyboardEvent(e, false));
        this.state.dbRef.child(User.uid).child(this.state.person.uid)
            .on('child_added', (value) => {
                this.setState((prevState) => {
                    return {
                        messagesList: [...prevState.messagesList, value.val()]
                    }
                })
            })
    }

    componentWillUnmount() {
        this.state.dbRef.off();
        this.keyboardShowListener.remove();
        this.keyboardHideListener.remove();
    }

    keyboardEvent = (event, isShow) => {
        let heightOS = isIOS ? 60 : 80;
        let bottomOS = isIOS ? 120 : 140;
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: event.duration,
                toValue: isShow ? heightOS : 0
            }),
            Animated.timing(this.bottomPadding, {
                duration: event.duration,
                toValue: isShow ? bottomOS : 60
            }),
        ]).start();
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    convertTime = (time) => {
        let d = new Date(time);
        let c = new Date();
        let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
        result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
        if (c.getDay() !== d.getDay()) {
            result = d.getDay() + ' ' + d.getMonth() + ' ' + result;
        }
        return result;
    }

    sendMessage = () => {
        if (this.state.textMessage.length > 0) {
            let msgId = this.state.dbRef.child(User.uid).child(this.state.person.uid).push().key;
            let updates = {};
            let message = {
                message: this.state.textMessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: User.uid
            }
            updates[User.uid + '/' + this.state.person.uid + '/' + msgId] = message;
            updates[this.state.person.uid + '/' + User.uid + '/' + msgId] = message;
            this.state.dbRef.update(updates);
            this.setState({ textMessage: '' })
        }
    }

    renderRow = ({ item }) => {
        return (
            <View style={{
                flexDirection: 'row',
                maxWidth: '60%',
                alignSelf: item.from === User.uid ? 'flex-end' : 'flex-start',
                backgroundColor: item.from === User.uid ? '#00897b' : '#7cb342',
                borderRadius: 5,
                marginBottom: 10,
            }}>
                <Text style={{ color: '#fff', padding: 7, fontSize: 16 }}>
                    {item.message}
                </Text>
                <Text style={{ color: '#eee', padding: 3, fontSize: 12 }}>
                    {this.convertTime(item.time)}
                </Text>

            </View>
        )
    }

    render() {
        let { height } = Dimensions.get('window')
        return (
            <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
                <Animated.View style={[styles.bottomBar, { bottom: this.keyboardHeight }]}>
                    <TextInput
                        style={styles.inputMessage}
                        value={this.state.textMessage}
                        placeholder="Text message..."
                        onChangeText={this.handleChange('textMessage')}
                    />
                    <TouchableOpacity onPress={this.sendMessage} style={styles.sendButton}>
                        <Image source={require('../assets/send.png')} style={{ tintColor: 'white', resizeMode: 'contain', height: 20 }} />
                    </TouchableOpacity>
                </Animated.View>
                <FlatList
                    ref={ref => this.flatList = ref}
                    onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
                    onLayout={() => this.flatList.scrollToEnd({ animated: true })}
                    style={{ paddingTop: 5, paddingHorizontal: 5, height }}
                    data={this.state.messagesList}
                    renderItem={this.renderRow}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={<Animated.View style={{height: this.bottomPadding}} />}
                />
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    inputMessage: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '85%',
        marginBottom: 10,
        borderRadius: 20,
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        height: 60
    },
    sendButton: {
        alignItems: 'center',
        marginBottom: 10, 
        marginLeft: 10, 
        height: 40, 
        width: 40, 
        paddingTop: 10, 
        paddingLeft: 5,
        backgroundColor: '#2196F3',
        borderRadius: 20
    }
})