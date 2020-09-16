package com.reactnativenavigation.options;

import android.graphics.Typeface;
import android.view.MenuItem;

import com.reactnativenavigation.options.params.Bool;
import com.reactnativenavigation.options.params.Colour;
import com.reactnativenavigation.options.params.Fraction;
import com.reactnativenavigation.options.params.NullBool;
import com.reactnativenavigation.options.params.NullColor;
import com.reactnativenavigation.options.params.NullFraction;
import com.reactnativenavigation.options.params.NullNumber;
import com.reactnativenavigation.options.params.NullText;
import com.reactnativenavigation.options.params.Number;
import com.reactnativenavigation.options.params.Text;
import com.reactnativenavigation.options.parsers.BoolParser;
import com.reactnativenavigation.options.parsers.ColorParser;
import com.reactnativenavigation.options.parsers.FractionParser;
import com.reactnativenavigation.options.parsers.TextParser;
import com.reactnativenavigation.utils.CompatUtils;
import com.reactnativenavigation.utils.IdFactory;
import com.reactnativenavigation.options.parsers.TypefaceLoader;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Objects;

import androidx.annotation.Nullable;

import static com.reactnativenavigation.utils.ObjectUtils.take;

public class ButtonOptions {
    public String instanceId = "btn" + CompatUtils.generateViewId();

    public String id = "btn" + CompatUtils.generateViewId();
    public Text accessibilityLabel = new NullText();
    public Text text = new NullText();
    public Bool allCaps = new NullBool();
    public Bool enabled = new NullBool();
    public Bool disableIconTint = new NullBool();
    public Number showAsAction = new NullNumber();
    public Colour color = new NullColor();
    public Colour disabledColor = new NullColor();
    public Fraction fontSize = new NullFraction();
    private Text fontWeight = new NullText();
    @Nullable public Typeface fontFamily;
    public Text icon = new NullText();
    public Text testId = new NullText();
    public ComponentOptions component = new ComponentOptions();

    public boolean equals(ButtonOptions other) {
        return Objects.equals(id, other.id) &&
               accessibilityLabel.equals(other.accessibilityLabel) &&
               text.equals(other.text) &&
               allCaps.equals(other.allCaps) &&
               enabled.equals(other.enabled) &&
               disableIconTint.equals(other.disableIconTint) &&
               showAsAction.equals(other.showAsAction) &&
               color.equals(other.color) &&
               disabledColor.equals(other.disabledColor) &&
               fontSize.equals(other.fontSize) &&
               fontWeight.equals(other.fontWeight) &&
               Objects.equals(fontFamily, other.fontFamily) &&
               icon.equals(other.icon) &&
               testId.equals(other.testId) &&
               component.equals(other.component);
    }

    private static ButtonOptions parseJson(JSONObject json, TypefaceLoader typefaceManager) {
        ButtonOptions button = new ButtonOptions();
        button.id = take(json.optString("id"), "btn" + CompatUtils.generateViewId());
        button.accessibilityLabel = TextParser.parse(json, "accessibilityLabel");
        button.text = TextParser.parse(json, "text");
        button.allCaps = BoolParser.parse(json, "allCaps");
        button.enabled = BoolParser.parse(json, "enabled");
        button.disableIconTint = BoolParser.parse(json, "disableIconTint");
        button.showAsAction = parseShowAsAction(json);
        button.color = ColorParser.parse(json, "color");
        button.disabledColor = ColorParser.parse(json, "disabledColor");
        button.fontSize = FractionParser.parse(json, "fontSize");
        button.fontFamily = typefaceManager.getTypeFace(json.optString("fontFamily", ""));
        button.fontWeight = TextParser.parse(json, "fontWeight");
        button.testId = TextParser.parse(json, "testID");
        button.component = ComponentOptions.parse(json.optJSONObject("component"));

        if (json.has("icon")) {
            button.icon = TextParser.parse(json.optJSONObject("icon"), "uri");
        }

        return button;
    }

