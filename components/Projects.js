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
  List,
  ListItem,
  Header,
  Right,
  Left,
  Body,
  Title,
} from 'native-base';

const AUTH_TOKEN = 'auth_token';


export default class Projects extends Component {

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

  async authenticateToken(){
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
      const items = await this._getProjects();
      this._setProjects(items);
    })().catch((e) => {
      console.log(e);
    })
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
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(items)
    })
  }

  // move to sign out scene
  async _signOut(){
    try {
      const token = await this.getToken();
      let response = await fetch('http://localhost:4000/api/v1/sign_out', {
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
        AsyncStorage.removeItem('auth_token');
        this.props.navigation.navigate('login');
      } else {
        throw responseJson;
      }
    } catch(error) {
      console.log('cannot get projects: ', error);
    }
  }

  _renderRow(data){
    return (
      <TouchableHighlight style={styles.projectListItem}
        onPress={()=>{
          this.props.navigation.navigate(
            'project',
            { id: data.id, name: data.name }
          )
        }}>
        {data.name}
        {/* <ListItem>
          <Body>
            <Text>{data.name}</Text>
            <Text note>{data.issue_size} issues</Text>
            <Text note>updated {data.updated_at}</Text>
          </Body>
        </ListItem> */}
      </TouchableHighlight>
    )
  }

  static navigationOptions = {
    title: 'projects',
  }

  _header(){
    return (
      <Header>
        <Left>
          <Button
            transparent
            onPress={() => this.props.navigation.navigate("DrawerOpen")}>
            <Icon name="menu" />
          </Button>
        </Left>
        <Body>
          <Title>Lucy Chat</Title>
        </Body>
        <Right>
          <Icon name="menu" />
        </Right>
      </Header>
    )
  }

  render() {
    return(
      <Layout navigation={this.props.navigation} header={this._header()}>
        {this.state.loading
          ? <View><Text>loading...</Text></View>
          : null}
          <List>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this._renderRow.bind(this)}
              enableEmptySections={true}
            />
          </List>

          <TouchableHighlight onPress={this._signOut.bind(this)}><Text>signout</Text></TouchableHighlight>
        </Layout>
      );
    }
  }


  const styles = StyleSheet.create({
    projectListItem: {
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 16,
      paddingRight: 16,
      borderBottomWidth: StyleSheet.borderBottomWidth,
      borderBottomColor: '#f2f2f2',
    }
  })
