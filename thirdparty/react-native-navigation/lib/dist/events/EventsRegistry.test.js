"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventsRegistry_1 = require("./EventsRegistry");
const NativeEventsReceiver_mock_1 = require("../adapters/NativeEventsReceiver.mock");
const CommandsObserver_1 = require("./CommandsObserver");
const UniqueIdProvider_1 = require("../adapters/UniqueIdProvider");
describe('EventsRegistry', () => {
    let uut;
    const mockNativeEventsReceiver = new NativeEventsReceiver_mock_1.NativeEventsReceiver();
    let commandsObserver;
    const mockScreenEventsRegistry = {};
    beforeEach(() => {
        commandsObserver = new CommandsObserver_1.CommandsObserver(new UniqueIdProvider_1.UniqueIdProvider());
        uut = new EventsRegistry_1.EventsRegistry(mockNativeEventsReceiver, commandsObserver, mockScreenEventsRegistry);
    });
    it('exposes appLaunched event', () => {
        const subscription = {};
        const cb = jest.fn();
        mockNativeEventsReceiver.registerAppLaunchedListener.mockReturnValueOnce(subscription);
        const result = uut.registerAppLaunchedListener(cb);
        expect(result).toBe(subscription);
        expect(mockNativeEventsReceiver.registerAppLaunchedListener).toHaveBeenCalledTimes(1);
        expect(mockNativeEventsReceiver.registerAppLaunchedListener).toHaveBeenCalledWith(cb);
    });
    it('delegates didAppear to nativeEventsReceiver', () => {
        const cb = jest.fn();
        uut.registerComponentDidAppearListener(cb);
        expect(mockNativeEventsReceiver.registerComponentDidAppearListener).toHaveBeenCalledTimes(1);
        expect(mockNativeEventsReceiver.registerComponentDidAppearListener).toHaveBeenCalledWith(cb);
    });
    it('delegates didDisappear to nativeEventsReceiver', () => {
        const cb = jest.fn();
        uut.registerComponentDidDisappearListener(cb);
        expect(mockNativeEventsReceiver.registerComponentDidDisappearListener).toHaveBeenCalledTimes(1);
        expect(mockNativeEventsReceiver.registerComponentDidDisappearListener).toHaveBeenCalledWith(cb);
    });
    it('delegates commandCompleted to nativeEventsReceiver', () => {
        const cb = jest.fn();
        uut.registerCommandCompletedListener(cb);
        expect(mockNativeEventsReceiver.registerCommandCompletedListener).toHaveBeenCalledTimes(1);
        expect(mockNativeEventsReceiver.registerCommandCompletedListener).toHaveBeenCalledWith(cb);
    });
    it('delegates BottomTabsSelected to nativeEventsReceiver', () => {
        const cb = jest.fn();
        uut.registerBottomTabSelectedListener(cb);
        expect(mockNativeEventsReceiver.registerBottomTabSelectedListener).toHaveBeenCalledTimes(1);
        expect(mockNativeEventsReceiver.registerBottomTabSelectedListener).toHaveBeenCalledWith(cb);
    });
    it('delegates navigationButtonPressed to nativeEventsReceiver', () => {
        const cb = jest.fn();
        uut.registerNavigationButtonPressedListener(cb);
        expect(mockNativeEventsReceiver.registerNavigationButtonPressedListener).toHaveBeenCalledTimes(1);
        expect(mockNativeEventsReceiver.registerNavigationButtonPressedListener).toHaveBeenCalledWith(cb);
    });
    it('delegates modalDismissed to nativeEventsReceiver', () => {
        const cb = jest.fn();
        uut.registerModalDismissedListener(cb);
        expect(mockNativeEventsReceiver.registerModalDismissedListener).toHaveBeenCalledTimes(1);
        expect(mockNativeEventsReceiver.registerModalDismissedListener).toHaveBeenCalledWith(cb);
    });
    it('delegates modalAttemptedToDimiss to nativeEventsReceiver', () => {
        const cb = jest.fn();
        uut.registerModalAttemptedToDismissListener(cb);
        expect(mockNativeEventsReceiver.registerModalAttemptedToDismissListener).toHaveBeenCalledTimes(1);
        expect(mockNativeEventsReceiver.registerModalAttemptedToDismissListener).toHaveBeenCalledWith(cb);
    });
    it('delegates searchBarUpdated to nativeEventsReceiver', () => {
        const cb = jest.fn();
        uut.registerSearchBarUpdatedListener(cb);
        expect(mockNativeEventsReceiver.registerSearchBarUpdatedListener).toHaveBeenCalledTimes(1);
        expect(mockNativeEventsReceiver.registerSearchBarUpdatedListener).toHaveBeenCalledWith(cb);
    });
    it('delegates searchBarCancelPressed to nativeEventsReceiver', () => {
        const cb = jest.fn();
        uut.registerSearchBarCancelPressedListener(cb);
        expect(mockNativeEventsReceiver.registerSearchBarCancelPressedListener).toHaveBeenCalledTimes(1);
        expect(mockNativeEventsReceiver.registerSearchBarCancelPressedListener).toHaveBeenCalledWith(cb);
    });
    it('delegates previewCompleted to nativeEventsReceiver', () => {
        const cb = jest.fn();
        uut.registerPreviewCompletedListener(cb);
        expect(mockNativeEventsReceiver.registerPreviewCompletedListener).toHaveBeenCalledTimes(1);
        expect(mockNativeEventsReceiver.registerPreviewCompletedListener).toHaveBeenCalledWith(cb);
    });
    it('delegates registerCommandListener to commandObserver', () => {
        const cb = jest.fn();
        const result = uut.registerCommandListener(cb);
        expect(result).toBeDefined();
        commandsObserver.notify('theCommandName', { x: 1 });
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith('theCommandName', { x: 1 });
    });
    it('registerCommandListener unregister', () => {
        const cb = jest.fn();
        const result = uut.registerCommandListener(cb);
        result.remove();
        commandsObserver.notify('theCommandName', { x: 1 });
        expect(cb).not.toHaveBeenCalled();
    });
    it(`delegates bindComponent to ComponentObserver`, () => {
        const subscription = {};
        mockScreenEventsRegistry.bindComponent = jest.fn();
        mockScreenEventsRegistry.bindComponent.mockReturnValueOnce(subscription);
        expect(uut.bindComponent({})).toEqual(subscription);
    });
    it(`delegates registerComponentListener to ComponentObserver`, () => {
        const subscription = {};
        mockScreenEventsRegistry.registerComponentListener = jest.fn();
        mockScreenEventsRegistry.registerComponentListener.mockReturnValueOnce(subscription);
        expect(uut.registerComponentListener({}, 'componentId')).toEqual(subscription);
    });
    it('delegates screenPopped to nativeEventsReceiver', () => {
        const cb = jest.fn();
        uut.registerScreenPoppedListener(cb);
        expect(mockNativeEventsReceiver.registerScreenPoppedListener).toHaveBeenCalledTimes(1);
        expect(mockNativeEventsReceiver.registerScreenPoppedListener).toHaveBeenCalledWith(cb);
    });
});
