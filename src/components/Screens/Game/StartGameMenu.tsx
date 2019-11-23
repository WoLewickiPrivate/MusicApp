import React, { Fragment } from 'react';
import { ImageBackground, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { RootReducerState } from '../../../redux/RootReducer';
import styles from '../../../styles/Menu/MenuMainStyle';
import convertMidi from '../../../utils/midiConverter';
import LevelButton from '../../Buttons/LevelButton';
import { get } from '../../../networking/ServerConnector';

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

const song = require('../../../static/sounds/output.json');

class StartGameMenu extends React.Component<Props, State> {
  state: State = {
    stars: 0,
    levels: [],
  };

  makeLevels(levelStars: number[]): Level[] {
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

  fetchSong() {
    fetch(
      '192.168.2.180:8000/songs/create_song?song_id=2&start_time=4.2&stop_time=33.0',
    ).then(value => console.warn(value));
  }

  renderLevelButtons() {
    return this.state.levels.map(({ levelNumber, name, levelStars }, index) => {
      return (
        <Fragment key={index}>
          <LevelButton
            disabled={this.state.stars < (levelNumber - 1) * 2}
            stars={levelStars}
            levelNumber={levelNumber}
            name={name}
            onPress={() =>
              this.props.navigation.navigate('Level', {
                levelStars,
                levelNumber,
                noteSequence: convertMidi(song),
              })
            }
          />
        </Fragment>
      );
    });
  }

  componentDidMount() {
    const levels = this.makeLevels(this.props.levelStars);
    this.setState({
      levels,
      stars: this.props.levelStars.reduce(this.sumElems, 0),
    });
  }

  sumElems(total: number, current: number) {
    return total + current;
  }

  render() {
    return (
      <ImageBackground
        source={require('../../../static/backgroundImages/pianoMain.jpg')}
        style={{ width: '100%', height: '100%' }}
      >
        <ScrollView>
          <View style={styles.container}>{this.renderLevelButtons()}</View>
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
