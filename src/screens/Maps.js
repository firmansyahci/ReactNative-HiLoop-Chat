import React, { useEffect, useState, Component } from 'react'
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import firebase from 'firebase';
import User from '../components/User';
import Friends from '../components/Friends'
import Carousel from 'react-native-snap-carousel';

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Maps extends Component {
    state = {
        friends: Friends.data
    }

    componentDidMount() {
        this.setState({
            friends: [User, ...this.state.friends]
        })
        setTimeout(() => {
            firebase.database().ref('users').child(User.uid).set(User)
        }, 2000)
    }

    renderCarouselItem = ({ item }) => (
        <TouchableOpacity>
            <View style={styles.cardContainer}>
            <Image
                    style={{ height: 50, width: 50, borderRadius: 50, marginBottom: 5 }}
                    source={
                        item.img
                            ? { uri: item.img }
                            : {
                                uri:
                                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAQeOYC_Uqrxp5lVzs-DalVZJg3t6cCtAFyMHeI2NejPr1-TsUUQ&s',
                            }
                    }
                />
                <Text style={styles.cardTitle}>{item.username}</Text>
            </View>
        </TouchableOpacity>
    );

    changeCarouselItem = index => {
        let location = this.state.friends[index];
        this._map.animateToRegion({
            latitude: location.location.coords.latitude,
            longitude: location.location.coords.longitude,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421 * 1.5,
        });
    };

    render() {
        return (
            <View style={{ flex: 1, height: 400 }}>
                <MapView
                    ref={map => (this._map = map)}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                        latitude: User.location.coords.latitude,
                        longitude: User.location.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}>
                    {this.state.friends.map((friend, index) => {
                        return (
                            <Marker
                                key={index}
                                coordinate={{
                                    longitude: friend.location.coords.longitude,
                                    latitude: friend.location.coords.latitude
                                }}
                                title={friend.username} />
                        )
                    })}
                </MapView>

                <Carousel
                    ref={c => {
                        this._carousel = c;
                    }}
                    data={this.state.friends}
                    containerCustomStyle={styles.Carousel}
                    renderItem={this.renderCarouselItem}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={230}
                    removeClippedSubviews={false}
                    onSnapToItem={index => this.changeCarouselItem(index)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    Carousel: {
        position: 'absolute',
        bottom: 0,
    },
    cardContainer: {
        backgroundColor: 'grey',
        height: 100,
        width: 230,
        borderRadius: 15,
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
      },
      cardTitle: {
        color: 'white',
        fontSize: 18,
        alignSelf: 'center',
        marginBottom: 5,
      },
});
