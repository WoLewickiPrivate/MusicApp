import React, { RefObject } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Piano from '../../Piano/Piano';
import Board from './Board';
import { tryAddStarsToLevel } from '../../../redux/LevelStarsActions';
import {
  initializeMidiMap,
  arraysEqual,
  onPlay,
  onStop,
  moveNotes,
} from '../../../utils/notesParsing';
import { Sequence } from '../../../utils/midiConverter';

interface OwnProps {
  navigation: Navigation;
}

type Props = ReduxProps & OwnProps;

interface State {
  levelNumber: number;
  levelStars: number;
  noteIndex: number;
  movingVal: Animated.Value;
  notes: Sequence;
  isTraining: boolean;
}

class Level extends React.Component<Props, State> {
  state: State = {
    levelNumber: this.props.navigation.getParam('levelNumber'),
    levelStars: this.props.navigation.getParam('levelStars'),
    notes: this.props.navigation.getParam('noteSequence', {}),
    noteIndex: 0,
    movingVal: new Animated.Value(0),
    isTraining: this.props.navigation.getParam('isTraining', false),
  };

  brickUnitLength: number = 50;
  firstNote: string = 'c4';
  lastNote: string = 'c#6';
  pianoElement: RefObject<Piano> = React.createRef();
  intervalID: any = null;

  componentDidMount() {
    const midisMap = initializeMidiMap(this.state.notes, this.brickUnitLength);
    let previous: Array<number> = [];

    this.intervalID = setInterval(() => {
      // @ts-ignore
      const midiIndex = Math.trunc(this.state.movingVal._value);

      if (!arraysEqual(previous, midisMap[midiIndex])) {
        previous.forEach(note => onStop(note, this.pianoElement));
        previous = midisMap[midiIndex];
        midisMap[midiIndex].forEach((note: number) =>
          onPlay(note, this.pianoElement),
        );
      }
    }, 10);

    setTimeout(
      () =>
        moveNotes(
          this.state.notes,
          this.brickUnitLength,
          this.intervalID,
          this.state.movingVal,
          this.state.isTraining,
          this.state.levelStars,
          this.state.levelNumber,
          this.props.addStarsToLevel,
          this.props.navigation,
          this.pianoElement,
        ),
      1000,
    );
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
