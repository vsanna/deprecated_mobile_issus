import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e2e2e2',
  }
})

export default class Layout extends Component {
  render(){
    return (
      <View style={styles.container}>
        {this.props.children}
      </View>
    )
  }
}
