import React from 'react';
import { View, ImageBackground, Alert, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import styles from '../../../styles/Menu/MenuMainStyle';
import { Credentials } from '../../../redux/CredentialsReducer';

import MenuButton from '../../Buttons/MenuButton';
import { TextInput } from 'react-native-gesture-handler';
import { tryLogin } from '../../../networking/ServerConnector';
import { changeCredentials } from '../../../redux/CredentialsActions';
import {
  prepareLevels,
  LevelInfo,
  LevelStars,
} from '../../../utils/levelMappings';
import { addLevelInfo, clearLevelInfo } from '../../../redux/LevelInfosActions';
import { addStarsToLevel, clearStars } from '../../../redux/LevelStarsActions';

interface OwnProps {
  navigation: Navigation;
}

type Props = OwnProps & ReduxProps;

interface State {
  login: string;
  password: string;
}

class Creds extends React.Component<Props, State> {
  readonly state: State = {
    login: '',
    password: '',
  };

  handleLoginChange = (login: string) => this.setState({ login });
  handlePasswordChange = (password: string) => this.setState({ password });

  login = async () => {
    const { navigate } = this.props.navigation;
    const { didSuccess, token } = await tryLogin(
      this.state.login,
      this.state.password,
    );
    if (didSuccess) {
      this.props.saveCredentials({
        login: this.state.login,
        password: this.state.password,
      });
      await prepareLevels(
        token,
        this.props.clearLevels,
        this.props.clearStars,
        this.props.addLevelInfo,
        this.props.addLevelStars,
      );
      navigate('Main');
    } else {
      Alert.alert('Something went wrong!', 'Please try again');
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
            value={this.state.login}
            placeholder="Login"
            onChangeText={this.handleLoginChange}
          />
          <TextInput
            style={style_tweaks.input_style}
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
    addLevelInfo: (levelInfo: LevelInfo) => dispatch(addLevelInfo(levelInfo)),
    addLevelStars: (levelStars: LevelStars) =>
      dispatch(addStarsToLevel(levelStars)),
    clearLevels: () => dispatch(clearLevelInfo()),
    clearStars: () => dispatch(clearStars()),
    saveCredentials: (credentials: Credentials) =>
      dispatch(changeCredentials(credentials)),
  };
};

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

export default connect(
  null,
  mapDispatchToProps,
)(Creds);
