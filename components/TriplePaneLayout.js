import React from 'react';
import { Animated, StyleSheet, Keyboard, Easing } from 'react-native';

import { PanGestureHandler, State } from 'react-native-gesture-handler/GestureHandler';

export const STATE = {
  openAll: 0, // a | b | c
  open2: 1, // b | c
  closeAll: 2, // c
  COUNT: 3,
};

class TriplePaneLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      containerWidth: 0,
      // containerHeight: 0,
      isLandscape: false,
      openState: props.openState || STATE.open2,
    };
    //
    this._draggedXValue = new Animated.Value(0);
    //
    this._panGestureHandler = React.createRef();
    //
    this._onPanGestureEvent = Animated.event([{ nativeEvent: {
      translationX: this._draggedXValue,
    } }], {
      useNativeDriver: false,
    });
  }

  _onContainerLayout = ({ nativeEvent }) => {
    const containerWidth = nativeEvent.layout.width;
    const containerHeight = nativeEvent.layout.height;
    const isLandscape = containerWidth > containerHeight;
    if (this.props.onLayout) {
      this.props.onLayout({ nativeEvent, isLandscape });
    }
    this.setState({
      containerWidth,
      // containerHeight,
      isLandscape,
    });
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
      if (toValue > 0 && nextFramePosition > toValue) {
        // nextFramePosition = toValue;
        this._draggedXValue.setValue(0);
        setTimeout(() => {
          this.setState({ openState: nextState });
        });
        return;
      } else if (toValue < 0 && nextFramePosition < toValue) {
        // nextFramePosition = toValue;
        this._draggedXValue.setValue(0);
        setTimeout(() => {
          this.setState({ openState: nextState });
        });
        return;
      }
      //
      this._draggedXValue.setValue(nextFramePosition);
      //
      this._panGestureHandler.current.setNativeProps({
        enabled: false,
      });
      //
      Animated.timing(this._draggedXValue, {
        duration: 250,
        velocity,
        // bounciness: 0,
        toValue,
        useNativeDriver: false,
        easing: Easing.in,
      }).start(({ finished }) => {
        if (finished) {
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
    const oldState = this.state.openState;
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
    return this.props.pane1Width || 300;
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
    return this.props.pane2Width || 400;
  }

  _getPane3X(openState) {
    if (openState === STATE.openAll) {
      return this._getPane1Width() + this._getPane2Width();
    } else if (openState === STATE.open2) {
      return this._getPane2Width();
    }
    return 0;
  }

  _getPane3Width(openState) {
    if (this.state.isLandscape) {
      if (openState === STATE.closeAll) {
        return this.state.containerWidth;
      }
      return this.state.containerWidth - this._getPane2Width();
    }
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

  _getPane3DynamicWidth(openState, dragRange) {
    const width = this._getPane3Width(openState);
    if (this.state.isLandscape) {
      if (openState === STATE.open2) {
        // drag range: [-this._getPane2Width(), 0, this._getPane1Width()];
        const widthRange = [this.state.containerWidth, width, width];
        return Animated.diffClamp(
          this._draggedXValue,
          dragRange[0], dragRange[dragRange.length - 1],
        ).interpolate({
          inputRange: dragRange,
          outputRange: widthRange,
        });
      } else if (openState === STATE.closeAll) {
        // drag range: [0, pane2width]
        const widthRange = [width, this._getPane3Width(STATE.open2)];
        return Animated.diffClamp(
          this._draggedXValue,
          dragRange[0], dragRange[dragRange.length - 1],
        ).interpolate({
          inputRange: dragRange,
          outputRange: widthRange,
        });
      }
    }
    //
    return width;
  }

  render() {
    //
    const openState = this.state.openState;
    const pane1Width = this._getPane1Width();
    const pane2Width = this._getPane2Width();
    // const pane3Width = this._getPane3Width(openState);
    //
    const pane1Left = this._getPane1X(openState);
    const pane2Left = this._getPane2X(openState);
    const pane3Left = this._getPane3X(openState);

    const dragRange = this._getDragRange(openState);
    const pane1MoveRange = this._getPane1MoveRange(openState);
    const pane2MoveRange = this._getPane2MoveRange(openState);
    const pane3MoveRange = this._getPane3MoveRange(openState);
    //
    const pane3DynamicWidth = this._getPane3DynamicWidth(openState, dragRange);
    //
    let activeOffsetX;
    if (openState === STATE.openAll) {
      activeOffsetX = [0, 100000]; // disable left -> right
    } else if (openState === STATE.open2) {
      // allow all
      activeOffsetX = [-3, 3]; // undefined;
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
          style={styles.root}
          onLayout={this._onContainerLayout}
        >
          <Animated.View
            style={[
              styles.pane,
              {
                zIndex: 1,
                width: pane1Width,
                left: pane1Left,
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
          >
            {this.props.pane1}
          </Animated.View>
          <Animated.View
            style={[
              styles.pane,
              {
                zIndex: 2,
                width: pane2Width,
                left: pane2Left,
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
          >
            {this.props.pane2}
          </Animated.View>
          <Animated.View
            style={[
              styles.pane,
              {
                zIndex: 3,
                width: pane3DynamicWidth,
                left: pane3Left,
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
          >
            {this.props.pane3}
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    width: '100%',
    zIndex: 0,
    overflow: 'hidden',
  },
  pane: {
    position: 'absolute',
    height: '100%',
    top: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
  },
});

export default TriplePaneLayout;
