import React, { RefObject } from 'react';
import {
  Animated,
  Button,
  DeviceEventEmitter,
  StyleSheet,
  View,
  Easing,
} from 'react-native';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { tryAddStarsToLevel } from '../../../redux/LevelStarsActions';
import { Sequence } from '../../../utils/midiConverter';
import {
  calculateSongLength,
  countGainedStars,
  initializeMidiMap,
} from '../../../utils/notesParsing';
import Piano from '../../Piano/Piano';
import Board from './Board';
import EndGamePopup from './EndGamePopup';

interface OwnProps {
  navigation: Navigation;
}

type Props = ReduxProps & OwnProps;

interface State {
  levelStars: number;
  noteIndex: number;
  movingVal: Animated.Value;
  notes: Sequence;
  didGameEnd: boolean;
  didGameStart: boolean;
  didLevelLoad: boolean;
}

class Level extends React.Component<Props, State> {
  state: State = {
    levelStars: this.props.navigation.getParam('levelStars'),
    notes: this.props.navigation.getParam('noteSequence', {}),
    noteIndex: 0,
    movingVal: new Animated.Value(0),
    didGameEnd: false,
    didGameStart: false,
    didLevelLoad: false,
  };

  brickUnitLength: number = 50;
  firstNote: string = 'c4';
  lastNote: string = 'c#6';
  intervalID: any = null;
  starsGained: number = 0;
  pianoElement: RefObject<Piano> = React.createRef();

  touchKey(note: number) {
    DeviceEventEmitter.emit('pianoEvent', { type: 1, note: note });
  }

  releaseKey(note: number) {
    DeviceEventEmitter.emit('pianoEvent', { type: 0, note: note });
  }

  releaseAllKeys() {
    this.state.notes.midisArray.forEach(val => this.releaseKey(val.pitch));
  }

  moveNotes() {
    Animated.timing(this.state.movingVal, {
      toValue: calculateSongLength(
        this.state.notes.totalDuration,
        this.brickUnitLength,
      ),
      duration: this.state.notes.totalDuration * 1000,
      easing: Easing.inOut(Easing.linear),
    }).start(() => {
      clearInterval(this.intervalID);
      this.releaseAllKeys();
      if (!this.props.navigation.getParam('isTraining', false)) {
        this.starsGained = countGainedStars();
        if (this.state.levelStars < this.starsGained) {
          this.props.addStarsToLevel({
            levelNumber: this.props.navigation.getParam('levelNumber', 0),
            starsGained: this.starsGained,
          });
        }
      }
      this.setState({ didGameEnd: true });
    });
  }

  startGame() {
    this.state.movingVal.setValue(0);
    this.setState({ didLevelLoad: true });
  }

  componentDidMount() {
    const midiMap: number[][] = initializeMidiMap(
      this.state.notes,
      this.brickUnitLength,
    );
    this.startGame();
  }

  render() {
    return (
      <View style={styles.container}>
        <EndGamePopup
          navigation={this.props.navigation}
          levelNumber={this.props.navigation.getParam('levelNumber', 0)}
          levelStars={this.starsGained}
          visible={this.state.didGameEnd}
          isTraining={this.props.navigation.getParam('isTraining', false)}
          song={this.props.navigation.getParam('noteSequence', {})}
          startAgain={() => {
            this.setState({ didGameEnd: false, didGameStart: false });
            this.startGame();
          }}
          goBack={() => {
            this.setState({ didGameEnd: false, didGameStart: false });
            this.props.navigation.goBack();
          }}
          doTraining={() => {
            // TODO fetch new song
            this.setState({ didGameEnd: false, didGameStart: false });
            this.startGame();
          }}
        />

        {!this.state.didGameStart && this.state.didLevelLoad && (
          <Button
            title="Press any midi key to start"
            onPress={() => {
              this.setState({ didGameStart: true });
              this.moveNotes();
            }}
          />
        )}
        <Board
          unitLength={this.brickUnitLength}
          noteRange={{ first: this.firstNote, last: this.lastNote }}
          startPos={0}
          movingVal={this.state.movingVal}
          midis={this.state.notes.midisArray}
        />
        <Piano
          ref={this.pianoElement}
          noteRange={{ first: this.firstNote, last: this.lastNote }}
          onPlayNoteInput={() => {}}
          onStopNoteInput={() => {}}
        />
      </View>
    );
  }
}
export type ReduxProps = ReturnType<typeof mapDispatchToProps>;

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    addStarsToLevel: (levelSpec: {
      levelNumber: number;
      starsGained: number;
    }) => dispatch(tryAddStarsToLevel(levelSpec)),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(Level);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
});
