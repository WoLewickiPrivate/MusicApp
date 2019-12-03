import React from 'react';
import {
  Animated,
  Button,
  DeviceEventEmitter,
  Easing,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { addStarsToLevel } from '../../../redux/LevelStarsActions';
import { Sequence } from '../../../utils/midiConverter';
import {
  calculateSongLength,
  countGainedStars,
} from '../../../utils/notesParsing';
import range from '../../../utils/rangeUtils';
import MidiNumbers from '../../Piano/MidiNumbers';
import Piano from '../../Piano/Piano';
import Board from './Board';
import EndGamePopup from './EndGamePopup';
import StrikeDisplayer from './StrikeDisplayer';
import { LevelStars } from '../../../utils/levelMappings';
import { sendLevelStatistics } from '../../../networking/ServerConnector';

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
  token: string;
}

class Level extends React.Component<Props, State> {
  state: State = {
    levelStars: this.props.navigation.getParam('levelStars', 0),
    notes: this.props.navigation.getParam('noteSequence', {}),
    noteIndex: 0,
    movingVal: new Animated.Value(0),
    didGameEnd: false,
    didGameStart: false,
    didLevelLoad: false,
    token: this.props.navigation.getParam('token', ''),
  };

  brickUnitLength: number = 50;
  firstNote: string = 'a4';
  lastNote: string = 'g4';
  intervalID: any = null;
  starsGained: number = this.props.navigation.getParam('levelStars', 0);
  //@ts-ignore
  ws = new WebSocket('ws://192.168.1.13:8765');
  changePointsMap: Array<Array<{ start: number; end: number }>> = [];
  noteStack: Array<MidiElement> = [];
  longestStrike: number = 0;
  strike: number = 0;
  timestamp = 0;
  isTraining = this.props.navigation.getParam('isTraining', false);

  moveNotes() {
    Animated.timing(this.state.movingVal, {
      toValue: calculateSongLength(
        this.state.notes.totalDuration,
        this.brickUnitLength,
      ),
      duration: this.state.notes.totalDuration * 1000,
      easing: Easing.inOut(Easing.linear),
    }).start(() => {
      this.longestStrike = Math.max(this.strike, this.longestStrike);
      if (!this.isTraining) {
        this.addStars();
      }
      this.cleanUp();
      this.setState({ didGameEnd: true });
    });
  }

  cleanUp() {
    clearInterval(this.intervalID);
    this.resetStrike();
    this.releaseAllKeys();
    this.resetBoard();
  }

  resetBoard() {
    const firstMidi = MidiNumbers.fromNote(this.firstNote);
    const lastMidi = MidiNumbers.fromNote(this.lastNote);
    range(firstMidi, lastMidi + 1).forEach(midi => {
      DeviceEventEmitter.emit('brickEvent', {
        type: -1,
        note: midi,
        pos: 0,
      });
    });
  }

  touchKey(note: number) {
    DeviceEventEmitter.emit('pianoEvent', { type: 1, note: note });
    const midiIndex = this.getMidiIndex();
    let i = 0;
    while (
      i < this.noteStack.length &&
      this.noteStack[i].start < midiIndex &&
      this.noteStack[i].end > midiIndex
    ) {
      let currentNote = this.noteStack[i];
      if (currentNote.pitch == note) {
        if (i != 0) {
          [this.noteStack[0], this.noteStack[i]] = [
            this.noteStack[i],
            this.noteStack[0],
          ];
        }
        this.noteStack.shift();
        this.strike += 1;
        this.updateStrike();

        DeviceEventEmitter.emit('brickEvent', {
          type: 1,
          note: note,
          pos: midiIndex,
        });

        return;
      }
      i++;
    }

    if (this.strike > 0) {
      this.resetStrike();
    }
  }

  releaseKey(note: number) {
    DeviceEventEmitter.emit('pianoEvent', { type: 0, note: note });
  }

  releaseAllKeys() {
    this.state.notes.midisArray.forEach(val => this.releaseKey(val.pitch));
  }

