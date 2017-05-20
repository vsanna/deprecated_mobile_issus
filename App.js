import React from 'react';
import {
  Text,
  View,
  Button
} from 'react-native';

import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import Login from './components/Login.js';
import Signup from './components/Signup.js';
import Projects from  './components/Projects.js';
import Project from  './components/Project.js';

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

const SigninOrSignup = StackNavigator(
  {
    login: {
      screen: Login
    },
    signup: {
      screen: Signup
    },
  },
  {
    mode: 'modal',
    // headerMode: 'none' // hide header
  }
)
const ProjectPart = StackNavigator(
  {
    projects: {
      screen: Projects
    },
    project: {
      screen: Project,
      navigationOptions: ({navigation}) => ({
        title: `project | ${navigation.state.params.name}`,
      }),
    }
  },
  // {
  //   navigationOptions: ({navigation}) => ({
  //     headerLeft: <Button onPress={() => {navigation.goBack()}} title="戻る"/>
  //   })
  // }
)

const NotificationPart = StackNavigator(
  {
    notificatins: {
      screen: Notifications,
      navigationOptions: ({navigation}) => ({
        title: 'notifications',
      }),
    },
    notification: {
      screen: Notification,
      navigationOptions: ({navigation}) => ({
        title: 'notification',
      }),
    }
  },
)

const MainTab = TabNavigator(
  {
    projectPart: {
      screen: ProjectPart,
    },
    notificationPart: {
      screen: NotificationPart
    }
  },
)

export default StackNavigator(
  {
    signupOrsignin: {
      screen: SigninOrSignup
    },
    main: {
      screen: MainTab,
      navigationOptions: () => ({
        headerLeft: null
      })
    }
  },
  {
    headerMode: 'none'
  }
)
