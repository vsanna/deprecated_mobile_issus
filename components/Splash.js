import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
EStyleSheet.build({
  $textColor: 'green' // variable
});

import {
  AsyncStorage,
  Text
} from 'react-native';

import {
  H1,
  Container,
  Content
} from 'native-base';

import { LinearGradient } from 'expo';

const AUTH_TOKEN = 'auth_token';

export default class Login extends Component {
  async getToken() {
    try {
      let token = await AsyncStorage.getItem(AUTH_TOKEN);
      if(!token) {
          console.log("Token not set");
      } else {
        this.setState({token: token});
        return token;
      }
    } catch(error) {
        console.log("Something went wrong");
    }
  }
  //If token is verified we will redirect the user to the home page
  async verifyToken(token) {
    try {
      let response = await fetch('http://localhost:4000/api/v1/verify_token', {
        method: 'POST',
        headers: {
          'x-is-native': 'true',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token=' + token
        },
        body: JSON.stringify({ token: token })
      });
      let res = await response.text();
      if (response.status >= 200 && response.status < 300) {
        //Verified token means user is logged in so we redirect him to home.
        this.props.navigation.navigate('issues');
      } else {
          //Handle error
          let error = res;
          throw error;
      }
    } catch(error) {
      this.props.navigation.navigate('login');
    }
  }

  async authenticateToken(){
    try {
      let token = await this.getToken();
      if (!token){ throw 'token not set'; }
      this.verifyToken(token);
    } catch(err) {
      this.props.navigation.navigate('login');
    }
  }

  componentWillMount() {
    this.authenticateToken();
  }

  constructor(props){
    super(props);
    this.state = {
      token: null
    }
  }

  render() {
    const style = EStyleSheet.create({
      linear: {
        flex: 1,
        height: '100%',
        alignItems:'center',
        justifyContent: 'center'
      },
      splashTitle: {
        fontSize: 30,
        color: '#fff',
        letterSpacing: 2
      }
    });
    return (
      <Container>
        <Content>
          <LinearGradient
            style={style.linear}
            colors={['#358594', '#65b5c4']} >
            <Text style={style.splashTitle}>Issusのスプラッシュ画面（スプラッシュて。）</Text>
          </LinearGradient>
        </Content>
      </Container>
    )
  }
}
