import React, { Component, RefObject } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, View } from 'react-native';

import range from 'just-range';

import Key from './Key';

import MidiNumbers from './MidiNumbers';

interface Props {
  noteRange: any;
  onPlayNoteInput: Function;
  onStopNoteInput: Function;
}

interface State {
  noteRange: any;
  keyReferences: RefObject<Key>[];
}

class Piano extends Component<Props, State> {
  state = {
    noteRange: {
      first: MidiNumbers.fromNote('c4'),
      last: MidiNumbers.fromNote('e5'),
    },
    keyReferences: new Array(),
  };

  static propTypes = {
    onPlayNoteInput: PropTypes.func.isRequired,
    onStopNoteInput: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { noteRange } = this.props;

    this.setState({
      noteRange: {
        first: MidiNumbers.fromNote(noteRange.first),
        last: MidiNumbers.fromNote(noteRange.last),
      },
      keyReferences: range(
        MidiNumbers.fromNote(noteRange.first),
        MidiNumbers.fromNote(noteRange.last) + 1,
      ).map(React.createRef),
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

  simulateOnTouchStart(note: number) {
    if (note < this.state.noteRange.first || note > this.state.noteRange.last)
      return;

    let index = note - this.state.noteRange.first;
    this.state.keyReferences[index].current.simulateOnTouchStart();
  }

  simulateOnTouchEnd(note: number) {
    if (note < this.state.noteRange.first || note > this.state.noteRange.last)
      return;

    let index = note - this.state.noteRange.first;
    this.state.keyReferences[index].current.simulateOnTouchEnd();
  }

  render() {
    const naturalKeyWidth = this.getNaturalKeyWidth();
    return (
      <View style={styles.container}>
        {this.getMidiNumbers().map((midiNumber: number) => {
          const { isAccidental } = MidiNumbers.getAttributes(midiNumber);
          return (
            <Key
              ref={
                this.state.keyReferences[
                  midiNumber - this.state.noteRange.first
                ]
              }
              naturalKeyWidth={naturalKeyWidth}
              midiNumber={midiNumber}
              noteRange={this.state.noteRange}
              accidental={isAccidental}
              onPlayNoteInput={this.props.onPlayNoteInput}
              onStopNoteInput={this.props.onStopNoteInput}
              useTouchEvents={true}
            />
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    position: 'relative',
    backgroundColor: 'transparent',
    marginBottom: 100,
  },
});

export default Piano;
