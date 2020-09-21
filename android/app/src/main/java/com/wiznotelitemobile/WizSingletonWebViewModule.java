package com.wiznotelitemobile;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.inputmethod.InputMethodManager;

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

    @SuppressWarnings("unused")
    @ReactMethod
    public void endEditing(boolean end) {
        if (end) hideSoftKeyboard(getCurrentActivity());
    }

    public static void hideSoftKeyboard(Activity activity) {
        if (activity == null) return;
        View view = activity.getCurrentFocus();
        if (view != null) {
            InputMethodManager inputMethodManager = (InputMethodManager) activity.getSystemService(Activity.INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), InputMethodManager.HIDE_NOT_ALWAYS);
        }
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

    @Override
    public void onMessage(String message) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onMessage", message);
    }

    @Override
    public void onScroll() {

    }

    @Override
    public void onKeyboardShow(int keyboardWidth, int keyboardHeight) {

    }

    @Override
    public void onKeyboardHide() {

    }
}
