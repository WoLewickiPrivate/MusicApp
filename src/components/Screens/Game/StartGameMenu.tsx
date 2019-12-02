import React, { Fragment } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { View, ImageBackground, Button } from 'react-native';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { RootReducerState } from '../../../redux/RootReducer';
import styles from '../../../styles/Menu/MenuMainStyle';
import LevelButton from '../../Buttons/LevelButton';
import { getToken } from '../../../networking/ServerConnector';
import { getLevelNotes } from '../../../utils/midiConverter';
import { addLevelNotes } from '../../../redux/LevelNotesActions';

interface OwnProps {
  navigation: Navigation;
}

type Props = ReduxProps & OwnProps;

interface State {
  stars: number;
  levels: Level[];
  token: string;
}

interface Level {
  levelNumber: number;
  name: string;
  levelStars: number;
}

class StartGameMenu extends React.Component<Props, State> {
  state: State = {
    stars: 0,
    levels: [],
    token: '',
  };

  static getDerivedStateFromProps(props: Props, state: any) {
    const levels = StartGameMenu.makeLevels(props.levelStars);
    if (levels !== state.levels) {
      return {
        levels,
      };
    }
    return null;
  }

  async goToLevel(levelNumber: number, levelStars: number) {
    const noteSequence = await getLevelNotes(
      levelNumber,
      this.state.token,
      this.props.levelNotes,
      this.props.addNotes,
    );
    this.props.navigation.navigate('Level', {
      levelStars,
      levelNumber,
      noteSequence,
    });
  }

  static makeLevels(levelStars: number[]): Level[] {
    const levels: Level[] = [];
    // add levelStars to Reducer after adding level, there will be dispatch method to make it work somehow
    for (let i = 1; i < levelStars.length; i++) {
      levels.push({
        levelNumber: i,
        name: 'Level',
        levelStars: levelStars[i],
      });
    }
    return levels;
  }

  async click() {
    const rest = await getLevelNotes(10, this.state.token);
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
            onPress={async () => await this.goToLevel(levelNumber, levelStars)}
          />
        </Fragment>
      );
    });
  }

  async componentDidMount() {
    const token = await getToken(this.props.credentials);
    const levels = StartGameMenu.makeLevels(this.props.levelStars);
    this.setState({
      levels,
      stars: this.props.levelStars.reduce(this.sumElems, 0),
      token,
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
        <Button title="click" onPress={async () => this.click()} />
        <ScrollView>
          <View style={styles.container}>{this.renderLevelButtons()}</View>
        </ScrollView>
      </ImageBackground>
    );
  }
}

type ReduxProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = (state: RootReducerState) => {
  return {
    credentials: state.credentials.credentials,
    levelStars: state.levelStars.levelStarsCount,
    levelNotes: state.levelNotes.levelNotes,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    addNotes: (notesSpec: {
      noteSequence: SequenceNote;
      levelNumber: number;
    }) => dispatch(addLevelNotes(notesSpec)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StartGameMenu);
