import React from 'react';
import { Image } from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Level from '../../src/components/Screens/Game/Level';
import StartGameMenu from '../../src/components/Screens/Game/StartGameMenu';
import MenuScreen from '../../src/components/Screens/MainMenu/MenuScreen';
import TrainingMenu from '../../src/components/Screens/Training/TrainingMenu';
import Tutorial from '../../src/components/Screens/Tutorial/Tutorial';
import TutorialMenu from '../../src/components/Screens/Tutorial/TutorialMenu';

const profileImage = (
  <Image
    style={{ width: 40, height: 40 }}
    source={require('../static/profilePicture/profile.png')}
  />
);

const navOptions = {
  headerStyle: {
    backgroundColor: 'grey',
  },
  headerTitle: profileImage,
  headerTintColor: '#fff',
};

const config = {
  headerLayoutPreset: 'center',
  defaultNavigationOptions: navOptions,
};

const MainNavigator = createStackNavigator(
  {
    Menu: { screen: MenuScreen },
    TrainingMenu: { screen: TrainingMenu },
    TutorialMenu: { screen: TutorialMenu },
    Tutorial: { screen: Tutorial },
    StartGameMenu: { screen: StartGameMenu },
    Level: { screen: Level },
  },
  // @ts-ignore
  config,
);

export default createAppContainer(MainNavigator);
