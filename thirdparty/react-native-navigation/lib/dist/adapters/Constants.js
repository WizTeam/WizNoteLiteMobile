"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
const react_native_1 = require("react-native");
class Constants {
    constructor(constants) {
        this.statusBarHeight = constants.statusBarHeight;
        this.topBarHeight = constants.topBarHeight;
        this.backButtonId = constants.backButtonId;
        this.bottomTabsHeight = constants.bottomTabsHeight;
    }
    static async get() {
        const constants = await react_native_1.NativeModules.RNNBridgeModule.getNavigationConstants();
        return new Constants(constants);
    }
}
exports.Constants = Constants;
