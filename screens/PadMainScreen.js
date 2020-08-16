import React from 'react';
import { View, Animated, StyleSheet, Keyboard } from 'react-native';

import { PanGestureHandler, State } from 'react-native-gesture-handler/GestureHandler';

const STATE = {
  openAll: 0, // a | b | c
  open2: 1, // b | c
  allClosed: 2, // c
  COUNT: 3,
};

class Circle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      containerWidth: 0,
      openState: STATE.openAll,
    };
    //
    this._draggedXValue = new Animated.Value(0);
    this._pane2XValue = new Animated.Value(0);
    this._pane3XValue = new Animated.Value(0);
    //
    this._panGestureHandler = React.createRef();
    //
    this._onPanGestureEvent = Animated.event([{ nativeEvent: {
      translationX: this._draggedXValue,
    } }], {
      useNativeDriver: true,
    });
  }

  _onContainerLayout = ({ nativeEvent }) => {
    this.setState({ containerWidth: nativeEvent.layout.width });
  };

  _setPanGestureRef = (ref) => {
    this._panGestureHandler.current = ref;
  };

  _openingHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      const moved = nativeEvent.translationX;
      this._onGestureEnd(moved);
    } else if (nativeEvent.state === State.ACTIVE) {
      Keyboard.dismiss();
    }
  };

  _onGestureEnd(moved) {
    const gotoNextState = (nextState) => {
      //
      const pane3OriginLeft = this._getPane3X(this.state.openState);
      const pane3Left = this._getPane3X(nextState);
      this._draggedXValue.setValue(moved);
      const toValue = pane3Left - pane3OriginLeft;
      //
      Animated.spring(this._draggedXValue, {
        velocity: 0,
        bounciness: 0,
        toValue,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          this._panGestureHandler.current.disabled = false;
          this._draggedXValue.setValue(0);
          if (nextState !== this.state.openState) {
            this.setState({ openState: nextState });
          }
          console.log('finished');
        }
      });
    };

    const rollback = () => {
      gotoNextState(this.state.openState, moved);
    };

    if (Math.abs(moved) < 30) {
      rollback(moved);
      return;
    }
    //
    const oldState = this.state.openState || 0;
    if (moved < 0) {
      // <-
      if (oldState === STATE.allClosed) {
        rollback(moved);
        return;
      }
      const openState = (oldState + 1) % STATE.COUNT;
      gotoNextState(openState, moved);
    } else {
      // ->
      if (oldState === STATE.openAll) {
        rollback(moved);
        return;
      }
      const openState = (oldState - 1) % STATE.COUNT;
      gotoNextState(openState, moved);
      //
    }
  }

  _getPane1X() {
    return 0;
  }

  _getPane1Width() {
    return 150;
  }

  _getPane2X(openState) {
    if (openState === STATE.openAll) {
      return this._getPane1Width();
    }
    return 0;
  }

  _getPane2Width() {
    return 200;
  }

  _getPane3X(openState) {
    if (openState === STATE.openAll) {
      return this._getPane1Width() + this._getPane2Width();
    } else if (openState === STATE.open2) {
      return this._getPane2Width();
    }
    return 0;
  }

  _getPane3Width() {
    return this.state.containerWidth;
  }

  render() {
    //
    const openState = this.state.openState;
    const pane1Width = this._getPane1Width();
    const pane2Width = this._getPane2Width();
    const pane3Width = this._getPane3Width();
    //
    const pane1Left = this._getPane1X(openState);
    const pane2Left = this._getPane2X(openState);
    const pane3Left = this._getPane3X(openState);
    //
    let activeOffsetX;
    let pane2MinMoveLeft = 0;
    let pane3MinMoveLeft = 0;
    let pane2MaxMoveLeft = 0;
    let pane3MaxMoveLeft = 0;
    if (openState === STATE.openAll) {
      activeOffsetX = [0, 100000]; // disable left -> right
      pane2MinMoveLeft = -pane2Left;
      pane3MinMoveLeft = -pane2Left;
    } else if (openState === STATE.open2) {
      // allow all
      pane2MinMoveLeft = -pane2Left;
      pane3MinMoveLeft = -pane3Left;
      pane2MaxMoveLeft = pane1Width;
      pane3MaxMoveLeft = pane1Width;
      activeOffsetX = 0;
      //
    } else { // all closed
      activeOffsetX = [-100000, 0]; // disable left <- right
      pane2MaxMoveLeft = 0;
      pane3MaxMoveLeft = pane2Width;
    }
    //
    return (
      <PanGestureHandler
        failOffsetY={[-15, 15]}
        activeOffsetX={activeOffsetX}
        onGestureEvent={this._onPanGestureEvent}
        onHandlerStateChange={this._openingHandlerStateChange}
        ref={this._setPanGestureRef}
      >
        <Animated.View
          style={{
            flexGrow: 1,
            width: '100%',
            zIndex: 0,
            overflow: 'hidden',
          }}
          onLayout={this._onContainerLayout}
        >
          <View
            style={[
              {
                backgroundColor: '#42a5f5',
                position: 'absolute',
                height: '100%',
                width: pane1Width,
                left: pane1Left,
                top: 0,
                bottom: 0,
                zIndex: 1,
              },
            ]}
          />
          <Animated.View
            style={[
              {
                backgroundColor: 'blue',
                position: 'absolute',
                height: '100%',
                width: pane2Width,
                left: pane2Left,
                top: 10,
                bottom: 0,
                zIndex: 1,
              },
              {
                transform: [
                  {
                    translateX: Animated.add(
                      Animated.diffClamp(this._draggedXValue, pane2MinMoveLeft, pane2MaxMoveLeft),
                      this._pane2XValue,
                    ),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              {
                backgroundColor: 'red',
                position: 'absolute',
                height: '100%',
                width: pane3Width,
                left: pane3Left,
                top: 20,
                bottom: 0,
                zIndex: 2,
              },
              {
                transform: [
                  {
                    translateX: Animated.add(
                      Animated.diffClamp(this._draggedXValue, pane3MinMoveLeft, pane3MaxMoveLeft),
                      this._pane3XValue,
                    ),
                  },
                ],
              },
            ]}
          />
        </Animated.View>
      </PanGestureHandler>
    );
  }
}

const styles = StyleSheet.create({
});

export default Circle;
