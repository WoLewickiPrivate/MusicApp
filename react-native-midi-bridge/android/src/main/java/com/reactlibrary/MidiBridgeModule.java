package com.reactlibrary;
import android.media.midi.MidiDeviceInfo;
import android.media.midi.MidiManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class MidiBridgeModule extends ReactContextBaseJavaModule {

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
    public void sampleMethod(String stringArgument, int numberArgument, Callback callback) {
        // TODO: Implement some actually useful functionality
        callback.invoke();
    }
}
