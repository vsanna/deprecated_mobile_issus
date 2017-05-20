import {AsyncStorage} from 'react-native';
const AUTH_TOKEN = 'auth_token';

export default {
  removeToken: async ()=>{
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN)
    } catch(error) {
      console.log('someting went wrong when removing token from asyncstorage')
    }
  },

  getToken: async () => {
    try {
      let token = await AsyncStorage.getItem(AUTH_TOKEN);
      if(!token) {
        console.log("Token not set");
      } else {
        return token
      }
    } catch(error) {
      console.log("Something went wrong when getting token from asyncstorage");
    }
  },

  storeToken: async (token) => {
    try {
      AsyncStorage.setItem(AUTH_TOKEN, token);
      this.getToken();
    } catch(err) {
      console.log('something went wrong when storing token into asyncstorage');
    }
  },

  verifyToken: async (token, redirect) => {
    let accessToken = token
    try {
      let response = await fetch('http://localhost:4000/api/v1/verify_token', {
            method: 'POST',
            headers: {
              'x-is-native': 'true',
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: {
              token: token
            }
          });
      let res = await response.json();
      if (response.status >= 200 && response.status < 300) {
        if (redirect) { redirect(); }
      } else {
        let error = res;
        throw error;
      }
    } catch(error) {
      console.log("error response: " + error);
      if ( this.props.navigation.routeName == 'login' ){ return; }
      this.props.navigation.navigate('login')
    }
  },

  authenticateToken: async (routeName) => {
    console.log('started authenticate');
    try {
      let token = await this.getToken();
      console.log('current token is: ', token);
      this.verityToken(token, () => {
        if (this.props.navigation.routeName == routeName){ return; }
        this.props.navigation.navigate(routeName)
      })
    } catch(err) {
      console.log('authentication failed: ', err);
    }
  }
}
