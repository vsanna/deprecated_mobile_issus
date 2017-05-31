import React, { Component } from 'react';
import Layout from './commons/Layout.js';
// import auth from '../modules/auth.js';

import {
  WebView
} from 'react-native';

import {
  Container,
  Content,
  Button,
  Icon,
  List,
  ListItem,
  Separator,
  Header,
  Right,
  Left,
  Body,
  Title,
} from 'native-base';

const AUTH_TOKEN = 'auth_token';

export default class Notification extends React.Component {

  render(){
    const rq = {
      uri: 'http://localhost:4000' + this.props.navigation.state.params.href,
      headers: {
        'x-is-native': 'true'
      }
    };
    console.log(rq.uri);
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={()=>{this.props.navigation.goBack()}}>
              <Icon
                name='ios-arrow-back'
                ios='ios-arrow-back'
                androind='md-arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title></Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <WebView
            source={rq}
            style={{marginTop: 20}} />
          </Content>
      </Container>
    )
  }
}
