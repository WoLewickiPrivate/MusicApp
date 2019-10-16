package com.example.midi;

import android.app.Activity;
import android.media.midi.MidiReceiver;
import android.widget.TextView;

import org.billthefarmer.mididriver.MidiDriver;
import java.io.IOException;
import java.util.Arrays;

public class MIDIHandler extends MidiReceiver {

    private Activity a;
    private byte[] midiEvent;

    MIDIHandler(Activity a){
        this.a = a;
    }

    private MidiDriver midiDriver = new MidiDriver();
    private byte[] event;

    protected void startDriver(){
        midiDriver.start();
    }


    @Override
    public void onSend(byte[] msg, int offset, int count, long timestamp) throws IOException {
        TextView infoText = a.findViewById(R.id.midiInfo);
        infoText.setText(Arrays.toString(msg));
        midiDriver.write(msg); // This is a method call that makes the sound being played
    }

    public byte[] midiCalback(byte[] msg){
        midiEvent[0] = msg[0]; // 0x90 = note On
        midiEvent[1] = msg[1]; // note pitch

        return midiEvent;
    }

}