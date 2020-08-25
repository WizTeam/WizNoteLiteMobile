package com.wiznotelitemobile;

import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.webkit.WebView;

import androidx.fragment.app.FragmentActivity;

import com.reactnativenavigation.viewcontrollers.externalcomponent.ExternalComponent;

import org.json.JSONObject;

public class NoteViewComponent implements ExternalComponent {
    private WebView content;
    NoteViewComponent(FragmentActivity activity, JSONObject props) {
        content = NoteView.getInstance(activity);
        ViewParent parent = content.getParent();
        if (parent == null) return;
        ((ViewGroup) parent).removeView(content);
    }

    @Override
    public View asView() {
        return content;
    }
}
