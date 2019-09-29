import React, { Fragment } from 'react';
import { Text, View, ImageBackground } from 'react-native';
import styles from '../../../styles/Menu/MenuMainStyle';

import MenuButton from '../../Buttons/MenuButton';
import TutorialTexts from '../../../styles/Texts/TutorialTexts';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
  navigation: Navigation;
}

interface State {
  levels: Level[];
}

enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

interface Level {
  levelNumber: number;
  difficulty: Difficulty;
}

export default class StartGameMenu extends React.Component<Props, State> {
  state: State = {
    levels: [],
  };

  componentDidMount() {
    this.fillLevels();
  }

  fillLevels() {
    let newLevels = [];
    for (let i = 1; i < 10; i++) {
      newLevels.push({
        levelNumber: i,
        difficulty: Difficulty.Easy,
      });
    }
    this.setState({
      levels: newLevels,
    });
  }

  renderLevelButtons() {
    return this.state.levels.map(level => {
      return (
        <Fragment>
          <MenuButton
            text={`Level ${level.levelNumber}, difficulty: ${level.difficulty}`}
            onPress={() => this.props.navigation.navigate('Level')}
          />
        </Fragment>
      );
    });
  }

  render() {
    return (
      <ImageBackground
        source={require('../../../static/backgroundImages/pianoMain.jpg')}
        style={{ width: '100%', height: '100%' }}
      >
        <ScrollView>
          <View style={styles.container}>
            <Text style={TutorialTexts.text}>Choose level</Text>
            {this.renderLevelButtons()}
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}
