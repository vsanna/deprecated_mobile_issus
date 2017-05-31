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
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import {
  Container,
  Content,
  Button,
  Icon,
  Input,
  Item,
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

  // app起動時に呼ばれる
  constructor(props){
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged           : (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged : (s1, s2) => s1 !== s2
    })

    this.state = {
      issues: [],
      dataSource: ds.cloneWithRowsAndSections([[]]),
      token: null,
      loading: false,
      page: 1,
      refreshing: false,
    };
  }

  // 画面遷移のたびに動く
  componentWillMount() {
    this.authenticateToken();
  }

  // 画面遷移のたびにうごく
  componentDidMount(){
    (async ()=>{
      console.log('component did mount and get issue!')
      let items = await this._getIssues();
      this._setIssues(items);
    })().catch((e) => {
      console.log(e);
    })
  }


  async _searchIssues(){
    this.setState({page: 1})
    try {
      this.setState({loading: true})
      token = await this.getToken();
      const url = 'http://localhost:4000/api/v1/search' + '?page=' + this.state.page + '&query=' + this.state.searchQuery;
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
        return responseJson.issues;
      } else {
        throw responseJson;
      }
    } catch(error) {
      console.log('cannot get issues: ', error);
    } finally {
      this.setState({loading: false})
    }
  }

  _setIssues(items){
    const newIssues = this.state.issues.slice().concat(items);
    this.setState({
      issues: newIssues,
      dataSource: this.state.dataSource.cloneWithRowsAndSections(newIssues),
    })
  }

  async _getIssues() {
    try {
      this.setState({loading: true})
      token = await this.getToken();
      const fetch_all = !(this.props.navigation.state.params && this.props.navigation.state.params.id);
      const url = fetch_all
                    ? 'http://localhost:4000/api/v1/issues/all' + '?page=' + this.state.page
                    : `http://localhost:4000/api/v1/projects/${this.props.navigation.state.params.id}/issues?page=${this.state.page}`;

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


  _renderRow(data, sectionID, rowID){
    if(rowID == 0) { return null; }
    return (
      <ListItem
        style={{marginLeft: 0, paddingLeft: 15}}
        onPress={()=>{ this.props.navigation.navigate('form', { id: 'hoge', name: 'hoge' }) }}>
        <Body>
          <Text>{String(data.name)}</Text>
          <Text note>{data.project_name} | updated {data.updated_at}</Text>
          {data.tags.length > 0
            ? <Text note>{data.tags.join(', ')}</Text>
            : null}
        </Body>
      </ListItem>
    )
  }

  _renderSectionHeader(sectionData, sectionID) {
    return (
      <ListItem style={{backgroundColor: 'black', marginLeft: 0, paddingLeft: 15}}>
        <Text style={{color: '#fff'}}>{sectionData[0]}</Text>
      </ListItem>
    )
  }

  _onRefresh(){
    if(this.state.refreshing){ return; }
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
  render() {
    return(
      <Container style={{backgroundColor: '#fff'}}>
        <Header searchBar rounded>
          <Button
            style={{marginRight: 20}}
            transparent
            onPress={()=>{this.props.navigation.navigate('DrawerOpen')}}>
            <Icon name='menu' />
          </Button>
          <Item>
            <Input placeholder="イシューを探す" />
          </Item>
          <Button transparent onPress={()=>{console.log('search!')}}>
            <Icon name="ios-search" />
          </Button>
        </Header>
        <ListView
          dataSource={this.state.dataSource}
          onEndReachedThreshold={100}
          onEndReached={this._onRefresh.bind(this)}
          enableEmptySections={true}
          renderSectionHeader={this._renderSectionHeader.bind(this)}
          renderRow={this._renderRow.bind(this)}
          renderFooter={() => {
            return <ActivityIndicator size='large' animation={this.state.refreshing}/>;
          }}/>
      </Container>
    );
  }
}
