import React, { Component } from 'react';
import Layout from './commons/Layout.js';
// import auth from '../modules/auth.js';

import {
  TouchableHighlight,
  Text,
  ListView,
  View,
  AsyncStorage,
  StyleSheet,
  RefreshControl
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
      // dataSource: ds.cloneWithRows([]),
      issues: [],
      token: null,
      loading: false,
      page: 1,
      refreshing: false
    };
  }

  componentWillMount() {
    this.authenticateToken();
    (async ()=>{
      const items = await this._getProjects();
      this._setProjects(items);
    })
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
      issues: items,
      // dataSource: this.state.dataSource.cloneWithRows(items)
    })
  }

  async _getIssues() {
    try {
      this.setState({loading: true})
      token = await this.getToken();
      const fetch_all = !(this.props.navigation.params && this.props.navigation.params.id);
      const url = fetch_all
                    ? 'http://localhost:4000/api/v1/issues/all' + '?page=' + this.state.page
                    : `http://localhost:4000/api/v1/projects/${this.props.navigation.state.params.id}/issues?page=${this.state.page}`;


      if (!fetch_all){debugger;}

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
        this.setState({page: this.state.page + 1});
        if (fetch_all) {
          return responseJson.issues;
        } else {
          return responseJson.open_issues.push(responseJson.closed_issues);
        }
      } else {
        throw responseJson;
      }
    } catch(error) {
      console.log('cannot get issues: ', error);
    } finally {
      this.setState({loading: false})
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
    debugger;
    this.props.navigation.setParams({
      projects: items
    })
  }

  _renderRow(data){
    if ( data.type == 'date' ){
      return <Separator bordered><Text>{data.data}</Text></Separator>;
    } else {
      return (
        <ListItem
          onPress={()=>{ this.props.navigation.navigate('form', { id: 'hoge', name: 'hoge' }) }}>
          <Body><Text>{data.data.name}</Text></Body>
        </ListItem>
      )
    }
  }

  _onRefresh(){
    this.setState({refreshing: true});
    (async ()=>{
      const items = await this._getIssues();
      const newIssues = this.state.issues.slice().concat(items);
      this._setIssues(newIssues);
      this.setState({refreshing: false});
    })().catch((e) => {
      console.log(e);
      this.setState({refreshing: false});
    }).then(()=>{
    })
  }
  renderRefreshControl(){
    return (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this._onRefresh.bind(this)} />
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
        {/* <Content refreshControl={this.renderRefreshControl()}> */}
        <Content>
          <List
            dataArray={this.state.issues}
            onEndReached={this._onRefresh.bind(this)}
            renderRow={this._renderRow.bind(this) } />
          {this.props.refreshing
            ? <Text style={{height: 80, marginBottom: 100}}>loading</Text>
            : null}
        </Content>
      </Container>
    );
  }
}
