import React, { Component } from 'react';

import {
  TouchableHighlight,
  Text,
  View,
  TextInput,
  AsyncStorage,
} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';

import {
  Form,
  Item,
  Input,
  Label,
  Button,
  Header,
  Right,
  Left,
  Body,
  Title,
  Container,
  Content,
} from 'native-base';

import { LinearGradient } from 'expo';
// import LinearGradient from 'react-native-linear-gradient';

const AUTH_TOKEN = 'auth_token';

const rowStyles = {
  sitename: {
    textAlign: 'center',
    fontSize: 20,
    color: '#888',
    marginTop: 40
  },
  linearGradient: {
    height: '100%',
    padding: 16,
    marginLeft: -16,
    marginRight: -16,
    marginTop: -16
  },
}
const styles = EStyleSheet.create(rowStyles);

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
        body: JSON.stringify({
          token: token
        })
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
        console.log("error response: " + error);
    }
  }

  async removeItem(){
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN)
    } catch(error) {
      console.log('someting went wrong when removing token from asyncstorage')
    }
  }


  async storeToken(token){
    try {
      AsyncStorage.setItem(AUTH_TOKEN, token);
      this.getToken();
    } catch(err) {
      console.log('something went wrong when storing token into asyncstorage');
    }
  }

  async authenticateToken(){
    console.log('started authenticate');
    try {
      let token = await this.getToken();
      if (!token){ throw 'token not set'; }
      console.log('current token is: ', token);
      this.verifyToken(token)
    } catch(err) {
      console.log('authentication failed: ', err);
    }
  }


  componentWillMount() {
    this.authenticateToken();
  }

  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      alert: null,
      token: null
    }
  }

  _showSignup(){
    this.props.navigation.navigate('signup')
  }

  async _signIn() {
    try {
      let params = JSON.stringify({
        'user': {
          'email': this.state.email,
          'password': this.state.password
        }
      });
      // APIもmodule化する
      let response = await fetch('http://localhost:4000/api/v1/sign_in', {
        method: 'POST',
        headers: {
          'x-is-native': 'true',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: params
      });
      let responseJson = await response.json();
      if ( response.status >= 200 && response.status < 300 ) {
        this.storeToken(responseJson.token);
        this.props.navigation.navigate('issues');
      } else {
        // ログイン失敗
        this.setState({
          alert: 'メールアドレスとパスワードのペアが正しくありません'
        })
      }
    } catch(error) {
      console.error(error);
    }
  }

  render() {
    return (
        <Container>
          <Content>
            <LinearGradient
              colors={['#358594', '#65b5c4']}
              style={rowStyles.linearGradient}>
                <Text style={styles.sitename}>Issus Login</Text>
                <Form>
                  <Item floatingLabel>
                    <Label>email</Label>
                    <Input
                      ref='email'
                      keyboardType='email-address'
                      onChangeText={(email) => { this.setState({email})}} />
                  </Item>
                  <Item floatingLabel last>
                    <Label>Password</Label>
                    <Input
                      ref='password'
                      onChangeText={(password) => { this.setState({password})}}
                      secureTextEntry={true} />
                  </Item>
                </Form>
                {this.state.alert
                  ? <View><Text>{this.state.alert}</Text></View>
                  : null }
                <Button transparent block primary
                  onPress={this._signIn.bind(this)}>
                  <Text>ログイン</Text>
                </Button>
                <TouchableHighlight onPress={this._showSignup.bind(this)}>
                  <Text style={{textAlign: 'center', fontSize: 11, color: '#888'}}>アカウントを作る</Text>
                </TouchableHighlight>
            </LinearGradient>
          </Content>
        </Container>
    )
  }
}
