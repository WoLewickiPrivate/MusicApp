package com.reactlibrary;
import android.media.midi.MidiDeviceInfo;
import android.media.midi.MidiManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.media.midi.MidiDevice;
import android.media.midi.MidiOutputPort;
import android.os.Bundle;
import android.media.midi.MidiDeviceInfo;
import android.media.midi.MidiManager;

public class MidiBridgeModule extends ReactContextBaseJavaModule {

    private Thread thread;
    private final ReactApplicationContext reactContext;

    MIDIHandler midiHandler = new MidiHandler(this); // USB midi device handler

    public MidiBridgeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        midiHandler.startDriver(); // This is starting the driver which plays the sound
    }

    @Override
    public String getName() {
        return "MidiBridge";
    }

    @ReactMethod
    public void connectMidiDevice(){
        final MidiManager m = (MidiManager)this.getSystemService(Context.MIDI_SERVICE);

        m.registerDeviceCallback(new MidiManager.DeviceCallback() {
            @Override
            public void onDeviceAdded( MidiDeviceInfo info ) {
                m.openDevice(info, new MidiManager.OnDeviceOpenedListener() {
                    @Override
                    public void onDeviceOpened(MidiDevice device) {
                        if (device != null) {
                            MidiOutputPort outputPort = device.openOutputPort(0);
                            outputPort.connect(midiHandler);
                        }
                    }
                }, null);
            }
        }, null);
    }

}
