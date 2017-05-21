import React, { Component } from 'react';
import Layout from './commons/Layout.js';
// import auth from '../modules/auth.js';

import {
  TouchableHighlight,
  Text,
  ListView,
  View,
  AsyncStorage,
  StyleSheet
} from 'react-native';

import {
  Container,
  Content,
  Button,
  Icon,
  List,
  ListItem,
  Header,
  Right,
  Left,
  Body,
  Title,
} from 'native-base';

const AUTH_TOKEN = 'auth_token';

export default class Issues extends Component {

  async getToken (){
    try {
      let token = await AsyncStorage.getItem(AUTH_TOKEN);
      if(!token) {
        console.log("Token not set");
        this.props.navigation.navigate('login')
      } else {
        this.setState({
          token: token
        })
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

  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      token: null,
      loading: false
    };
  }

  componentWillMount() {
    this.authenticateToken();
  }

  componentDidMount(){
    (async ()=>{
      const items = await this._getIssues();
      this._setIssues(items);
    })().catch((e) => {
      console.log(e);
    })
  }

  _setIssues(items){
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(items)
    })
  }

  async _getIssues() {
    try {
      this.setState({loading: true})
      token = await this.getToken();
      const fetch_all = false
      const url = fetch_all
                    ? `http://localhost:4000/api/v1/projects/${this.props.navigation.state.params.id}/issues`
                    : 'http://localhost:4000/api/v1/issues';
      let response = await fetch(url, {
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
        if (fetch_all) {
          return responseJson.issues;
        } else {
          return responseJson.open_issues.push(responseJson.closed_issues);
        }
      } else {
        throw responseJson;
      }
    } catch(error) {
      console.log('cannot get projects: ', error);
    } finally {
      this.setState({loading: false})
    }
  }

  _renderRow(data){
    return (
      <TouchableHighlight style={styles.projectListItem}
        onPress={()=>{
          this.props.navigation.navigate(
            'projects',
            { id: this.props.navigation.state.params.id, name: this.props.navigation.state.params.name }
          )
        }}>
        <ListItem>
          <Body>
            <Text>{data.name}</Text>
          </Body>
        </ListItem>
      </TouchableHighlight>
    )
  }

  render() {
    return(
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={()=>{this.props.navigation.navigate('DrawerOpen')}}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Issues</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <List>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this._renderRow.bind(this)}
              enableEmptySections={true}
            />
          </List>
        </Content>
      </Container>
    );
  }
}