  simulateNoteTouch(note: number) {
    this.touchKey(note);

    setTimeout(() => this.releaseKey(note), 50);
  }

  initStrikeUpdater() {
    this.state.movingVal.addListener(value => {
      if (this.noteStack.length > 0 && this.noteStack[0].end < value.value) {
        if (this.strike > 0) {
          this.longestStrike = Math.max(this.strike, this.longestStrike);
          this.resetStrike();
        }
        this.noteStack.shift();
      }
    });
  }

  definePianoBoundaries() {
    const onlyPitches = this.state.notes.midisArray.map(event => event.pitch);
    this.firstNote = MidiNumbers.midiToNoteName(Math.min(...onlyPitches));
    this.lastNote = MidiNumbers.midiToNoteName(Math.max(...onlyPitches));
  }

  getMidiIndex() {
    return Math.trunc(this.state.movingVal._value);
  }

  getPianoRangeArray(
    firstMidi: number,
    lastMidi: number,
  ): Array<Array<{ start: number; end: number }>> {
    return range(firstMidi, lastMidi + 1).map(() => []);
  }

  initNoteStack() {
    this.noteStack = this.state.notes.midisArray.map(element => {
      return {
        start: Math.trunc(element.start * this.brickUnitLength),
        end: Math.trunc(element.end * this.brickUnitLength),
        pitch: element.pitch,
      };
    });
  }

  addStars() {
    const stars = countGainedStars(
      this.longestStrike,
      this.state.notes.midisArray.length,
    );
    if (stars > this.starsGained) {
      this.starsGained = stars;
    }
  }

  resetStrike() {
    this.longestStrike = Math.max(this.strike, this.longestStrike);
    this.strike = 0;
    this.updateStrike();
  }

  updateStrike() {
    DeviceEventEmitter.emit('strikeUpdateEvent', { value: this.strike });
  }

  initWebSocket() {
    this.ws.onopen = () => {
      console.log('Socket opened');
      this.ws.send('something'); // send a message
    };

    this.ws.onmessage = (e: { data: string }) => {
      if (!this.state.didGameStart) {
        this.setState({ didGameStart: true });
        this.moveNotes();
      }
      this.simulateNoteTouch(parseInt(e.data));
    };
  }

  startGame() {
    this.state.movingVal.setValue(0);
    this.initNoteStack();
    this.initWebSocket();
    this.initStrikeUpdater();
    this.setState({ didLevelLoad: true });
  }

  componentWillMount() {
    this.definePianoBoundaries();
  }

  componentDidMount() {
    this.timestamp = new Date().getMinutes();
    this.startGame();
  }

  async componentWillUnmount() {
    const practice_time = Math.floor(new Date().getMinutes() - this.timestamp);
    if (this.state.levelStars < this.starsGained) {
      this.props.addStarsToLevel({
        song_id: this.props.navigation.getParam('levelNumber'),
        high_score: this.starsGained,
      });
    }
    console.warn(
      practice_time,
      this.starsGained,
      this.props.navigation.getParam('levelNumber'),
    );
    await sendLevelStatistics(this.state.token, {
      song_id: this.props.navigation.getParam('levelNumber'),
      practice_time,
      high_score: this.starsGained,
    });
    this.ws.close();
  }

  render() {
    return (
      <View style={styles.container}>
        <StrikeDisplayer />
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
            this.isTraining = true;
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
        <Piano noteRange={{ first: this.firstNote, last: this.lastNote }} />
      </View>
    );
  }
}
export type ReduxProps = ReturnType<typeof mapDispatchToProps>;

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    addStarsToLevel: (levelStars: LevelStars) =>
      dispatch(addStarsToLevel(levelStars)),
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
  strike_text: {
    zIndex: 1,
    textShadowOffset: { width: 10, height: 10 },
    fontWeight: 'bold',
    fontSize: 30,
    top: 50,
    position: 'absolute',
    justifyContent: 'flex-start',
    color: 'green',
    alignSelf: 'center',
  },
});
