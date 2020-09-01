package com.reactnativenavigation.viewcontrollers.bottomtabs.attacher.modes;

import androidx.annotation.VisibleForTesting;
import android.view.View;
import android.view.ViewGroup;

import com.reactnativenavigation.options.Options;
import com.reactnativenavigation.viewcontrollers.bottomtabs.BottomTabsPresenter;
import com.reactnativenavigation.viewcontrollers.viewcontroller.ViewController;
import com.reactnativenavigation.views.bottomtabs.BottomTabsBehaviour;

import java.util.List;

import static com.reactnativenavigation.utils.CoordinatorLayoutUtils.matchParentWithBehaviour;

public abstract class AttachMode {
    protected final ViewGroup parent;
    protected final BottomTabsPresenter presenter;
    protected final List<ViewController> tabs;
    final ViewController initialTab;

    public static AttachMode get(ViewGroup parent, List<ViewController> tabs, BottomTabsPresenter presenter, Options resolved) {
        switch (resolved.bottomTabsOptions.tabsAttachMode) {
            case AFTER_INITIAL_TAB:
                return new AfterInitialTab(parent, tabs, presenter, resolved);
            case ON_SWITCH_TO_TAB:
                return new OnSwitchToTab(parent, tabs, presenter, resolved);
            case UNDEFINED:
            case TOGETHER:
            default:
                return new Together(parent, tabs, presenter, resolved);
        }
    }

    AttachMode(ViewGroup parent, List<ViewController> tabs, BottomTabsPresenter presenter, Options resolved) {
        this.parent = parent;
        this.tabs = tabs;
        this.presenter = presenter;
        initialTab = tabs.get(resolved.bottomTabsOptions.currentTabIndex.get(0));
    }

    public abstract void attach();

    public void destroy() {

    }

    public void onTabSelected(ViewController tab) {

    }

    @VisibleForTesting(otherwise = VisibleForTesting.PROTECTED)
    public void attach(ViewController tab) {
        ViewGroup view = tab.getView();
        view.setVisibility(tab == initialTab ? View.VISIBLE : View.INVISIBLE);
        parent.addView(view, matchParentWithBehaviour(new BottomTabsBehaviour(tab.getParentController())));
    }
}
