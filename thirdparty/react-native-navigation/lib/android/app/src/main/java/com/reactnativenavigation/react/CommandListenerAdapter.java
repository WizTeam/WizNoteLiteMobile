package com.reactnativenavigation.react;

import com.reactnativenavigation.react.CommandListener;

import androidx.annotation.Nullable;

public class CommandListenerAdapter implements CommandListener {

    @Nullable private CommandListener listener;

    @Nullable
    public CommandListener getListener() {
        return listener;
    }

    public CommandListenerAdapter() {
    }

    public CommandListenerAdapter(@Nullable CommandListener listener) {
        this.listener = listener;
    }

    @Override
    public void onSuccess(String childId) {
        if (listener != null) listener.onSuccess(childId);
    }

    @Override
    public void onError(String message) {
        if (listener != null) listener.onError(message);
    }
}
