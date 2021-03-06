import React, { useState, useEffect, useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5'
import SignUp from './src/screens/SignUp'
import SignIn from './src/screens/SignIn'
import Home from './src/screens/Home'
import Splash from './src/screens/Splash'
import Maps from './src/screens/Maps';
import Profile from './src/screens/Profile';
import { AuthContext } from './src/components/context';
import User from './src/components/User';
import Friends from './src/components/Friends';
import Chat from './src/components/Chat';
import Geolocation from '@react-native-community/geolocation';

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen
      name="SignIn"
      component={SignIn}
    />
    <AuthStack.Screen
      name="SignUp"
      component={SignUp}
    />
  </AuthStack.Navigator>
);

const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name='Chats' component={Home} options={{
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }} />
  </HomeStack.Navigator>
);

const MapsStack = createStackNavigator();
const MapsStackScreen = () => (
  <MapsStack.Navigator>
    <MapsStack.Screen name='Maps' component={Maps} options={{
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }} />
  </MapsStack.Navigator>
);

const ProfileStack = createStackNavigator();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name='Profile' component={Profile} options={{
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }} />
  </ProfileStack.Navigator>
);

const Tabs = createBottomTabNavigator();
const TabsScreen = () => (
  <Tabs.Navigator headerMode="none">
    <Tabs.Screen name="Home" component={HomeStackScreen} options={{
      tabBarLabel: 'Chats',
      tabBarIcon: ({ color, size }) => (
        <Icon name="comment-alt" color={color} size={size} />
      ),
    }} />
    <Tabs.Screen name="Maps" component={MapsStackScreen} options={{
      tabBarLabel: 'Location',
      tabBarIcon: ({ color, size }) => (
        <Icon name="map-marker-alt" color={color} size={size} />
      ),
    }} />
    <Tabs.Screen name="Profile" component={ProfileStackScreen} options={{
      tabBarLabel: 'Profile',
      tabBarIcon: ({ color, size }) => (
        <Icon name="user-circle" color={color} size={size} />
      ),
    }} />
  </Tabs.Navigator>
);

const Mains = createStackNavigator();
const MainsStackScreen = () => (
  <Mains.Navigator>
    <Mains.Screen name="App" component={TabsScreen} options={{ headerShown: false }} />
    <Mains.Screen name="Chat" component={Chat} options={({ route }) => ({
      title: route.params.username,
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    })} />
  </Mains.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({ userToken }) => (
  <RootStack.Navigator headerMode="none" initialRouteName="App">
    {userToken ? (
      <RootStack.Screen
        name="App"
        component={MainsStackScreen}
        options={{
          animationEnabled: false
        }}
      />
    ) : (
        <RootStack.Screen
          name="Auth"
          component={AuthStackScreen}
          options={{
            animationEnabled: false
          }}
        />
      )}
  </RootStack.Navigator>
);

const App = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(false);

  const setToken = async (token) => {
    try {
      await AsyncStorage.setItem('userToken', token);
    } catch (e) {

    }
    setIsLoading(false);
    setUserToken(token);
  }

  const getToken = async () => {
    let uid;
    try {
      uid = await AsyncStorage.getItem('userToken');
      User.uid = uid;
      getLocation();
    } catch (e) {

    }
    setUserToken(uid);
  }

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      User.uid = null
    } catch (e) {

    }
    setIsLoading(false);
    setUserToken(null);
  }

  const getLocation = () => {
    Geolocation.getCurrentPosition(response => {
      console.log(response);
      User.location = response;
    })
  }

  const authContext = useMemo(() => {
    return {
      signIn: (token) => {
        setToken(token);
        getToken();
      },
      signOut: () => {
        removeToken();
      },
    };
  }, []);

  useEffect(() => {
    getToken();

    setTimeout(() => {
      setIsLoading(false);
    }, 1000)
  }, [])

  if (isLoading) {
    return <Splash />
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <RootStackScreen userToken={userToken} />
      </NavigationContainer>
    </AuthContext.Provider>
  )
}

export default App