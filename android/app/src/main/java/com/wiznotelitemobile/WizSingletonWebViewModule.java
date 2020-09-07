package com.wiznotelitemobile;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class WizSingletonWebViewModule extends ReactContextBaseJavaModule implements
        WizEvents.WebViewLoadListener {

    public WizSingletonWebViewModule(ReactApplicationContext reactContext) {
        super(reactContext);
        WizEvents.addWebViewListener(this);
    }

    @NonNull
    @Override
    public String getName() {
        return "WizSingletonWebViewModule";
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void injectJavaScript(String js) {
        runOnMain("javascript: " + js);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void loadRequest(String url) {
        runOnMain(url);
    }

    private void runOnMain(String url) {
        new Handler(Looper.getMainLooper())
                .post(() -> WizWebView.getInstance(getReactApplicationContext()).loadUrl(url));
    }

    @Override
    public void onLoad() {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onLoad", null);
    }
}
