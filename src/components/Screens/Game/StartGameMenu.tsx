import React, { Fragment } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { View, ImageBackground } from 'react-native';

import { connect } from 'react-redux';

import { RootReducerState } from '../../../redux/RootReducer';
import styles from '../../../styles/Menu/MenuMainStyle';
import LevelButton from '../../Buttons/LevelButton';
import { LevelStars, mapIdToStars } from '../../../utils/levelMappings';
import { getToken, fetchNotes } from '../../../networking/ServerConnector';
import { getLevelNotes } from '../../../utils/midiConverter';

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

  async goToLevel(levelNumber: number, levelStars: number) {
    const notes = await fetchNotes(levelNumber, this.state.token);
    const noteSequence = getLevelNotes(notes);
    this.props.navigation.navigate('Level', {
      levelStars,
      levelNumber,
      noteSequence,
      token: this.state.token,
    });
  }

  makeLevels(): Level[] {
    const levels: Level[] = [];
    // add levelStars to Reducer after adding level, there will be dispatch method to make it work somehow
    for (const level of this.props.levelInfos) {
      if (level.level === this.props.navigation.getParam('difficulty', 'Easy'))
        levels.push({
          levelNumber: level.id,
          name: level.name,
          levelStars: mapIdToStars(level.id, this.props.levelStars),
        });
    }
    return levels;
  }

  renderLevelButtons() {
    return this.state.levels.map(({ levelNumber, name, levelStars }, index) => {
      return (
        <Fragment key={index}>
          <LevelButton
            stars={levelStars}
            name={name}
            onPress={async () => await this.goToLevel(levelNumber, levelStars)}
          />
        </Fragment>
      );
    });
  }

  async componentDidMount() {
    const levels = this.makeLevels();
    const token = await getToken(this.props.credentials);
    this.setState({
      levels,
      stars: this.props.levelStars.reduce(this.sumElems, 0),
      token,
    });
  }

  sumElems(total: number, current: LevelStars) {
    return total + current.high_score;
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
    credentials: state.credentials.credentials,
    levelStars: state.levelStars.levelStars,
    levelInfos: state.levelInfos.levelInfos,
  };
};

export default connect(
  mapStateToProps,
  null,
)(StartGameMenu);
