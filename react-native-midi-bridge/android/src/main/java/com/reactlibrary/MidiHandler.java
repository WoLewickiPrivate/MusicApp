package com.example.midi;

import android.app.Activity;
import android.media.midi.MidiReceiver;
import android.widget.TextView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.billthefarmer.mididriver.MidiDriver;
import java.io.IOException;
import java.util.Arrays;

public class MIDIHandler extends MidiReceiver implements Runnable {

    ReactApplicationContext reactApplicationContext;

    MIDIHandler(ReactApplicationContext reactApplicationContext){
        this.reactApplicationContext = reactApplicationContext;
    }

    private MidiDriver midiDriver = new MidiDriver();
    private byte[] event;

    protected void startDriver(){
        midiDriver.start();
    }


    @Override
    public void onSend(byte[] msg, int offset, int count, long timestamp) throws IOException {
        midiDriver.write(msg); // This is a method call that makes the sound being played

        WritableMap params = Arguments.createMap();
        params.putInt("type", msg[0]);
        params.putInt("note", msg[1]);
        sendEvent("KeyEvent", params);
        
    }

}