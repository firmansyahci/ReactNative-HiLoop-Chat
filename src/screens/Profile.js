import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { AuthContext } from '../components/context'

const Profile = () => {
    const { signOut } = React.useContext(AuthContext);
    
    return (
        <View>
            <TouchableOpacity onPress={() => signOut()}>
                <Text>Sign Out</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({})
