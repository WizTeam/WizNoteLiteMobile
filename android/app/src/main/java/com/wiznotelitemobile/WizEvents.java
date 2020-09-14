package com.wiznotelitemobile;

import java.util.HashSet;
import java.util.Set;

public class WizEvents {
    interface WebViewLoadListener {
        void onLoad();
        void onMessage(String message);
        void onScroll();
        void onKeyboardShow();
        void onKeyboardHide();
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
    public static void onMessage(String message) {
        for (WebViewLoadListener listener: listeners) {
            listener.onMessage(message);
        }
    }
    public static void onScroll() {
        for (WebViewLoadListener listener: listeners) {
            listener.onScroll();
        }
    }
    public static void onKeyboardShow() {
        for (WebViewLoadListener listener: listeners) {
            listener.onKeyboardShow();
        }
    }
    public static void onKeyboardHide() {
        for (WebViewLoadListener listener: listeners) {
            listener.onKeyboardHide();
        }
    }
}
