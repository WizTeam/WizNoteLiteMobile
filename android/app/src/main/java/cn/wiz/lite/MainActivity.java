package cn.wiz.lite;

import android.app.Activity;
import android.graphics.Rect;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewTreeObserver;

import androidx.annotation.Nullable;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.reactnativenavigation.NavigationActivity;
import com.reactnativenavigation.utils.DeviceScreen;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends NavigationActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        KeyboardStateObserver.getKeyboardStateObserver(this)
                .setKeyboardVisibilityListener(new KeyboardStateObserver.OnKeyboardVisibilityListener() {
                    @Override
                    public void onKeyboardShow(int keyboardWidth, int keyboardHeight) {
                        WizEvents.onKeyboardShow(keyboardWidth, keyboardHeight);
                    }

                    @Override
                    public void onKeyboardHide() {
                        WizEvents.onKeyboardHide();
                    }
                });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }

    public static class KeyboardStateObserver {

        private static final String TAG = KeyboardStateObserver.class.getSimpleName();

        public static KeyboardStateObserver getKeyboardStateObserver(Activity activity) {
            return new KeyboardStateObserver(activity);
        }

        private View mChildOfContent;
        private int usableHeightPrevious;
        private OnKeyboardVisibilityListener listener;

        public void setKeyboardVisibilityListener(OnKeyboardVisibilityListener listener) {
            this.listener = listener;
        }

        private Activity activity;
        private KeyboardStateObserver(Activity activity) {
//            FrameLayout content = (FrameLayout) activity.findViewById(android.R.id.content);
            this.activity = activity;
            mChildOfContent = WizWebView.getInstance(activity);
            mChildOfContent.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
                public void onGlobalLayout() {
                    possiblyResizeChildOfContent();
                }
            });
        }

        private void possiblyResizeChildOfContent() {
            int usableHeightNow = computeUsableHeight();
            if (usableHeightNow != usableHeightPrevious) {
                int usableHeightSansKeyboard = mChildOfContent.getRootView().getHeight();
                int heightDifference = usableHeightSansKeyboard - usableHeightNow;
                if (heightDifference > (usableHeightSansKeyboard / 4)) {
                    if (listener != null) {
                        listener.onKeyboardShow(DeviceScreen.width(activity.getResources()), heightDifference);
                    }
                } else {
                    if (listener != null) {
                        listener.onKeyboardHide();
                    }
                }
                usableHeightPrevious = usableHeightNow;
                Log.d(TAG,"usableHeightNow: " + usableHeightNow + " | usableHeightSansKeyboard:" + usableHeightSansKeyboard + " | heightDifference:" + heightDifference);
            }
        }

        private int computeUsableHeight() {
            Rect r = new Rect();
            mChildOfContent.getWindowVisibleDisplayFrame(r);

            Log.d(TAG,"rec bottom>" + r.bottom + " | rec top>" + r.top);
            return (r.bottom - r.top);// 全屏模式下： return r.bottom
        }

        public interface OnKeyboardVisibilityListener {
            void onKeyboardShow(int keyboardWidth, int keyboardHeight);

            void onKeyboardHide();
        }
    }
}
