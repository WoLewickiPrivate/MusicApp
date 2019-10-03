import React, { RefObject } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import range from 'just-range';

import Piano from '../../Piano/Piano';
import Board from './Board';

interface Props {
  navigation: Navigation;
}
interface State {
  noteIndex: number;
  movingVal: Animated.Value;
  intervalID: any;
}

export default class Level extends React.Component<Props, State> {
  state: State = {
    noteIndex: 0,
    movingVal: new Animated.Value(0),
    intervalID: 0,
  };

  brickUnitLength = 5;
  intervalID = 0;
  firstNote = 'c4';
  lastNote = 'c#6';
  notesLength: number = this.props.navigation.getParam('notesLength', 0);
  notes: any = this.props.navigation.getParam('notes', []);
  pianoElement: RefObject<Piano> = React.createRef();

  onPlay = (note: number) =>
    this.pianoElement.current.simulateOnTouchStart(note);

  onStop = (note: number) => this.pianoElement.current.simulateOnTouchEnd(note);

  moveNotes() {
    Animated.timing(this.state.movingVal, {
      toValue: 700,
      duration: 10000,
    }).start(() => {
      clearInterval(this.state.intervalID);
      midis.forEach(val => this.onStop(val['pitch']));
    });
  }

  componentDidMount() {
    let midisMap = this.initializeMidiMap();
    let previous: Array<number> = [];

    this.intervalID = setInterval(() => {
      let midiIndex = Math.trunc(
        this.state.movingVal._value / this.brickUnitLength,
      );

      if (previous.toString() !== midisMap[midiIndex].toString()) {
        previous.forEach(note => this.onStop(note));
        previous = midisMap[midiIndex];
        midisMap[midiIndex].forEach((note: number) => this.onPlay(note));
      }
    }, 10);

    this.moveNotes();
  }

  render() {
    return (
      <View style={styles.container}>
        <Board
          unitLength={this.brickUnitLength}
          noteRange={{ first: this.firstNote, last: this.lastNote }}
          startPos={0}
          movingVal={this.state.movingVal}
          midis={midis}
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
    let startTime = midis[0]['start'];
    let endTime = midis[midis.length - 1]['end'] + 1;

    let midisMap = range(startTime, endTime).map(() => []);
    midis.forEach(element => {
      for (let i = element['start']; i < element['end']; i++) {
        midisMap[i].push(element['pitch']);
      }
    });

    return midisMap;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
});

const midis = [
  { pitch: 60, start: 0, end: 10 },
  { pitch: 61, start: 10, end: 20 },
  { pitch: 65, start: 10, end: 30 },
  { pitch: 67, start: 30, end: 40 },
  { pitch: 79, start: 40, end: 60 },
  { pitch: 77, start: 60, end: 80 },
  { pitch: 81, start: 80, end: 120 },
  { pitch: 63, start: 80, end: 140 },
];
