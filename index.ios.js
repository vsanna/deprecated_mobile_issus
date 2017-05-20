import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Layout from './components/commons/Layout.jsx'

export default class App extends React.Component {
    render() {
        return (
                <Layout>
                <View>
                <Text>Open up App.js to start working on your app!</Text>
                <Text>Changes you make will automatically reload.</Text>
                <Text>Shake your phone to open the developer menu.</Text>
                </View>
                </Layout>
               );
    }
}
