import React, { Component } from 'react';
import Layout from './commons/Layout.js';
// import auth from '../modules/auth.js';

import {
  StyleSheet,
  Image,
  StatusBar
} from 'react-native';

import {
  Button,
  Text,
  Container,
  List,
  ListItem,
  Content,
  Icon
} from 'native-base';

export default class Sidebar extends Component {
  render() {
    return(
      <Container>
        <Content>
          <Image
            source={{
              uri: "https://github.com/GeekyAnts/NativeBase-KitchenSink/raw/react-navigation/img/drawer-cover.png"
            }}
            style={{
              height: 120,
              alignSelf: "stretch",
              justifyContent: "center",
              alignItems: "center"
            }}>
            <Image
              square
              style={{ height: 80, width: 70 }}
              source={{
                uri: "https://github.com/GeekyAnts/NativeBase-KitchenSink/raw/react-navigation/img/logo.png"
              }}
            />
          </Image>
          <List
            dataArray={this.props.navigation.state.params && this.props.navigation.state.params.projects
                         ? this.props.navigation.state.params
                         : []}
            renderRow={data => {
              return (
                <ListItem
                  button
                  onPress={() => this.props.navigation.navigate('issues', {id: data.id, name: data.name})}>
                  <Text>{data.name}</Text>
                </ListItem>
              );
            }}
          />
        </Content>
      </Container>
    );
  }
}