    public static ArrayList<ButtonOptions> parse(JSONObject json, String buttonsType, TypefaceLoader typefaceLoader) {
        ArrayList<ButtonOptions> buttons = new ArrayList<>();
        if (!json.has(buttonsType)) {
            return null;
        }

        JSONArray jsonArray = json.optJSONArray(buttonsType);
        if (jsonArray != null) {
            buttons.addAll(parseJsonArray(jsonArray, typefaceLoader));
        } else {
            buttons.add(parseJson(json.optJSONObject(buttonsType), typefaceLoader));
        }
        return buttons;
    }

    private static ArrayList<ButtonOptions> parseJsonArray(JSONArray jsonArray, TypefaceLoader typefaceLoader) {
        ArrayList<ButtonOptions> buttons = new ArrayList<>();
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject json = jsonArray.optJSONObject(i);
            ButtonOptions button = ButtonOptions.parseJson(json, typefaceLoader);
            buttons.add(button);
        }
        return buttons;
    }

    public ButtonOptions copy() {
        ButtonOptions button = new ButtonOptions();
        button.mergeWith(this);
        return button;
    }

    public boolean hasComponent() {
        return component.hasValue();
    }

    public boolean hasIcon() {
        return icon.hasValue();
    }

    public int getIntId() {
        return IdFactory.Companion.get(component.componentId.get(id));
    }

    private static Number parseShowAsAction(JSONObject json) {
        final Text showAsAction = TextParser.parse(json, "showAsAction");
        if (!showAsAction.hasValue()) {
            return new Number(MenuItem.SHOW_AS_ACTION_IF_ROOM);
        }

        switch (showAsAction.get()) {
            case "always":
                return new Number(MenuItem.SHOW_AS_ACTION_ALWAYS);
            case "never":
                return new Number(MenuItem.SHOW_AS_ACTION_NEVER);
            case "withText":
                return new Number(MenuItem.SHOW_AS_ACTION_WITH_TEXT);
            case "ifRoom":
            default:
                return new Number(MenuItem.SHOW_AS_ACTION_IF_ROOM);
        }
    }

    public void mergeWith(ButtonOptions other) {
        if (other.text.hasValue()) text = other.text;
        if (other.allCaps.hasValue()) allCaps = other.allCaps;
        if (other.accessibilityLabel.hasValue()) accessibilityLabel = other.accessibilityLabel;
        if (other.enabled.hasValue()) enabled = other.enabled;
        if (other.disableIconTint.hasValue()) disableIconTint = other.disableIconTint;
        if (other.color.hasValue()) color = other.color;
        if (other.disabledColor.hasValue()) disabledColor = other.disabledColor;
        if (other.fontSize.hasValue()) fontSize = other.fontSize;
        if (other.fontFamily != null) fontFamily = other.fontFamily;
        if (other.fontWeight.hasValue()) fontWeight = other.fontWeight;
        if (other.testId.hasValue()) testId = other.testId;
        if (other.component.hasValue()) component = other.component;
        if (other.showAsAction.hasValue()) showAsAction = other.showAsAction;
        if (other.icon.hasValue()) icon = other.icon;
        if (other.id != null) id = other.id;
        if (other.instanceId != null) instanceId = other.instanceId;
    }

    public void mergeWithDefault(ButtonOptions defaultOptions) {
        if (!text.hasValue()) text = defaultOptions.text;
        if (!allCaps.hasValue()) allCaps = defaultOptions.allCaps;
        if (!accessibilityLabel.hasValue()) accessibilityLabel = defaultOptions.accessibilityLabel;
        if (!enabled.hasValue()) enabled = defaultOptions.enabled;
        if (!disableIconTint.hasValue()) disableIconTint = defaultOptions.disableIconTint;
        if (!color.hasValue()) color = defaultOptions.color;
        if (!disabledColor.hasValue()) disabledColor = defaultOptions.disabledColor;
        if (!fontSize.hasValue()) fontSize = defaultOptions.fontSize;
        if (fontFamily == null) fontFamily = defaultOptions.fontFamily;
        if (!fontWeight.hasValue()) fontWeight = defaultOptions.fontWeight;
        if (!testId.hasValue()) testId = defaultOptions.testId;
        if (!component.hasValue()) component = defaultOptions.component;
        if (!showAsAction.hasValue()) showAsAction = defaultOptions.showAsAction;
        if (!icon.hasValue()) icon = defaultOptions.icon;
    }
}
