import React from 'react';
import { Image, View, Text } from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { connect } from 'react-redux';

import Level from '../../src/components/Screens/Game/Level';
import StartGameMenu from '../../src/components/Screens/Game/StartGameMenu';
import MenuScreen from '../../src/components/Screens/MainMenu/MenuScreen';
import TrainingMenu from '../../src/components/Screens/Training/TrainingMenu';
import Tutorial from '../../src/components/Screens/Tutorial/Tutorial';
import TutorialMenu from '../../src/components/Screens/Tutorial/TutorialMenu';
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
