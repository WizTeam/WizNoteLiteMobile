package com.reactnativenavigation.viewcontrollers.viewcontroller;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.modules.i18nmanager.I18nUtil;
import com.reactnativenavigation.options.Options;

public class LayoutDirectionApplier {
    public void apply(ViewController root, Options options, ReactInstanceManager instanceManager) {
        if (options.layout.direction.hasValue() && instanceManager.getCurrentReactContext() != null) {
            root.getActivity().getWindow().getDecorView().setLayoutDirection(options.layout.direction.get());
            I18nUtil.getInstance().allowRTL(instanceManager.getCurrentReactContext(), options.layout.direction.isRtl());
            I18nUtil.getInstance().forceRTL(instanceManager.getCurrentReactContext(), options.layout.direction.isRtl());
        }
    }
}
