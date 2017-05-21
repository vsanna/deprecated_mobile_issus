export default class API {
  API_VER = 'v1'
  API_PREFIX = '/api/' + this.API_VER + '/'

  get (path, params) {
    return this.api('GET', path, params)
  }

  post (path, params) {
    return this.api('POST', path, params)
  }

  postWithFile (path, params) {
    return this.apiWithFile('POST', path, params)
  }

  put (path, params) {
    return this.api('PUT', path, params)
  }

  delete (path, params) {
    return this.api('DELETE', path, params)
  }

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

  async api (type, path, params) {
    const token = await this.getToken();
    return fetch(path, {
      method: type,
      headers: {
        'x-is-native': 'true',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token=' + token
      },
      body: JSON.stringify(params)
    });
  }

  apiWithFile (type, path, params) {
    return $.ajax({
      type,
      'headers': {
        'X-CSRF-Token': `${this.getRailsToken()}`
      },
      'url': this.API_PREFIX() + this.modifyPath(path),
      'dataType': 'json', // 返り値のはなし
      'data': params,
      'processData': false, // data:に指定したオブジェクトをGETメソッドのクエリ文字への変換有無を設定する項目. postならfalse
      'contentType': false // データ送信時のcontent-typeヘッダの値. FormDataオブジェクトの場合は適切なcontentTypeが設定されるので不要
    })
  }

  getRailsToken () {
    return $('meta[name="csrf-token"]')[0].content
  }

  modifyPath (path) {
    return (path[0] === '/') ? path.slice(1) : path
  }

}
