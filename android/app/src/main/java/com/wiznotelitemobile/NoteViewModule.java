package com.wiznotelitemobile;

import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


import java.util.Map;

public class NoteViewModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;
    public NoteViewModule(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "NoteViewModule";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        return super.getConstants();
    }

    @ReactMethod
    public void willLoadNote(String options) {
        new Handler(Looper.getMainLooper()).post(() -> NoteView.getInstance(reactContext.getCurrentActivity()).updateProps(options));
    }
}
