package com.wiznotelitemobile;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.reactnativenavigation.NavigationActivity;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends NavigationActivity {

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}
