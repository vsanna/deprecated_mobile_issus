import React, { Component } from 'react';
import Expo from 'expo';
import EStyleSheet from 'react-native-extended-stylesheet';
EStyleSheet.build({});

import {
  View,
} from 'react-native';

import {
  StackNavigator,
  TabNavigator,
  DrawerNavigator
} from 'react-navigation';

import {
  Button,
  Text,
  Icon,
  Item,
  Footer,
  FooterTab,
  Label
} from 'native-base';

import Login from './components/Login.js';
import Signup from './components/Signup.js';
import Issues from  './components/Issues.js';
import Form from './components/Form.js';
import Sidebar from './components/Sidebar.js';

class Notifications extends React.Component {
  render(){
    return (
      <View><Text>notificationsが並ぶ</Text></View>
    )
  }
}
class Notification extends React.Component {
  render(){
    return (
      <View><Text>web viewで通知先表示する</Text></View>
    )
  }
}


const IssuesPart = StackNavigator(
  {
    issues: { screen: Issues }
  },
  {
    headerMode: 'none',
  }
)

const NotificationPart = StackNavigator(
  {
    notifications: { screen: Notifications },
    notification: { screen: Notification }
  },
  {
    headerMode: 'none',
  }
)
const Home = TabNavigator(
  {
    issuesPart: { screen: IssuesPart },
    notificationPart: { screen: NotificationPart }
  },
  {
    headerMode: 'none',
    tabBarPosition: 'bottom',
    tabBarComponent: props => {
      return (
        <Footer>
          <FooterTab>
            <Button
              vertical
              active={props.navigationState.index === 0}
              onPress={() => props.navigation.navigate("issues")}>
              <Icon name="note" />
            </Button>
            <Button
              vertical
              active={props.navigationState.index === 1}
              onPress={() => props.navigation.navigate("notifications")}>
              <Icon name="notifications" />
            </Button>
          </FooterTab>
        </Footer>
      );
    }
  }
)


const LoginPart = StackNavigator(
  {
    login: { screen: Login },
    signup: { screen: Signup }
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
)
const MainPart = DrawerNavigator(
  {
    home: { screen: Home }
  },
  {
    contentComponent: props => <Sidebar {...props}/>,
    headerMode: 'none'
  }
)

const WholeNavigator = StackNavigator(
  {
    login: { screen: LoginPart },
    main: { screen: MainPart }
  },
  {
    headerMode: 'none'
  }
)

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }
  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("native-base/Fonts/Ionicons.ttf")
    });
    this.setState({ isReady: true });
  }
  render() {
    if (!this.state.isReady) {
      // TODO: splushに置き換え
      return <Expo.AppLoading />;
    }
    return <WholeNavigator />;
  }
}
