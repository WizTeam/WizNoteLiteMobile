package com.wiznotelitemobile;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;


public class WizWebView extends WebView {
    private static WizWebView instance = null;
    //
    public static WizWebView getInstance(Context activity) {
        if (instance == null) {
            synchronized (WizWebView.class) {
                if (instance == null) {
                    instance = new WizWebView(activity);
                }
            }
        }
        return instance;
    }

    public WizWebView(Context context) {
        super(context);
        initSettings();
        init();
    }

    private void init() {
        setWebViewClient(new WebViewClient() {

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                WizEvents.onLoad();
            }
        });
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void initSettings() {
        setOverScrollMode(OVER_SCROLL_NEVER);
        WebSettings webSettings = getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setDomStorageEnabled(true);

        webSettings.setAllowFileAccessFromFileURLs(false);
        webSettings.setAllowUniversalAccessFromFileURLs(false);
        webSettings.setSupportZoom(false);
        webSettings.setBuiltInZoomControls(false);
        webSettings.setDisplayZoomControls(false);
        webSettings.setAppCacheEnabled(false);
        webSettings.setGeolocationEnabled(false);
        webSettings.setAllowContentAccess(false);
        webSettings.setSavePassword(false);
    }

    @Override
    public void onResume() {
        super.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
    }
}
