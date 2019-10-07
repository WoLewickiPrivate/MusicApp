import React, { Component } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { AnimatedValue } from 'react-navigation';

import MidiNumbers from '../../Piano/MidiNumbers';
import Brick from './Brick';
import range from '../../../utils/rangeUtils';

interface Props {
  noteRange: any;
  startPos: number;
  movingVal: AnimatedValue;
  midis: Array<any>;
  unitLength: number;
}

interface State {
  noteRange: any;
  midis: Array<any>;
}
export default class Board extends Component<Props, State> {
  state = {
    noteRange: {
      first: MidiNumbers.fromNote('c4'),
      last: MidiNumbers.fromNote('e5'),
    },
    midis: [],
  };

  unitLength = this.props.unitLength;

  componentDidMount() {
    const { noteRange, midis } = this.props;

    this.setState({
      noteRange: {
        first: MidiNumbers.fromNote(noteRange.first),
        last: MidiNumbers.fromNote(noteRange.last),
      },
      midis: midis,
    });
  }

  getNaturalKeyCount() {
    return this.getMidiNumbers().filter((number: number) => {
      const { isAccidental } = MidiNumbers.getAttributes(number);
      return !isAccidental;
    }).length;
  }

  getNaturalKeys() {
    return this.getMidiNumbers().filter((number: number) => {
      const { isAccidental } = MidiNumbers.getAttributes(number);
      return !isAccidental;
    });
  }

  getAccidentalKeys() {
    return this.getMidiNumbers().filter((number: number) => {
      const { isAccidental } = MidiNumbers.getAttributes(number);
      return isAccidental;
    });
  }

  getMidiNumbers() {
    return range(this.state.noteRange.first, this.state.noteRange.last + 1);
  }

  getNaturalKeyWidth() {
    return 1 / this.getNaturalKeyCount();
  }

  generateNotes(naturalKeyWidth: number) {
    return this.state.midis.map((element: MidiElement, index) => {
      const pitch = element.pitch;
      const { isAccidental } = MidiNumbers.getAttributes(pitch);
      return (
        <Brick
          key={index}
          naturalKeyWidth={naturalKeyWidth}
          midiNumber={pitch}
          noteRange={this.state.noteRange}
          accidental={isAccidental}
          top={element.start * this.unitLength}
          height={(element.end - element.start) * this.unitLength}
        />
      );
    });
  }

  render() {
    const naturalKeyWidth = this.getNaturalKeyWidth();
    return (
      <Animated.View
        style={[
          styles.container,
          {
            top: this.props.startPos,
            transform: [
              { translateY: this.props.movingVal },
              { rotateX: '180deg' },
            ],
          },
        ]}
      >
        {this.generateNotes(naturalKeyWidth)}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'transparent',
  },
});
