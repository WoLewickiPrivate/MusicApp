import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ButtonGroup from 'react-native-button-group';
import {
  NotoFontPack,
  ReactNativeSVGContext,
} from 'standalone-vexflow-context';
import Vex from 'vexflow';
import MidiNumbers from '../../Piano/MidiNumbers';
const { width, height } = Dimensions.get('window');

interface State {
  currentNote: string;
  randomNotes: Array<string>;
  guessed: boolean;
  score: number;
}

export default class Tutorial extends React.Component<State> {
  state: State = {
    currentNote: 'c4',
    randomNotes: [],
    guessed: false,
    score: 0,
  };

  generateRandomNotes() {
    let randomArray: Array<number> = [];
    while (randomArray.length != 3) {
      let randomNote = Math.floor(Math.random() * 10 + 60);
      if (randomArray.includes(randomNote)) {
        continue;
      }
      randomArray.push(randomNote);
    }
    let randomNotes = randomArray
      .map(note => MidiNumbers.midiToNoteName(note))
      .map(note => note.toLowerCase());

    return randomNotes;
  }

  pickRandomNote(randomNotes: Array<string>) {
    let randomIndex = Math.floor(Math.random() * 3);
    return randomNotes[randomIndex];
  }

  getParsedNoteString() {
    let note = this.state.currentNote;
    let bareNote = note.slice(0, note.length - 1);
    let octave = note[note.length - 1];

    return bareNote + '/' + octave;
  }

  generateButtons() {
    return this.state.randomNotes.map(note => {
      return (
        <TouchableOpacity
          style={styles.button_style}
          key={note}
          onPress={() => this.guessNote(note)}
        >
          <Text
            style={[
              styles.button_text,
              {
                color: this.state.guessed
                  ? note == this.state.currentNote
                    ? 'green'
                    : 'red'
                  : 'black',
              },
            ]}
          >
            {note}
          </Text>
        </TouchableOpacity>
      );
    });
  }

  guessNote(note: string) {
    this.setState({
      guessed: true,
      score:
        note == this.state.currentNote
          ? this.state.score + 1
          : this.state.score,
    });
    setTimeout(() => this.resetQuiz(), 1000);
  }

  resetQuiz() {
    let randomNotes = this.generateRandomNotes();
    let randomNote = this.pickRandomNote(randomNotes);
    this.setState({
      randomNotes: randomNotes,
      currentNote: randomNote,
      guessed: false,
    });
  }

  componentWillMount() {
    this.resetQuiz();
  }

  render() {
    const context = new ReactNativeSVGContext(NotoFontPack, {
      width: width,
      height: 400,
    });

    const VF = Vex.Flow;
    var stave = new VF.Stave(0, height / 2 - 200, width);
    stave.addClef('treble');
    stave.setContext(context).draw();
    let staveNote = this.state.currentNote.includes('#')
      ? new VF.StaveNote({
          clef: 'treble',
          keys: [this.getParsedNoteString()],
          duration: 'q',
        }).addAccidental(0, new VF.Accidental('#'))
      : new VF.StaveNote({
          clef: 'treble',
          keys: [this.getParsedNoteString()],
          duration: 'q',
        });
    var notes = [staveNote];

    var voice = new VF.Voice({ num_beats: 1, beat_value: 4 });
    voice.addTickables(notes);
    var formatter = new VF.Formatter()
      .joinVoices([voice])
      .format([voice], width / 2);
    voice.draw(context, stave);

    return (
      <View style={[{ alignItems: 'center', justifyContent: 'center' }]}>
        {context.render()}
        <Text style={[styles.info_text, { top: 50 }]}>
          Score: {this.state.score}
        </Text>
        <Text style={[styles.info_text, { bottom: 150 }]}>Guess the note!</Text>
        <ButtonGroup style={[{ justifyContent: 'space-around' }]}>
          {this.generateButtons()}
        </ButtonGroup>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  info_text: {
    fontSize: 30,
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
    width: 80,
    height: 80,
    backgroundColor: 'powderblue',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },
});
