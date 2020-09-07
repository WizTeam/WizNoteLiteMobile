package com.wiznotelitemobile;

import java.util.HashSet;
import java.util.Set;

public class WizEvents {
    interface WebViewLoadListener {
        void onLoad();
    }

    private static Set<WebViewLoadListener> listeners = new HashSet<>();
    public static void addWebViewListener(WebViewLoadListener listener) {
        listeners.add(listener);
    }
    public static void removeWebViewListener(WebViewLoadListener listener) {
        listeners.remove(listener);
    }
    public static void onLoad() {
        for (WebViewLoadListener listener : listeners) {
            listener.onLoad();
        }
    }
}
