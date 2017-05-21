import React, { Component } from 'react';
import {
  WebView
} from 'react-native';


export default class Signup extends Component {
  static navigationOptions = {
    title: 'signup'
  }

  constructor(props){
    super(props);
  }

  render() {
    const rq = {
      uri: 'http://localhost:4000/users/sign_up',
      headers: {
        'x-is-native': 'true'
      }
    }
    return (
      <WebView
        source={rq}
        style={{marginTop: 20}}
      />
    )
  }
}
