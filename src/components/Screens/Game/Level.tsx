import React, { RefObject } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Piano from '../../Piano/Piano';
import Board from './Board';
import { tryAddStarsToLevel } from '../../../redux/LevelStarsActions';
import range from '../../../utils/rangeUtils';

interface OwnProps {
  navigation: Navigation;
}

type Props = ReduxProps & OwnProps;

interface Sequence {
  totalDuration: number;
  midisArray: MidiElement[];
}
interface State {
  levelNumber: number;
  levelStars: number;
  noteIndex: number;
  movingVal: Animated.Value;
  intervalID: any;
  notes: Sequence;
}

class Level extends React.Component<Props, State> {
  state: State = {
    levelNumber: this.props.navigation.getParam('levelNumber'),
    levelStars: this.props.navigation.getParam('levelStars'),
    notes: this.props.navigation.getParam('noteSequence', {}),
    noteIndex: 0,
    movingVal: new Animated.Value(0),
    intervalID: 0,
  };

  brickUnitLength = 50;
  firstNote = 'c4';
  lastNote = 'c#6';
  pianoElement: RefObject<Piano> = React.createRef();

  onPlay = (note: number) =>
    this.pianoElement.current!.simulateOnTouchStart(note);

  onStop = (note: number) =>
    this.pianoElement.current!.simulateOnTouchEnd(note);

  moveNotes() {
    Animated.timing(this.state.movingVal, {
      toValue: this.calculateSongLength(),
      duration: this.state.notes.totalDuration * 1000,
    }).start(() => {
      clearInterval(this.state.intervalID);
      this.state.notes.midisArray.forEach(val => this.onStop(val.pitch));
      const starsGained: number = this.countGainedStars();
      if (this.state.levelStars < starsGained) {
        this.props.addStarsToLevel({
          levelNumber: this.state.levelNumber,
          starsGained,
        });
      }
      this.showEndGameDialog();
    });
  }

  countGainedStars(): number {
    const starsGained = Math.floor(Math.random() * 58) % 4;
    return starsGained;
  }

  showEndGameDialog() {
    // TODO
    this.props.navigation.goBack();
  }

  componentDidMount() {
    let midisMap = this.initializeMidiMap();
    let previous: Array<number> = [];

    let intervalID = setInterval(() => {
      let midiIndex = Math.trunc(this.state.movingVal._value);

      if (!arraysEqual(previous, midisMap[midiIndex])) {
        previous.forEach(note => this.onStop(note));
        previous = midisMap[midiIndex];
        midisMap[midiIndex].forEach((note: number) => this.onPlay(note));
      }
    }, 10);

    this.setState({
      intervalID: intervalID,
    });

    setTimeout(() => this.moveNotes(), 1000);
  }

  render() {
    return (
      <View style={styles.container}>
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

  initializeMidiMap = () => {
    const midis = this.state.notes.midisArray.map(element => {
      return {
        start: Math.trunc(element.start * this.brickUnitLength),
        end: Math.trunc(element.end * this.brickUnitLength),
        pitch: element.pitch,
      };
    });
    const startTime = midis[0].start;
    const endTime = midis[midis.length - 1].end;

    const midisMap: Array<Array<number>> = range(startTime, endTime + 1).map(
      () => [],
    );

    midis.forEach(element => {
      for (let i = element.start; i < element.end; i++) {
        midisMap[i].push(element.pitch);
      }
    });

    return midisMap;
  };

  calculateSongLength = (): number => {
    return this.state.notes.totalDuration * this.brickUnitLength;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
});

type ReduxProps = ReturnType<typeof mapDispatchToProps>;

function arraysEqual(a: any[], b: any[]) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

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
