"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionsProcessor = void 0;
const tslib_1 = require("tslib");
const clone_1 = tslib_1.__importDefault(require("lodash/clone"));
const isEqual_1 = tslib_1.__importDefault(require("lodash/isEqual"));
const isObject_1 = tslib_1.__importDefault(require("lodash/isObject"));
const isArray_1 = tslib_1.__importDefault(require("lodash/isArray"));
const isString_1 = tslib_1.__importDefault(require("lodash/isString"));
const endsWith_1 = tslib_1.__importDefault(require("lodash/endsWith"));
const forEach_1 = tslib_1.__importDefault(require("lodash/forEach"));
class OptionsProcessor {
    constructor(store, uniqueIdProvider, optionProcessorsRegistry, colorService, assetService, deprecations) {
        this.store = store;
        this.uniqueIdProvider = uniqueIdProvider;
        this.optionProcessorsRegistry = optionProcessorsRegistry;
        this.colorService = colorService;
        this.assetService = assetService;
        this.deprecations = deprecations;
    }
    processOptions(options, commandName) {
        this.processObject(options, clone_1.default(options), (key, parentOptions) => {
            this.deprecations.onProcessOptions(key, parentOptions, commandName);
        }, commandName);
    }
    processDefaultOptions(options, commandName) {
        this.processObject(options, clone_1.default(options), (key, parentOptions) => {
            this.deprecations.onProcessDefaultOptions(key, parentOptions);
        }, commandName);
    }
    processObject(objectToProcess, parentOptions, onProcess, commandName, path) {
        forEach_1.default(objectToProcess, (value, key) => {
            this.processWithRegisteredProcessor(key, value, objectToProcess, this.resolveObjectPath(key, path), commandName);
            this.processColor(key, value, objectToProcess);
            if (!value) {
                return;
            }
            this.processComponent(key, value, objectToProcess);
            this.processImage(key, value, objectToProcess);
            this.processButtonsPassProps(key, value);
            onProcess(key, parentOptions);
            if (!isEqual_1.default(key, 'passProps') && (isObject_1.default(value) || isArray_1.default(value))) {
                path = this.resolveObjectPath(key, path);
                this.processObject(value, parentOptions, onProcess, commandName, path);
            }
        });
    }
    resolveObjectPath(key, path) {
        if (!path)
            path = key;
        else
            path += `.${key}`;
        return path;
    }
    processColor(key, value, options) {
        if (isEqual_1.default(key, 'color') || endsWith_1.default(key, 'Color')) {
            options[key] = value === null ? 'NoColor' : this.colorService.toNativeColor(value);
        }
    }
    processWithRegisteredProcessor(key, value, options, path, commandName) {
        const registeredProcessors = this.optionProcessorsRegistry.getProcessors(path);
        if (registeredProcessors) {
            registeredProcessors.forEach((processor) => {
                options[key] = processor(value, commandName);
            });
        }
    }
    processImage(key, value, options) {
        if (isEqual_1.default(key, 'icon') ||
            isEqual_1.default(key, 'image') ||
            endsWith_1.default(key, 'Icon') ||
            endsWith_1.default(key, 'Image')) {
            options[key] = isString_1.default(value) ? value : this.assetService.resolveFromRequire(value);
        }
    }
    processButtonsPassProps(key, value) {
        if (endsWith_1.default(key, 'Buttons')) {
            forEach_1.default(value, (button) => {
                if (button.passProps && button.id) {
                    this.store.updateProps(button.id, button.passProps);
                    button.passProps = undefined;
                }
            });
        }
    }
    processComponent(key, value, options) {
        if (isEqual_1.default(key, 'component')) {
            value.componentId = value.id ? value.id : this.uniqueIdProvider.generate('CustomComponent');
            this.store.ensureClassForName(value.name);
            if (value.passProps) {
                this.store.updateProps(value.componentId, value.passProps);
            }
            options[key].passProps = undefined;
        }
    }
}
exports.OptionsProcessor = OptionsProcessor;
