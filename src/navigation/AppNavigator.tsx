import React from 'react';
import { Image, View, Text } from 'react-native';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { connect } from 'react-redux';

import Level from '../components/Screens/Game/Level';
import StartGameMenu from '../components/Screens/Game/StartGameMenu';
import Credentials from '../components/Screens/MainMenu/Credentials';
import Register from '../components/Screens/MainMenu/Register';
import MenuScreen from '../components/Screens/MainMenu/MenuScreen';
import Settings from '../components/Screens/Settings/Settings';
import Tutorial from '../components/Screens/Tutorial/Tutorial';
import TutorialMenu from '../components/Screens/Tutorial/TutorialMenu';
import LoginScreen from '../components/Screens/MainMenu/LoginScreen';
import AuthLoadingScreen from '../components/Screens/MainMenu/AuthLoading';
import { RootReducerState } from '../redux/RootReducer';

interface Props {
  levelStars: number[];
}

function sumElems(total: number, current: number) {
  return total + current;
}

class Count extends React.Component<Props> {
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={require('../static/profilePicture/star.png')}
          style={{ width: 40, height: 40 }}
        />
        <Text style={{ fontSize: 40 }}>
          {this.props.levelStars.reduce(sumElems, 0)}
        </Text>
      </View>
    );
  }
}

let CountContainer = connect((state: RootReducerState) => ({
  levelStars: state.levelStars.levelStarsCount,
}))(Count);

const profileImage = <CountContainer />;

const navOptions = {
  headerStyle: {
    backgroundColor: 'powderblue',
  },
  headerTitle: profileImage,
  headerTintColor: '#fff',
};

const config = {
  headerLayoutPreset: 'center',
  defaultNavigationOptions: navOptions,
};

const AuthStackNavigator = createStackNavigator({
  Login: { screen: LoginScreen },
  Credentials: { screen: Credentials },
  Register: { screen: Register },
});

const MainStackNavigator = createStackNavigator(
  {
    Menu: { screen: MenuScreen },
    Settings: { screen: Settings },

    TutorialMenu: { screen: TutorialMenu },
    Tutorial: { screen: Tutorial },
    StartGameMenu: { screen: StartGameMenu },
    Level: { screen: Level },
  },
  // @ts-ignore
  config,
);

const SwitchNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Main: MainStackNavigator,
    Auth: AuthStackNavigator,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

export default createAppContainer(SwitchNavigator);
