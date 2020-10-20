package cn.wiz.lite;

import com.facebook.react.bridge.WritableMap;

import java.util.HashSet;
import java.util.Set;

public class WizEvents {
    interface WebViewLoadListener {
        void onLoad();
        void onMessage(String message);
        void onScroll(WritableMap event);
        void onBeginScroll(WritableMap event);
        void onKeyboardShow(int keyboardWidth, int keyboardHeight);
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
    public static void onScroll(WritableMap event) {
        for (WebViewLoadListener listener: listeners) {
            listener.onScroll(event);
        }
    }
    public static void onBeginScroll(WritableMap event) {
        for (WebViewLoadListener listener : listeners) {
            listener.onBeginScroll(event);
        }
    }
    public static void onKeyboardShow(int keyboardWidth, int keyboardHeight) {
        for (WebViewLoadListener listener: listeners) {
            listener.onKeyboardShow(keyboardWidth, keyboardHeight);
        }
    }
    public static void onKeyboardHide() {
        for (WebViewLoadListener listener: listeners) {
            listener.onKeyboardHide();
        }
    }
}
