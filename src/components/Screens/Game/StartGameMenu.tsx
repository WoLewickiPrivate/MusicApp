import React, { Fragment } from 'react';
import { Text, View, ImageBackground } from 'react-native';

import { connect } from 'react-redux';

import { RootReducerState } from '../../../redux/RootReducer';
import styles from '../../../styles/Menu/MenuMainStyle';
import MenuButton from '../../Buttons/MenuButton';
import TutorialTexts from '../../../styles/Texts/TutorialTexts';
import { ScrollView } from 'react-native-gesture-handler';

interface OwnProps {
  navigation: Navigation;
}

type Props = ReduxProps & OwnProps;

interface State {
  stars: number;
  levels: Level[];
}

interface Level {
  levelNumber: number;
  name: string;
  levelStars: number;
}

class StartGameMenu extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    if (
      props.levelStars.reduce((total, current) => total + current, 0) !=
      state.stars
    ) {
      return {
        stars: props.levelStars.reduce((total, current) => total + current, 0),
        levels: StartGameMenu.makeLevels(props.levelStars),
      };
    }
    return null;
  }

  state: State = {
    stars: 0,
    levels: [],
  };

  static sumElems(total: number, current: number) {
    return total + current;
  }

  static makeLevels(levelStars: number[]): Level[] {
    const levels: Level[] = [];
    // add levelStars to Reducer after adding level, there will be dispatch method to make it work somehow
    for (let i = 1; i < levelStars.length; i++) {
      levels.push({
        levelNumber: i,
        name: `Get name from file`,
        levelStars: levelStars[i],
      });
    }
    return levels;
  }

  renderLevelButtons() {
    return this.state.levels.map(({ levelNumber, name, levelStars }, index) => {
      return (
        <Fragment key={index}>
          <MenuButton
            text={`${levelNumber}:    ${name}     stars: ${levelStars}`}
            onPress={() =>
              this.props.navigation.navigate('Level', {
                levelStars,
                levelNumber,
              })
            }
          />
        </Fragment>
      );
    });
  }

  componentDidMount() {
    const levels = StartGameMenu.makeLevels(this.props.levelStars);
    this.setState({
      levels,
      stars: this.props.levelStars.reduce(StartGameMenu.sumElems, 0),
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
            <Text style={TutorialTexts.text}>
              Your have {this.state.stars} star
              {this.state.stars === 1 ? '' : 's'}!
            </Text>
            {this.renderLevelButtons()}
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}

type ReduxProps = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootReducerState) => {
  return {
    levelStars: state.levelStars.levelStarsCount,
  };
};

export default connect(
  mapStateToProps,
  null,
)(StartGameMenu);
