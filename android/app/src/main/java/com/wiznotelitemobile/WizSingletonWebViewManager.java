package com.wiznotelitemobile;

import android.view.ViewGroup;
import android.view.ViewParent;
import android.webkit.WebView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.HashMap;
import java.util.Map;

public class WizSingletonWebViewManager extends SimpleViewManager<WebView>
        implements WizEvents.WebViewLoadListener {
    @NonNull
    @Override
    public String getName() {
        return "WizSingletonWebView";
    }

    private ReactContext reactContext;
    private WebView webView;
    @NonNull
    @Override
    protected WebView createViewInstance(@NonNull ThemedReactContext reactContext) {
        this.reactContext = reactContext;
        webView = WizWebView.getInstance(reactContext);
        ViewParent parent = webView.getParent();
        if (parent != null) {
            ((ViewGroup) parent).removeView(webView);
        }
        WizEvents.addWebViewListener(this);
        return webView;
    }

    private static final String EVENT_SCROLL = "onScroll";
    private static final String EVENT_MESSAGE = "onMessage";
    private static final String EVENT_KEYBOARD_SHOW = "onKeyboardShow";
    private static final String EVENT_KEYBOARD_HIDE = "onKeyboardHide";

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        Map<String, Object> map = new HashMap<>();
        map.put(EVENT_SCROLL, MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", EVENT_SCROLL)));
        map.put(EVENT_MESSAGE, MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", EVENT_MESSAGE)));
        map.put(EVENT_KEYBOARD_SHOW, MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", EVENT_KEYBOARD_SHOW)));
        map.put(EVENT_KEYBOARD_HIDE, MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", EVENT_KEYBOARD_HIDE)));
        return map;
    }

    @Override
    public void updateExtraData(WebView root, Object extraData) {
        super.updateExtraData(root, extraData);
    }

    @Override
    public void onLoad() {

    }

    @Override
    public void onMessage(String message) {
        WritableMap data = new WritableNativeMap();
        data.putString("body", message);
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(webView.getId(), EVENT_MESSAGE, data);
    }

    @Override
    public void onScroll() {
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(webView.getId(), EVENT_SCROLL, null);
    }

    @Override
    public void onKeyboardShow(int keyboardWidth, int keyboardHeight) {
        WritableMap data = new WritableNativeMap();
        data.putInt("keyboardWidth", keyboardWidth);
        data.putInt("keyboardHeight", keyboardHeight);
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(webView.getId(), EVENT_KEYBOARD_SHOW, data);
    }

    @Override
    public void onKeyboardHide() {
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(webView.getId(), EVENT_KEYBOARD_HIDE, null);
    }
}
