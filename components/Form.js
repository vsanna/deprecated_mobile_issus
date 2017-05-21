import React, { Component } from 'react';
import Layout from './commons/Layout.js'
import {
  TouchableHighlight,
  Text,
  View,
  TextInput,
  AsyncStorage
} from 'react-native';
import {
  Form,
  Item,
  Input,
  H1,
  Label,
  Button
} from 'native-base';

const AUTH_TOKEN = 'auth_token';

export default class Login extends Component {
  async getToken (){
    try {
      let token = await AsyncStorage.getItem(AUTH_TOKEN);
      if(!token) {
        console.log("Token not set");
        this.props.navigation.navigate('login')
      } else {
        this.setState({ token: token});
        return token
      }
    } catch(error) {
      console.log("Something went wrong when getting token from asyncstorage");
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
      } else {
          //Handle error
          let error = res;
          throw error;
      }
    } catch(error) {
        console.log("error response: " + error);
        this.props.navigation.navigate('login');
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
    (async ()=>{
      await Expo.Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      });
    })()
  }

  constructor(props){
    super(props);
    this.state = {
      token: null
    }
  }

  static navigationOptions = {
    title: 'login'
  }

  render() {
    return (
      <Layout navigation={this.props.navigation}>
        <H1>Issus Login</H1>
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
          <Button onPress={this._signIn.bind(this)}>
            <Text>ログイン</Text>
          </Button>
          <TouchableHighlight onPress={this._showSignup.bind(this)}>
            <Text style={{textAlign: 'center', fontSize: 'small', color: '#888'}}>アカウントを作る</Text>
          </TouchableHighlight>
        </Layout>
      )
    }
  }
