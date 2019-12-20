import React from 'react';
import {
  Dimensions,
  Button,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {
  NotoFontPack,
  ReactNativeSVGContext,
} from 'standalone-vexflow-context';
import { playNote, stopNote } from 'react-native-sound-module';
import ButtonGroup from 'react-native-button-group';
import Vex from 'vexflow';
import MidiNumbers from '../../Piano/MidiNumbers';
import { intervals, PLAY_TIME, BASE_NOTE } from './utils/intervals';
const { width, height } = Dimensions.get('window');
const VF = Vex.Flow;

interface State {
  currentInterval: number;
  randomIntervals: Array<number>;
  guessed: boolean;
  staveNotes: Array<any>;
}

export default class IntervalsQuiz extends React.Component<State> {
  state: State = {
    currentInterval: 0,
    randomIntervals: [],
    guessed: false,
    staveNotes: [],
  };

  generateRandomIntervals() {
    let randomArray: Array<number> = [];
    while (randomArray.length != 3) {
      let randomInterval = Math.floor(Math.random() * intervals.length);
      if (randomArray.includes(randomInterval)) {
        continue;
      }
      randomArray.push(randomInterval);
    }

    return randomArray;
  }

  pickRandomInterval(randomIntervals: Array<number>) {
    let randomIndex = Math.floor(Math.random() * 3);
    return randomIntervals[randomIndex];
  }

  getNoteFromInterval(interval: number) {
    const note = BASE_NOTE + interval;

    return MidiNumbers.midiToNoteName(note);
  }

  getParsedNoteString(note: string) {
    let bareNote = note.slice(0, note.length - 1);
    let octave = note[note.length - 1];

    return bareNote + '/' + octave;
  }

  getStaveNote(note: string) {
    return note.includes('#')
      ? new VF.StaveNote({
          clef: 'treble',
          keys: [note],
          duration: 'q',
        }).addAccidental(0, new VF.Accidental('#'))
      : new VF.StaveNote({
          clef: 'treble',
          keys: [note],
          duration: 'q',
        });
  }

  guessInterval(interval: number) {
    let isCorrect = interval == this.state.currentInterval;
    this.setState({
      guessed: true,
      staveNotes: isCorrect ? this.state.staveNotes : [],
    });
    setTimeout(() => this.resetQuiz(), 1000);
  }

  generateButtons() {
    return this.state.randomIntervals.map(interval => {
      return (
        <TouchableOpacity
          style={styles.button_style}
          key={interval}
          onPress={() => this.guessInterval(interval)}
        >
          <Text
            style={[
              styles.button_text,
              {
                color: this.state.guessed
                  ? interval == this.state.currentInterval
                    ? 'green'
                    : 'red'
                  : 'black',
              },
            ]}
          >
            {intervals[interval]}
          </Text>
        </TouchableOpacity>
      );
    });
  }

  async playWithDelay(note: number) {
    await promiseTimeout(() => {
      playNote(note, PLAY_TIME);
    }, PLAY_TIME);
  }

  async playInterval(interval: number) {
    await this.playWithDelay(BASE_NOTE);
    await this.playWithDelay(BASE_NOTE + interval);
  }

  async resetQuiz() {
    let randomIntervals = this.generateRandomIntervals();
    let currentInterval = this.pickRandomInterval(randomIntervals);
    let intervalNote = this.getParsedNoteString(
      this.getNoteFromInterval(currentInterval),
    );

    console.warn(intervalNote);
    let stave = this.getStaveNote(intervalNote);

    await this.playInterval(currentInterval);

    this.setState({
      currentInterval: currentInterval,
      randomIntervals: randomIntervals,
      guessed: false,
      staveNotes: [this.getStaveNote('c/4'), stave],
    });
  }

  componentWillMount() {
    this.resetQuiz();
  }

  componentWillUpdate() {
    console.warn(this.state.currentInterval);
  }

  getRenderedContext(notes: Array<any>) {
    const context = new ReactNativeSVGContext(NotoFontPack, {
      width: width - 10,
      height: 400,
    });

    let stave = new VF.Stave(0, height / 2 - 200, width - 10);
    stave.addClef('treble');
    stave.setContext(context).draw();
    let notesArray = notes;

    var voice = new VF.Voice({
      num_beats: notesArray.length,
      beat_value: 4,
    });
    voice.addTickables(notesArray);
    var formatter = new VF.Formatter()
      .joinVoices([voice])
      .format([voice], width - 50);
    voice.draw(context, stave);

    return context;
  }

  render() {
    return (
      <View style={[{ alignItems: 'center', justifyContent: 'center' }]}>
        {this.state.guessed
          ? this.getRenderedContext(this.state.staveNotes).render()
          : this.getRenderedContext([]).render()}
        <ButtonGroup
          style={[
            {
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          {this.generateButtons()}
        </ButtonGroup>
      </View>
    );
  }
}

function promiseTimeout(callback: () => void, delay: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      callback();
      resolve();
    }, delay);
  });
}

const styles = StyleSheet.create({
  info_text: {
    fontSize: 20,
    position: 'absolute',
    color: 'black',
    alignSelf: 'center',
  },
  button_text: {
    zIndex: 1,
    fontWeight: 'bold',
    fontSize: 30,
    color: 'black',
  },
  button_style: {
    width: 300,
    height: 50,
    backgroundColor: 'powderblue',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
});
