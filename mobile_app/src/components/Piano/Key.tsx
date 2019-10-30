import React from 'react';
import { StyleSheet, View } from 'react-native';
import MidiNumbers from './MidiNumbers';

interface Props {
  midiNumber: number;
  naturalKeyWidth: number; // Width as a ratio between 0 and 1
  useTouchEvents: boolean;
  accidental: boolean;
  onPlayNoteInput: Function;
  onStopNoteInput: Function;
  pitchPositions: { [id: string]: number };
  accidentalWidthRatio: number;
  noteRange: any;
}

class Key extends React.Component<Props> {
  state = {
    touched: false,
  };

  static defaultProps = {
    accidentalWidthRatio: 0.65,
    pitchPositions: {
      C: 0,
      Db: 0.55,
      D: 1,
      Eb: 1.8,
      E: 2,
      F: 3,
      Gb: 3.5,
      G: 4,
      Ab: 4.7,
      A: 5,
      Bb: 5.85,
      B: 6,
    },
  };

  simulateOnTouchStart = () => {
    this.setState({ touched: true });
  };

  simulateOnTouchEnd = () => {
    this.setState({ touched: false });
  };

  onPlayNoteInput = () => {
    this.setState({
      touched: true,
    });

    this.props.onPlayNoteInput(
      MidiNumbers.midiToNoteName(this.props.midiNumber),
      this.props.midiNumber,
    );
  };

  onStopNoteInput = () => {
    this.setState({
      touched: false,
    });

    this.props.onStopNoteInput(
      MidiNumbers.midiToNoteName(this.props.midiNumber),
      this.props.midiNumber,
    );
  };

  // Key position is represented by the number of natural key widths from the left
  getAbsoluteKeyPosition(midiNumber: number) {
    const OCTAVE_WIDTH = 7;
    const { octave, pitchName } = MidiNumbers.getAttributes(midiNumber);
    const pitchPosition = this.props.pitchPositions[pitchName];
    const octavePosition = OCTAVE_WIDTH * octave;
    return pitchPosition + octavePosition;
  }

  getRelativeKeyPosition(midiNumber: number) {
    return (
      this.getAbsoluteKeyPosition(midiNumber) -
      this.getAbsoluteKeyPosition(this.props.noteRange.first)
    );
  }

  render() {
    const {
      naturalKeyWidth,
      accidentalWidthRatio,
      midiNumber,
      useTouchEvents,
      accidental,
      children,
    } = this.props;

    const { touched } = this.state;
    let isAccidentalActive = accidental
      ? styles.ReactPiano__Key__active_accidental
      : styles.ReactPiano__Key__active;
    return (
      <View
        style={[
          styles.ReactPiano__Key,
          accidental
            ? styles.ReactPiano__Key__accidental
            : styles.ReactPiano__Key__natural,
          {
            left: ratioToPercentage(
              this.getRelativeKeyPosition(midiNumber) * naturalKeyWidth,
            ),
            width: ratioToPercentage(
              accidental
                ? accidentalWidthRatio * naturalKeyWidth
                : naturalKeyWidth,
            ),
          },
          touched && isAccidentalActive,
        ]}
      >
        <View style={styles.ReactPiano__NoteLabelContainer}>{children}</View>
      </View>
    );
  }
}

function ratioToPercentage(ratio: number) {
  return `${ratio * 100}%`;
}

const styles = StyleSheet.create({
  ReactPiano__Key: {
    position: 'absolute',
    height: 100,
  },
  ReactPiano__Key__natural: {
    backgroundColor: '#f6f5f3',
    borderColor: '#888',
    borderWidth: 1,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  ReactPiano__Key__accidental: {
    height: 60,
    backgroundColor: '#555',
    borderColor: 'transparent',
    borderWidth: 1,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    zIndex: 1,
  },
  ReactPiano__Key__active: {
    backgroundColor: '#3ac8da',
  },
  ReactPiano__Key__active_accidental: {
    backgroundColor: '#3a9fda',
  },
  ReactPiano__NoteLabelContainer: {
    flex: 1,
    /* Align children .ReactPiano__NoteLabel to the bottom of the key */
    alignSelf: 'flex-end',
  },
});

export default Key;
