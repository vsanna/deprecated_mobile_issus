import React, { Component } from 'react';
import Layout from './commons/Layout.js';
// import auth from '../modules/auth.js';

import {
  StyleSheet,
  Image,
  StatusBar,
  AsyncStorage
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

const AUTH_TOKEN = 'auth_token';

export default class Sidebar extends Component {

  async getToken (){
    try {
      let token = await AsyncStorage.getItem(AUTH_TOKEN);
      if(!token) {
        console.log("Token not set");
      } else {
        this.setState({ token: token })
        return token
      }
    } catch(error) {
      console.log("Something went wrong when getting token from asyncstorage");
    }
  }
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
      let res = await response.json();
      if (response.status >= 200 && response.status < 300) {
      } else {
        let error = res;
        throw error;
      }
    } catch(error) {
      console.log("error response: " + error);
      this.props.navigation.navigate('login')
    }
  }
  async authenticateToken(routeName){
    console.log('started authenticate');
    try {
      let token = await this.getToken();
      if (!token){ throw 'token not set'; }
      this.verifyToken(token);
    } catch(err) {
      console.log('authentication failed: ', err);
    }
  }

  async _getProjects() {
    try {
      this.setState({loading: true})
      const token = await this.getToken();
      let response = await fetch('http://localhost:4000/api/v1/projects', {
        method: 'GET',
        headers: {
          'x-is-native': 'true',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token=' + token
        },
      });
      let responseJson = await response.json();
      if (response.status >= 200 && response.status < 300) {
        return responseJson.projects;
      } else {
        throw responseJson;
      }
    } catch(error) {
      console.log('cannot get projects: ', error);
    } finally {
      this.setState({loading: false})
    }
  }

  _setProjects(items){
    items = items ? items : [];
    this.setState({
      projects: items
    })
  }

  constructor(props){
    super(props);
    this.state = {
      token: null,
      loading: false,
      projects: []
    }
  }
  // 画面遷移のたびに動く
  componentWillMount() {
    this.authenticateToken();
  }
  componentDidMount(){
    (async ()=>{
      let items = await this._getProjects();
      this._setProjects(items);
    })().catch((e)=>{
      console.log(e);
    })
  }

  render() {
    return(
      <Container>
        <Content>
          <Image
            source={{
              uri: "https://study-log.s3.amazonaws.com/uploads/user/background_image/5/small_mountain.jpg"
            }}
            style={{
              height: 200,
              alignSelf: "stretch",
              justifyContent: "center",
              alignItems: "center"
            }}>
            <Image
              square
              style={{ height: 80, width: 80, borderRadius: 40}}
              source={{
                uri: "https://study-log.s3.amazonaws.com/uploads/user/icon_path/5/medium_VvT3g5-9_400x400.jpg"
              }}
            />
          </Image>
          <List
            dataArray={this.state.projects}
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
