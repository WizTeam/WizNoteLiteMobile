"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationComponent = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
class NavigationComponent extends react_1.default.Component {
    componentDidAppear(_event) { }
    componentDidDisappear(_event) { }
    navigationButtonPressed(_event) { }
    modalDismissed(_event) { }
    modalAttemptedToDismiss(_event) { }
    searchBarUpdated(_event) { }
    searchBarCancelPressed(_event) { }
    previewCompleted(_event) { }
    screenPopped(_event) { }
}
exports.NavigationComponent = NavigationComponent;
