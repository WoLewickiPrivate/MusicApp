import React, { Component } from 'react';
import { StyleSheet, View, DeviceEventEmitter } from 'react-native';
import MidiNumbers from '../../Piano/MidiNumbers';
import { EventSubscription } from 'fbemitter';

interface Props {
  midiNumber: number;
  naturalKeyWidth: number;
  accidental: Boolean;
  noteRange: any;
  top: number;
  height: number;
  pitchPositions: { [id: string]: number };
  accidentalWidthRatio: number;
}

interface State {
  brickState: number;
}

export default class Brick extends Component<Props, State> {
  public static defaultProps = {
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

  eventListener: EventSubscription = null;
  state: State = {
    brickState: -1,
  };

  componentDidMount() {
    this.eventListener = DeviceEventEmitter.addListener(
      'brickEvent',
      this.eventHandler,
    );
  }

  eventHandler = (event: any) => {
    if (event.note == this.props.midiNumber) {
      if (
        event.type == 1 &&
        event.pos > this.props.top &&
        event.pos < this.props.top + this.props.height
      ) {
        this.setState({ brickState: 1 });
      }
      if (event.type == 0) {
        this.setState({ brickState: 0 });
      }
    }
  };

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
      accidental,
      top,
      height,
    } = this.props;

    return (
      <View
        style={[
          styles.ReactPiano__Key,
          this.state.brickState == -1
            ? styles.ReactPiano__Key__grey
            : this.state.brickState == 0
            ? styles.ReactPiano__Key__red
            : styles.ReactPiano__Key__green,
          {
            top: top,
            left: ratioToPercentage(
              this.getRelativeKeyPosition(midiNumber) * naturalKeyWidth,
            ),
            width: ratioToPercentage(
              accidental
                ? accidentalWidthRatio * naturalKeyWidth
                : naturalKeyWidth,
            ),
            height: height,
          },
        ]}
      />
    );
  }
}

function ratioToPercentage(ratio: number) {
  return `${ratio * 100}%`;
}

const styles = StyleSheet.create({
  ReactPiano__Key: {
    position: 'absolute',
    borderWidth: 0,
    borderRadius: 5,
  },
  ReactPiano__Key__grey: {
    backgroundColor: '#808080',
  },
  ReactPiano__Key__red: {
    backgroundColor: '#FF0000',
  },
  ReactPiano__Key__green: {
    backgroundColor: '#7CFC00',
  },
  ReactPiano__Key__accidental: {
    zIndex: 1,
  },
});
