import React from 'react';
import EventEmitter from 'events';
import isEqual from 'lodash.isequal';

class SimpleStore {
  constructor() {
    this._data = {};
    this._listener = new EventEmitter();
  }

  subscribe(key, listener) {
    this._listener.on(key, listener);
  }

  unsubscribe(key, listener) {
    this._listener.off(key, listener);
  }

  setData(key, data) {
    const old = this._data[key];
    if (isEqual(data, old)) {
      return;
    }
    this._data[key] = data;
    this._listener.emit(key, key, data);
  }

  getData(key) {
    return this._data[key];
  }
}

const store = new SimpleStore();

export default store;

export function connect(keys) {
  return function wrapWithConnect(WrappedComponent) {
    class Connect extends React.Component {
      constructor(props, context) {
        super(props, context);
        this.state = {};
        this.nextProps = props;
        //
        keys.forEach((key) => {
          this.state[key] = store.getData(key);
        });
      }

      componentDidMount() {
        keys.forEach((key) => {
          store.subscribe(key, this.handleDataChange);
        });
      }

      shouldComponentUpdate(nextProps) {
        this.nextProps = nextProps;
        return true;
      }

      componentWillUnmount() {
        keys.forEach((key) => {
          store.unsubscribe(key, this.handleDataChange);
        });
      }

      handleDataChange = (key, data) => {
        const state = {};
        state[key] = data;
        this.setState(state);
      }

      render() {
        return (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <WrappedComponent {...this.nextProps} {...this.state} />
        );
      }
    }
    return Connect;
  };
}
