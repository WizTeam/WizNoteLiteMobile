"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deprecations = void 0;
const tslib_1 = require("tslib");
const once_1 = tslib_1.__importDefault(require("lodash/once"));
const react_native_1 = require("react-native");
class Deprecations {
    constructor() {
        this.deprecateBottomTabsVisibility = once_1.default((parentOptions) => {
            console.warn(`toggling bottomTabs visibility is deprecated on iOS. For more information see https://github.com/wix/react-native-navigation/issues/6416`, parentOptions);
        });
    }
    onProcessOptions(key, parentOptions, commandName) {
        if (key === 'bottomTabs' &&
            parentOptions[key].visible !== undefined &&
            react_native_1.Platform.OS === 'ios' &&
            commandName === 'mergeOptions') {
            this.deprecateBottomTabsVisibility(parentOptions);
        }
    }
    onProcessDefaultOptions(_key, _parentOptions) { }
}
exports.Deprecations = Deprecations;
