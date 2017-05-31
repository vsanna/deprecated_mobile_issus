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

import Splash from './components/Splash.js';
import Login from './components/Login.js';
import Signup from './components/Signup.js';
import Issues from  './components/Issues.js';
import Form from './components/Form.js';
import Sidebar from './components/Sidebar.js';
import Notifications from './components/Notifications.js';
import Notification from './components/Notification.js'

const IssuesPart = StackNavigator(
  {
    issues: { screen: Issues },
    form: { screen: Form }
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
              <Icon name="add" />
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
    splash: { screen: Splash },
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
    loginPart: { screen: LoginPart },
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
