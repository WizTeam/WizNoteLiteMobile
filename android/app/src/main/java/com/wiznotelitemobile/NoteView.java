package com.wiznotelitemobile;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.os.Handler;
import android.os.Looper;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;


public class NoteView extends WebView {
    private static NoteView instance = null;
    //
    public static NoteView getInstance(Activity activity) {
        if (instance == null) {
            synchronized (NoteView.class) {
                if (instance == null) {
                    instance = new NoteView(activity);
                }
            }
        }
        return instance;
    }

    private boolean loadFinished = false;
    public NoteView(Context context) {
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
                loadFinished = true;
            }
        });
        loadUrl("http://10.0.2.2:3000");
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

    public void updateProps(String props) {
        if (!loadFinished) {
            new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                @Override
                public void run() {
                    updateProps(props);
                }
            }, 200);
        } else {
            loadNote(props);
        }

    }

    private void loadNote(String props) {
        String js = String.format("window.loadMarkdown(%s)", props);
        evaluateJavascript(js, null);
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
