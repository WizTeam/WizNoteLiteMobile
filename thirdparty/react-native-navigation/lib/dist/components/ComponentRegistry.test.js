"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ComponentRegistry_1 = require("./ComponentRegistry");
const Store_1 = require("./Store");
const ts_mockito_1 = require("ts-mockito");
const ComponentWrapper_1 = require("./ComponentWrapper");
const ComponentEventsObserver_1 = require("../events/ComponentEventsObserver");
const AppRegistryService_1 = require("../adapters/AppRegistryService");
const React = tslib_1.__importStar(require("react"));
const DummyComponent = () => null;
class MyComponent extends React.Component {
}
describe('ComponentRegistry', () => {
    let mockedStore;
    let mockedComponentEventsObserver;
    let mockedComponentWrapper;
    let mockedAppRegistryService;
    let componentWrapper;
    let store;
    let uut;
    beforeEach(() => {
        mockedStore = ts_mockito_1.mock(Store_1.Store);
        mockedComponentEventsObserver = ts_mockito_1.mock(ComponentEventsObserver_1.ComponentEventsObserver);
        mockedComponentWrapper = ts_mockito_1.mock(ComponentWrapper_1.ComponentWrapper);
        mockedAppRegistryService = ts_mockito_1.mock(AppRegistryService_1.AppRegistryService);
        store = ts_mockito_1.instance(mockedStore);
        componentWrapper = ts_mockito_1.instance(mockedComponentWrapper);
        uut = new ComponentRegistry_1.ComponentRegistry(store, ts_mockito_1.instance(mockedComponentEventsObserver), componentWrapper, ts_mockito_1.instance(mockedAppRegistryService));
    });
    it('registers component by componentName into AppRegistry', () => {
        uut.registerComponent('example.MyComponent.name', () => DummyComponent);
        ts_mockito_1.verify(mockedAppRegistryService.registerComponent('example.MyComponent.name', ts_mockito_1.anyFunction())).called();
    });
    it('saves the wrapper component generator to the store', () => {
        uut.registerComponent('example.MyComponent.name', () => DummyComponent);
        ts_mockito_1.verify(mockedStore.setComponentClassForName('example.MyComponent.name', ts_mockito_1.anyFunction())).called();
    });
    it('should not invoke generator', () => {
        const generator = jest.fn(() => DummyComponent);
        uut.registerComponent('example.MyComponent.name', generator);
        expect(generator).toHaveBeenCalledTimes(0);
    });
    it('should wrap component only once', () => {
        componentWrapper.wrap = jest.fn();
        let wrappedComponent;
        store.hasRegisteredWrappedComponent = jest.fn(() => wrappedComponent !== undefined);
        store.setWrappedComponent = jest.fn(() => wrappedComponent = MyComponent);
        const generator = jest.fn(() => DummyComponent);
        uut.registerComponent('example.MyComponent.name', generator)();
        uut.registerComponent('example.MyComponent.name', generator)();
        expect(componentWrapper.wrap).toHaveBeenCalledTimes(1);
    });
});
