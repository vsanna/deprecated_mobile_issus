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
    debugger
    const rq = {
      uri: 'http://localhost:4000' + this.props.navigation.state.params.href,
      headers: {
        'x-is-native': 'true'
      }
    }
    return (
      <WebView source={rq} />
    )
  }
}
