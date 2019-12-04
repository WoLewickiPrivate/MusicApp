import React from 'react';
import { View, ImageBackground, Alert, StyleSheet } from 'react-native';

import styles from '../../../styles/Menu/MenuMainStyle';

import MenuButton from '../../Buttons/MenuButton';
import { TextInput } from 'react-native-gesture-handler';
import { tryRegister } from '../../../networking/ServerConnector';

interface Props {
  navigation: Navigation;
}

interface State {
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export default class Register extends React.Component<Props, State> {
  readonly state: State = {
    login: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  };

  handleLoginChange = (login: string) => this.setState({ login });
  handlePasswordChange = (password: string) => this.setState({ password });
  handleEmailChange = (email: string) => this.setState({ email });
  handleFirstNameChange = (firstName: string) => this.setState({ firstName });
  handleLastNameChange = (lastName: string) => this.setState({ lastName });

  register = async () => {
    const { navigate } = this.props.navigation;
    const didRegister = await tryRegister(
      this.state.login,
      this.state.password,
      this.state.email,
      this.state.firstName,
      this.state.lastName,
    );
    if (didRegister) {
      navigate('Login');
    } else {
      Alert.alert('Something went wrong!', 'Login already used!');
    }
  };

  backgroundImage: any;
  componentWillMount() {
    this.backgroundImage = require('../../../static/backgroundImages/pianoMain.jpg');
  }

  render() {
    return (
      <ImageBackground
        source={this.backgroundImage}
        style={{ width: '100%', height: '100%' }}
      >
        <View style={styles.container}>
          <TextInput
            style={style_tweaks.input_style}
            placeholder="Login"
            value={this.state.login}
            onChangeText={this.handleLoginChange}
          />
          <TextInput
            style={style_tweaks.input_style}
            placeholder="Password"
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
          />
          <TextInput
            style={style_tweaks.input_style}
            placeholder="Email"
            value={this.state.email}
            onChangeText={this.handleEmailChange}
          />
          <TextInput
            style={style_tweaks.input_style}
            placeholder="First Name"
            value={this.state.firstName}
            onChangeText={this.handleFirstNameChange}
          />
          <TextInput
            style={style_tweaks.input_style}
            placeholder="Last Name"
            value={this.state.lastName}
            onChangeText={this.handleLastNameChange}
          />
          <MenuButton
            text="Submit"
            onPress={async () => await this.register()}
          />
        </View>
      </ImageBackground>
    );
  }
}

const style_tweaks = StyleSheet.create({
  input_style: {
    marginBottom: 15,
    paddingLeft: 25,
    height: 50,
    width: 300,
    borderRadius: 25,
    backgroundColor: 'white',
    borderColor: 'powderblue',
    borderWidth: 1,
    color: 'silver',
  },
});
