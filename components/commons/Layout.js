import React, { Component, PropTypes } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
  Icon
} from 'native-base';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f8'
  }
})

export default class Layout extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props){
    super(props);
  }

  render(){
    return (
      <Container>
        {this.props.header}
        <Content padder>
          <View style={{flex: 1}}>
            {this.props.children}
          </View>
        </Content>
      </Container>
    )
  }
}
