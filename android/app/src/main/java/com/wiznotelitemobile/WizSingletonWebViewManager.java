package com.wiznotelitemobile;

import android.view.ViewGroup;
import android.view.ViewParent;
import android.webkit.WebView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.uimanager.ReactStylesDiffMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.StateWrapper;
import com.facebook.react.uimanager.ThemedReactContext;

public class WizSingletonWebViewManager extends SimpleViewManager<WebView> {
    @NonNull
    @Override
    public String getName() {
        return "WizSingletonWebView";
    }

    @NonNull
    @Override
    protected WebView createViewInstance(@NonNull ThemedReactContext reactContext) {
        WebView webView = WizWebView.getInstance(reactContext);
        ViewParent parent = webView.getParent();
        if (parent != null) {
            ((ViewGroup) parent).removeView(webView);
        }
        return webView;
    }

    @NonNull
    @Override
    protected WebView createViewInstance(@NonNull ThemedReactContext reactContext,
            @Nullable ReactStylesDiffMap initialProps, @Nullable StateWrapper stateWrapper) {
        return super.createViewInstance(reactContext, initialProps, stateWrapper);
    }

    @Override
    public void updateExtraData(WebView root, Object extraData) {
        super.updateExtraData(root, extraData);
    }
}
