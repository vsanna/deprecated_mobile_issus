import React, { Component } from 'react';
import Layout from './commons/Layout.js';
// import auth from '../modules/auth.js';
import {
  TouchableHighlight,
  Text,
  View,
  TextInput,
  AsyncStorage
} from 'react-native';

const AUTH_TOKEN = 'auth_token';

export default class Login extends Component {
  async getToken() {
    try {
      let token = await AsyncStorage.getItem(AUTH_TOKEN);
      if(!token) {
          console.log("Token not set");
      } else {
        this.setState({token: token});
        this.verifyToken(token)
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
        this.props.navigation.navigate('projects');
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

  // async verifyToken(token) {
  //   try {
  //     let response = await fetch('http://localhost:4000/api/v1/verify_token', {
  //           method: 'POST',
  //           headers: {
  //             'x-is-native': 'true',
  //             'Accept': 'application/json',
  //             'Content-Type': 'application/json',
  //             'Authorization': 'Bearer token=' + token
  //           },
  //           body: JSON.stringify({
  //             token: token
  //           })
  //         });
  //     let res = await response.json();
  //     if (response.status >= 200 && response.status < 300) {
  //     } else {
  //       let error = res;
  //       throw error;
  //     }
  //   } catch(error) {
  //     console.log("error response: " + error);
  //     // this.removeItem();
  //     // if ( this.props.navigation.routeName == 'login' ){ return; }
  //     // this.props.navigation.navigate('login')
  //   }
  // }

  async authenticateToken(routeName){
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


  static navigationOptions = {
    title: 'login'
  }

  componentWillMount() {
    AsyncStorage.getItem(AUTH_TOKEN).then((val) => {console.log(val)})
    this.authenticateToken('projects');
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

  _onForward(){
    this.props.navigation.navigate('projects', {
      someProp: 'hogehoge'
    })
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
        this.props.navigation.navigate('projects');
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
      <Layout>
        <Text>Issus Login</Text>
        {this.state.alert
          ? <View><Text>{this.state.alert}</Text></View>
          : null }
          <TextInput
            ref='email'
            onChangeText={(email) => { this.setState({email})}}
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            placeholder='email'
          />
          <TextInput
            ref='password'
            onChangeText={(password) => { this.setState({password})}}
            secureTextEntry={true}
            keyboardType='email-address'
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            placeholder='password'
          />
          <TouchableHighlight onPress={this._signIn.bind(this)}>
            <Text>login</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._showSignup.bind(this)}>
            <Text>new one?</Text>
          </TouchableHighlight>
        </Layout>
      )
    }
  }
