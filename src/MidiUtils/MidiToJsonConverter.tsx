interface Track {
  deltaTime?: number;
  type?: string;
  subtype?: string;
  numerator?: number;
  denominator?: number;
  metronome?: number;
  thirtyseconds?: number;
  text?: string;
  microsecondsPerBeat?: number;
  velocity?: number;
  value?: number;
  channel?: number;
  controllerType?: number;
  noteNumber?: number;
}

interface JsonMIDI {
  readonly header: {
    formatType: number;
    trackCount: number;
    ticksPerBeat: number;
  };
  readonly tracks: Array<Array<Track>>;
}

export class midiToJsonConverter {
  midiToJsonConverter(midiFile: string): string {
    var fs = require('fs');
    var midiConverter = require('midi-converter');
    var midiSong = fs.readFileSync(midiFile, 'binary');
    var jsonSong = midiConverter.midiToJson(midiSong);
    return jsonSong;
  }

  getTicksPerBeat(jsonSong: JsonMIDI) {
    if (jsonSong && jsonSong.header && jsonSong.header.ticksPerBeat) {
      return jsonSong.header.ticksPerBeat;
    } else {
      return Array();
    }
  }

  getTrackCount(jsonSong: JsonMIDI) {
    if (jsonSong && jsonSong.header && jsonSong.header.trackCount) {
      return jsonSong.header.trackCount;
    } else {
      return Array();
    }
  }

  getTracks(jsonSong: JsonMIDI): Array<Array<Track>> {
    if (jsonSong && jsonSong.tracks) {
      return jsonSong.tracks;
    } else {
      return Array();
    }
  }

  getInfoTrack(jsonSong: JsonMIDI): Array<Track> | undefined {
    var tracks = this.getTracks(jsonSong);
    if (tracks.length > 0) {
      return tracks[0];
    }
  }

  getMelodyTrack(jsonSong: JsonMIDI): Array<Track> | undefined {
    var tracks = this.getTracks(jsonSong);
    if (tracks.length > 1) {
      return tracks[1];
    }
  }

  getFirstTempo(jsonSong: JsonMIDI): number | undefined {
    var tracks = this.getTracks(jsonSong);
    var infoTrack = this.getInfoTrack(jsonSong);

    var tempoSegment = infoTrack
      ? infoTrack.find(entry => {
          if (entry.subtype) {
            entry.subtype.toLowerCase() === 'setTempo';
          }
        })
      : undefined;

    if (tempoSegment && tempoSegment.microsecondsPerBeat) {
      return tempoSegment.microsecondsPerBeat;
    }
  }

  getRawMidiTable(jsonSong: JsonMIDI) {
    var midiTable = Array(100);
    midiTable.map(entry => []);

    var melodyTrack = this.getMelodyTrack(jsonSong);
    if (melodyTrack) {
      melodyTrack.forEach(entry => {
        if (entry.subtype && entry.noteNumber) {
          if (
            entry.subtype.toLowerCase() === 'noteon' ||
            entry.subtype.toLowerCase() === 'noteoff'
          ) {
            let event = {
              event: entry.subtype,
              delta: entry.deltaTime,
            };
            midiTable[entry.noteNumber].push(event);
          }
        }
      });
    }

    return midiTable;
  }

  getIntervals(jsonSong: JsonMIDI) {
    let intervals: Array<{
      pitch: number;
      start: number;
      end: number;
    }> = [];
    let rawTable: Array<
      Array<{
        event: string;
        delta: number;
      }>
    > = this.getRawMidiTable(jsonSong);

    rawTable.forEach((entry, index) => {
      if (entry) {
        let noteIntervals = [];
        for (let i = 0; i < entry.length; i++) {
          if (entry[i].event.toLowerCase() === 'noteon') {
            let event = {
              pitch: index,
              start: entry[i].delta,
              end: -1,
            };
            noteIntervals.push(event);
          } else if (entry[i].event.toLowerCase() === 'noteoff' && i > 0) {
            let startTime: number =
              noteIntervals[noteIntervals.length - 1].start;
            let event = {
              pitch: index,
              start: startTime,
              end: entry[i].delta,
            };
            noteIntervals[noteIntervals.length - 1] = event;
          }
        }
        intervals = intervals.concat(noteIntervals);
      }
    });

    return intervals;
  }
}
