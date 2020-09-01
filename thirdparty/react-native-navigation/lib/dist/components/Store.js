"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
class Store {
    constructor() {
        this.componentsByName = {};
        this.propsById = {};
        this.componentsInstancesById = {};
        this.wrappedComponents = {};
    }
    updateProps(componentId, props) {
        this.propsById[componentId] = props;
        const component = this.componentsInstancesById[componentId];
        if (component) {
            this.componentsInstancesById[componentId].setProps(props);
        }
    }
    getPropsForId(componentId) {
        return this.propsById[componentId] || {};
    }
    clearComponent(componentId) {
        delete this.propsById[componentId];
        delete this.componentsInstancesById[componentId];
    }
    setComponentClassForName(componentName, ComponentClass) {
        this.componentsByName[componentName.toString()] = ComponentClass;
    }
    getComponentClassForName(componentName) {
        this.ensureClassForName(componentName);
        return this.componentsByName[componentName.toString()];
    }
    ensureClassForName(componentName) {
        if (!this.componentsByName[componentName.toString()] && this.lazyRegistratorFn) {
            this.lazyRegistratorFn(componentName);
        }
    }
    setComponentInstance(id, component) {
        this.componentsInstancesById[id] = component;
    }
    getComponentInstance(id) {
        return this.componentsInstancesById[id];
    }
    setWrappedComponent(componentName, wrappedComponent) {
        this.wrappedComponents[componentName] = wrappedComponent;
    }
    hasRegisteredWrappedComponent(componentName) {
        return componentName in this.wrappedComponents;
    }
    getWrappedComponent(componentName) {
        return this.wrappedComponents[componentName];
    }
    setLazyComponentRegistrator(lazyRegistratorFn) {
        this.lazyRegistratorFn = lazyRegistratorFn;
    }
}
exports.Store = Store;
