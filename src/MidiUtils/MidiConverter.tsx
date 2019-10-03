import { Midi } from '@tonejs/midi';
import * as FileSystem from 'expo-file-system';

export default class NewConverter {
  async convert(path: string) {
    let rawMidiData = await FileSystem.readAsStringAsync(path, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const midiData = this.stringToArrayBuffer(rawMidiData);
    const midi = new Midi(midiData);
  }

  stringToArrayBuffer(str: string) {
    //to do or not to do
    return new ArrayBuffer(1);
  }

  getIntervals(midi: Midi) {
    let intervals = [];
    if (midi.tracks.length > 0) {
      let notes = midi.tracks[0].notes;
      notes.forEach(entry => {
        let event = {
          pitch: entry.midi,
          start: entry.ticks,
          end: entry.ticks + entry.durationTicks,
        };

        intervals.push(event);
      });
    }
  }
}
