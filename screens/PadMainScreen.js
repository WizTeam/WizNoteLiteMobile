import React from 'react';
import { Animated, StyleSheet, Keyboard } from 'react-native';

import { PanGestureHandler, State } from 'react-native-gesture-handler/GestureHandler';

const STATE = {
  openAll: 0, // a | b | c
  open2: 1, // b | c
  closeAll: 2, // c
  COUNT: 3,
};

class Circle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      containerWidth: 0,
      openState: STATE.closeAll,
    };
    //
    this._draggedXValue = new Animated.Value(0);
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
      this._onGestureEnd(moved, nativeEvent);
    } else if (nativeEvent.state === State.ACTIVE) {
      Keyboard.dismiss();
    }
  };

  _onGestureEnd(moved, nativeEvent) {
    //
    const gotoNextState = (nextState) => {
      //
      const pane3OriginLeft = this._getPane3X(this.state.openState);
      const pane3Left = this._getPane3X(nextState);
      const toValue = pane3Left - pane3OriginLeft;
      //
      let nextFramePosition = moved;
      let { velocityX } = nativeEvent;
      if (moved < 0) {
        velocityX = -velocityX;
      }
      const velocity = velocityX;
      const fromValue = moved;
      if (fromValue < toValue && velocity > 0) {
        nextFramePosition = Math.min(fromValue + velocity / 60.0, toValue);
      } else if (fromValue > toValue && velocity < 0) {
        nextFramePosition = Math.max(fromValue + velocity / 60.0, toValue);
      }
      //
      this._draggedXValue.setValue(nextFramePosition);
      //
      this._panGestureHandler.current.setNativeProps({
        enabled: false,
      });
      //
      Animated.spring(this._draggedXValue, {
        velocity: 0,
        bounciness: 0,
        toValue,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          console.log('finished');
          this._panGestureHandler.current.setNativeProps({
            enabled: true,
          });
          this._draggedXValue.setValue(0);
          if (nextState !== this.state.openState) {
            this.setState({ openState: nextState });
          }
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
      if (oldState === STATE.closeAll) {
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

  _getPane1X(openState) {
    if (openState === STATE.openAll) {
      return 0;
    } else if (openState === STATE.open2) {
      return -this._getPane1Width() / 3;
    }
    return -this._getPane1Width() / 3;
  }

  _getPane1Width() {
    return 150;
  }

  _getPane2X(openState) {
    if (openState === STATE.openAll) {
      return this._getPane1Width();
    } else if (openState === STATE.open2) {
      return 0;
    }
    return -(this._getPane2Width() / 3);
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

  _getDragRange(openState) {
    if (openState === STATE.openAll) {
      return [-this._getPane1Width(), 0];
    } else if (openState === STATE.open2) {
      return [-this._getPane2Width(), 0, this._getPane1Width()];
    }
    return [0, this._getPane2Width()];
  }

  _getPane1MoveRange(openState) {
    if (openState === STATE.openAll) {
      return [-this._getPane1Width() / 3, 0];
    } else if (openState === STATE.open2) {
      return [0, 0, this._getPane1Width() / 3];
    }
    return [0, 0];
  }

  _getPane2MoveRange(openState) {
    if (openState === STATE.openAll) {
      return [-this._getPane1Width(), 0];
    } else if (openState === STATE.open2) {
      return [-this._getPane2Width() / 3, 0, this._getPane1Width()];
    }
    return [0, this._getPane2Width() / 3];
  }

  _getPane3MoveRange(openState) {
    if (openState === STATE.openAll) {
      return [-this._getPane1Width(), 0];
    } else if (openState === STATE.open2) {
      return [-this._getPane2Width(), 0, this._getPane1Width()];
    }
    return [0, this._getPane2Width()];
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

    const dragRange = this._getDragRange(openState);
    const pane1MoveRange = this._getPane1MoveRange(openState);
    const pane2MoveRange = this._getPane2MoveRange(openState);
    const pane3MoveRange = this._getPane3MoveRange(openState);
    //
    //
    let activeOffsetX;
    if (openState === STATE.openAll) {
      activeOffsetX = [0, 100000]; // disable left -> right
    } else if (openState === STATE.open2) {
      // allow all
      activeOffsetX = 0;
      //
    } else { // all closed
      activeOffsetX = [-100000, 0]; // disable left <- right
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
          <Animated.View
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
              {
                transform: [
                  {
                    translateX: Animated.diffClamp(
                      this._draggedXValue,
                      dragRange[0], dragRange[dragRange.length - 1],
                    ).interpolate({
                      inputRange: dragRange,
                      outputRange: pane1MoveRange,
                    }),
                  },
                ],
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
                zIndex: 2,
              },
              {
                transform: [
                  {
                    translateX: Animated.diffClamp(
                      this._draggedXValue,
                      dragRange[0], dragRange[dragRange.length - 1],
                    ).interpolate({
                      inputRange: dragRange,
                      outputRange: pane2MoveRange,
                    }),
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
                zIndex: 3,
              },
              {
                transform: [
                  {
                    translateX: Animated.diffClamp(
                      this._draggedXValue,
                      dragRange[0], dragRange[dragRange.length - 1],
                    ).interpolate({
                      inputRange: dragRange,
                      outputRange: pane3MoveRange,
                    }),
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
