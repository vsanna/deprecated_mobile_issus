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

const AUTH_TOKEN = 'auth_token';


export default class Project extends Component {

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

  static navigationOptions = {
    headerBackTitle: null,
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
    AsyncStorage.getItem(AUTH_TOKEN).then((val) => {console.log(val)})
    this.authenticateToken('project');
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
      const url = `http://localhost:4000/api/v1/projects/${this.props.navigation.state.params.id}/issues`
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
        return responseJson.open_issues;
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
            'project',
            { id: data.id }
          )
        }}>
        <Text>{data.name}</Text>
      </TouchableHighlight>
    )
  }

  render() {
    return(
      <Layout>
        {this.state.loading
          ? <View><Text>loading...</Text></View>
          : null}
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
        />
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
