export class midiToJsonConverter {
  midiToJsonConverter(midiFile: string): string {
    var fs = require('fs');
    var midiConverter = require('midi-converter');
    var midiSong = fs.readFileSync(midiFile, 'binary');
    var jsonSong = midiConverter.midiToJson(midiSong);
    return jsonSong;
  }
}
