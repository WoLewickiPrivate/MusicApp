import React from 'react';
import {
  Animated,
  Button,
  DeviceEventEmitter,
  Easing,
  StyleSheet,
  Text,
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
  strike: number;
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
    strike: 0,
  };

  brickUnitLength: number = 50;
  firstNote: string = 'a4';
  lastNote: string = 'g4';
  intervalID: any = null;
  starsGained: number = 0;
  //@ts-ignore
  ws = new WebSocket('ws://192.168.2.160:8765');
  changePointsMap: Array<Array<{ start: number; end: number }>> = [];
  noteStack: Array<MidiElement> = [];
  longestStrike: number = 0;

  moveNotes() {
    Animated.timing(this.state.movingVal, {
      toValue: calculateSongLength(
        this.state.notes.totalDuration,
        this.brickUnitLength,
      ),
      duration: this.state.notes.totalDuration * 1000,
      easing: Easing.inOut(Easing.linear),
    }).start(() => {
      this.longestStrike = Math.max(this.state.strike, this.longestStrike);
      if (!this.isTrainingLevel()) {
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
    console.log(this.checkAccuracy(note));
    if (this.checkAccuracy(note)) {
      const midiIndex = this.getMidiIndex();
      //prevent from counting strike many times on one note
      if (
        this.noteStack.length > 0 &&
        this.noteStack[0].start < midiIndex &&
        this.noteStack[0].end > midiIndex
      ) {
        this.noteStack.shift();
        this.setState({ strike: this.state.strike + 1 });
      }
      DeviceEventEmitter.emit('brickEvent', {
        type: 1,
        note: note,
        pos: midiIndex,
      });
    } else {
      if (this.state.strike > 0) {
        this.longestStrike = Math.max(this.state.strike, this.longestStrike);
        this.resetStrike();
      }
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
    if (this.state.didGameStart) {
      const midiIndex = this.getMidiIndex();
    }

    setTimeout(() => this.releaseKey(note), 50);
  }

  checkAccuracy(note: number) {
    const firstMidi = MidiNumbers.fromNote(this.firstNote);
    const midiIndex = this.getMidiIndex();
    const noteIndex = Math.min(
      note - firstMidi,
      MidiNumbers.fromNote(this.lastNote),
    );
    let closestPointIndex = this.changePointsMap[noteIndex].findIndex(
      value => value.end > midiIndex,
    );
    if (closestPointIndex == -1) {
      return false;
    }
    console.log(
      this.changePointsMap[noteIndex][closestPointIndex].start,
      this.changePointsMap[noteIndex][closestPointIndex].end,
      midiIndex,
    );
    return this.changePointsMap[noteIndex][closestPointIndex].start < midiIndex;
  }

  initStrikeUpdater() {
    setInterval(() => {
      if (
        this.noteStack.length > 0 &&
        this.noteStack[0].end < this.getMidiIndex()
      ) {
        if (this.state.strike > 0) {
          this.longestStrike = Math.max(this.state.strike, this.longestStrike);
          this.resetStrike();
        }
        this.noteStack.shift();
      }
    }, 10);
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

  initChangePointsMap() {
    const firstMidi = MidiNumbers.fromNote(this.firstNote);
    const lastMidi = MidiNumbers.fromNote(this.lastNote);
    let noteMap = this.getPianoRangeArray(firstMidi, lastMidi);
    this.state.notes.midisArray.map(element => {
      noteMap[element.pitch - firstMidi].push({
        start: Math.trunc(element.start * this.brickUnitLength),
        end: Math.trunc(element.end * this.brickUnitLength),
      });
    });

    this.changePointsMap = noteMap;
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

  isTrainingLevel() {
    return this.props.navigation.getParam('isTraining', false);
  }

  addStars() {
    this.starsGained = countGainedStars(
      this.longestStrike,
      this.state.notes.midisArray.length,
    );
    if (this.state.levelStars < this.starsGained) {
      this.props.addStarsToLevel({
        levelNumber: this.props.navigation.getParam('levelNumber', 0),
        starsGained: this.starsGained,
      });
    }
  }

  resetStrike() {
    this.setState({ strike: 0 });
  }

  initWebSocket() {
    this.ws.onopen = () => {
      console.warn('Socket opened');
      this.ws.send('something'); // send a message
    };

    this.ws.onmessage = e => {
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
    this.initChangePointsMap();
    this.startGame();
  }

  componentWillUnmount() {
    this.ws.close();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.strike_text}>{this.state.strike}</Text>
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
        <Piano noteRange={{ first: this.firstNote, last: this.lastNote }} />
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
    }) => dispatch(addStarsToLevel(levelSpec)),
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
