import React from 'react';
import { View, ImageBackground, Text } from 'react-native';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import styles from '../../../styles/Menu/MenuMainStyle';
import { Credentials } from '../../../redux/CredentialsReducer';

import MenuButton from '../../Buttons/MenuButton';
import { TextInput } from 'react-native-gesture-handler';
import { tryLogin } from '../../../networking/ServerConnector';
import { changeCredentials } from '../../../redux/CredentialsActions';

interface OwnProps {
  navigation: Navigation;
}

type Props = OwnProps & ReduxProps;

interface State {
  login: string;
  password: string;
  text: string;
}

class Creds extends React.Component<Props, State> {
  readonly state: State = {
    login: '',
    password: '',
    text: '',
  };

  handleLoginChange = (login: string) => this.setState({ login });
  handlePasswordChange = (password: string) => this.setState({ password });

  login = async () => {
    const { navigate } = this.props.navigation;
    const didLogin = await tryLogin(this.state.login, this.state.password);
    if (didLogin) {
      this.props.saveCredentials({
        login: this.state.login,
        password: this.state.password,
      });
      navigate('Main');
    } else {
      this.setState({ text: 'Wrong credentials passed!' });
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
          <Text style={{ height: 40, backgroundColor: 'silver' }}>
            {this.state.text}
          </Text>
          <TextInput
            style={{
              height: 40,
              borderColor: 'powderblue',
              borderWidth: 1,
              borderBottomWidth: 3,
              width: 300,
              backgroundColor: 'silver',
            }}
            value={this.state.login}
            placeholder="Login"
            onChangeText={this.handleLoginChange}
          />
          <TextInput
            style={{
              height: 40,
              borderColor: 'powderblue',
              borderWidth: 1,
              borderBottomWidth: 3,
              width: 300,
              backgroundColor: 'silver',
            }}
            placeholder="Password"
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
          />
          <MenuButton text="Submit" onPress={async () => await this.login()} />
        </View>
      </ImageBackground>
    );
  }
}

type ReduxProps = ReturnType<typeof mapDispatchToProps>;

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    saveCredentials: (credentials: Credentials) =>
      dispatch(changeCredentials(credentials)),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(Creds);
