package com.reactnativenavigation.options.parsers;


import com.reactnativenavigation.options.params.Interpolation;

import org.json.JSONObject;

public class InterpolationParser {
    public static Interpolation parse(JSONObject json, String interpolation) {
        switch (json.optString(interpolation, "default")) {
            case "decelerate":
                return Interpolation.DECELERATE;
            case "accelerateDecelerate":
                return Interpolation.ACCELERATE_DECELERATE;
            case "accelerate":
                return Interpolation.ACCELERATE;
            default:
                return Interpolation.DEFAULT;
        }
    }
}
