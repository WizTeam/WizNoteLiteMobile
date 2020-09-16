"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = void 0;
const tslib_1 = require("tslib");
const cloneDeep_1 = tslib_1.__importDefault(require("lodash/cloneDeep"));
const map_1 = tslib_1.__importDefault(require("lodash/map"));
const CommandName_1 = require("../interfaces/CommandName");
class Commands {
    constructor(store, nativeCommandsSender, layoutTreeParser, layoutTreeCrawler, commandsObserver, uniqueIdProvider, optionsProcessor, layoutProcessor) {
        this.store = store;
        this.nativeCommandsSender = nativeCommandsSender;
        this.layoutTreeParser = layoutTreeParser;
        this.layoutTreeCrawler = layoutTreeCrawler;
        this.commandsObserver = commandsObserver;
        this.uniqueIdProvider = uniqueIdProvider;
        this.optionsProcessor = optionsProcessor;
        this.layoutProcessor = layoutProcessor;
    }
    setRoot(simpleApi) {
        const input = cloneDeep_1.default(simpleApi);
        const processedRoot = this.layoutProcessor.process(input.root, CommandName_1.CommandName.SetRoot);
        const root = this.layoutTreeParser.parse(processedRoot);
        const modals = map_1.default(input.modals, (modal) => {
            const processedModal = this.layoutProcessor.process(modal, CommandName_1.CommandName.SetRoot);
            return this.layoutTreeParser.parse(processedModal);
        });
        const overlays = map_1.default(input.overlays, (overlay) => {
            const processedOverlay = this.layoutProcessor.process(overlay, CommandName_1.CommandName.SetRoot);
            return this.layoutTreeParser.parse(processedOverlay);
        });
        const commandId = this.uniqueIdProvider.generate(CommandName_1.CommandName.SetRoot);
        this.commandsObserver.notify(CommandName_1.CommandName.SetRoot, {
            commandId,
            layout: { root, modals, overlays },
        });
        this.layoutTreeCrawler.crawl(root, CommandName_1.CommandName.SetRoot);
        modals.forEach((modalLayout) => {
            this.layoutTreeCrawler.crawl(modalLayout, CommandName_1.CommandName.SetRoot);
        });
        overlays.forEach((overlayLayout) => {
            this.layoutTreeCrawler.crawl(overlayLayout, CommandName_1.CommandName.SetRoot);
        });
        const result = this.nativeCommandsSender.setRoot(commandId, { root, modals, overlays });
        return result;
    }
    setDefaultOptions(options) {
        const input = cloneDeep_1.default(options);
        this.optionsProcessor.processDefaultOptions(input, CommandName_1.CommandName.SetDefaultOptions);
        this.nativeCommandsSender.setDefaultOptions(input);
        this.commandsObserver.notify(CommandName_1.CommandName.SetDefaultOptions, { options });
    }
    mergeOptions(componentId, options) {
        const input = cloneDeep_1.default(options);
        this.optionsProcessor.processOptions(input, CommandName_1.CommandName.MergeOptions);
        this.nativeCommandsSender.mergeOptions(componentId, input);
        this.commandsObserver.notify(CommandName_1.CommandName.MergeOptions, { componentId, options });
    }
    updateProps(componentId, props) {
        this.store.updateProps(componentId, props);
        this.commandsObserver.notify(CommandName_1.CommandName.UpdateProps, { componentId, props });
    }
    showModal(layout) {
        const layoutCloned = cloneDeep_1.default(layout);
        const layoutProcessed = this.layoutProcessor.process(layoutCloned, CommandName_1.CommandName.ShowModal);
        const layoutNode = this.layoutTreeParser.parse(layoutProcessed);
        const commandId = this.uniqueIdProvider.generate(CommandName_1.CommandName.ShowModal);
        this.commandsObserver.notify(CommandName_1.CommandName.ShowModal, { commandId, layout: layoutNode });
        this.layoutTreeCrawler.crawl(layoutNode, CommandName_1.CommandName.ShowModal);
        const result = this.nativeCommandsSender.showModal(commandId, layoutNode);
        return result;
    }
    dismissModal(componentId, mergeOptions) {
        const commandId = this.uniqueIdProvider.generate(CommandName_1.CommandName.DismissModal);
        const result = this.nativeCommandsSender.dismissModal(commandId, componentId, mergeOptions);
        this.commandsObserver.notify(CommandName_1.CommandName.DismissModal, {
            commandId,
            componentId,
            mergeOptions,
        });
        return result;
    }
    dismissAllModals(mergeOptions) {
        const commandId = this.uniqueIdProvider.generate(CommandName_1.CommandName.DismissAllModals);
        const result = this.nativeCommandsSender.dismissAllModals(commandId, mergeOptions);
        this.commandsObserver.notify(CommandName_1.CommandName.DismissAllModals, { commandId, mergeOptions });
        return result;
    }
    push(componentId, simpleApi) {
        const input = cloneDeep_1.default(simpleApi);
        const layoutProcessed = this.layoutProcessor.process(input, CommandName_1.CommandName.Push);
        const layout = this.layoutTreeParser.parse(layoutProcessed);
        const commandId = this.uniqueIdProvider.generate(CommandName_1.CommandName.Push);
        this.commandsObserver.notify(CommandName_1.CommandName.Push, { commandId, componentId, layout });
        this.layoutTreeCrawler.crawl(layout, CommandName_1.CommandName.Push);
        const result = this.nativeCommandsSender.push(commandId, componentId, layout);
        return result;
    }
    pop(componentId, mergeOptions) {
        const commandId = this.uniqueIdProvider.generate(CommandName_1.CommandName.Pop);
        const result = this.nativeCommandsSender.pop(commandId, componentId, mergeOptions);
        this.commandsObserver.notify(CommandName_1.CommandName.Pop, { commandId, componentId, mergeOptions });
        return result;
    }
    popTo(componentId, mergeOptions) {
        const commandId = this.uniqueIdProvider.generate(CommandName_1.CommandName.PopTo);
        const result = this.nativeCommandsSender.popTo(commandId, componentId, mergeOptions);
        this.commandsObserver.notify(CommandName_1.CommandName.PopTo, { commandId, componentId, mergeOptions });
        return result;
    }
    popToRoot(componentId, mergeOptions) {
        const commandId = this.uniqueIdProvider.generate(CommandName_1.CommandName.PopToRoot);
        const result = this.nativeCommandsSender.popToRoot(commandId, componentId, mergeOptions);
        this.commandsObserver.notify(CommandName_1.CommandName.PopToRoot, { commandId, componentId, mergeOptions });
        return result;
    }
    setStackRoot(componentId, children) {
        const input = map_1.default(cloneDeep_1.default(children), (simpleApi) => {
            const layoutProcessed = this.layoutProcessor.process(simpleApi, CommandName_1.CommandName.SetStackRoot);
            const layout = this.layoutTreeParser.parse(layoutProcessed);
            return layout;
        });
        const commandId = this.uniqueIdProvider.generate(CommandName_1.CommandName.SetStackRoot);
        this.commandsObserver.notify(CommandName_1.CommandName.SetStackRoot, {
            commandId,
            componentId,
            layout: input,
        });
        input.forEach((layoutNode) => {
            this.layoutTreeCrawler.crawl(layoutNode, CommandName_1.CommandName.SetStackRoot);
        });
        const result = this.nativeCommandsSender.setStackRoot(commandId, componentId, input);
        return result;
    }
    showOverlay(simpleApi) {
        const input = cloneDeep_1.default(simpleApi);
        const layoutProcessed = this.layoutProcessor.process(input, CommandName_1.CommandName.ShowOverlay);
        const layout = this.layoutTreeParser.parse(layoutProcessed);
        const commandId = this.uniqueIdProvider.generate(CommandName_1.CommandName.ShowOverlay);
        this.commandsObserver.notify(CommandName_1.CommandName.ShowOverlay, { commandId, layout });
        this.layoutTreeCrawler.crawl(layout, CommandName_1.CommandName.ShowOverlay);
        const result = this.nativeCommandsSender.showOverlay(commandId, layout);
        return result;
    }
    dismissOverlay(componentId) {
        const commandId = this.uniqueIdProvider.generate(CommandName_1.CommandName.DismissOverlay);
        const result = this.nativeCommandsSender.dismissOverlay(commandId, componentId);
        this.commandsObserver.notify(CommandName_1.CommandName.DismissOverlay, { commandId, componentId });
        return result;
    }
    getLaunchArgs() {
        const commandId = this.uniqueIdProvider.generate(CommandName_1.CommandName.GetLaunchArgs);
        const result = this.nativeCommandsSender.getLaunchArgs(commandId);
        this.commandsObserver.notify(CommandName_1.CommandName.GetLaunchArgs, { commandId });
        return result;
    }
}
exports.Commands = Commands;
