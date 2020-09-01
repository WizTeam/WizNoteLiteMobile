/**
 * @author Luke Brandon Farrell
 * @description An animated drawer component for react-native-navigation.
 */

/* NPM - Node Package Manage */
import * as React from 'react';
import {
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { Navigation, Layout } from 'react-native-navigation';
/* Utils - Project Utilities */
import { listen, dispatch } from './events';

enum DirectionType {
  left = 'left',
  right = 'right',
  bottom = 'bottom',
  top = 'top',
}

interface IState {
  sideMenuOpenValue: any;
  sideMenuOverlayOpacity: any;
  sideMenuSwipingStarted: boolean;
  sideMenuIsDismissing: boolean;
}

interface IProps {
  /** react-native-navigation */
  componentId: string;
  /** Props */
  animationOpenTime: number;
  animationCloseTime: number;
  direction: DirectionType;
  dismissWhenTouchOutside: boolean;
  fadeOpacity: number;
  drawerScreenWidth: number | string;
  drawerScreenHeight: number | string;
  style: any;
}

interface HOCProps {
  Component: React.ComponentType;
}

interface StylesInterface {
  sideMenuContainerStyle: ViewStyle;
  sideMenuOverlayStyle: ImageStyle;
}

interface DrawerDirectionValuesInterface {
  [key: string]: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface DrawerReverseDirectionInterface {
  [key: string]: string;
  left: string;
  right: string;
}

interface SwipeMoveInterface {
  value: number;
  direction: string;
}

class RNNDrawer {
  static create(Component: React.ComponentType): any {
    class WrappedDrawer extends React.Component<IProps, IState> {
      private readonly screenWidth: number;
      private readonly screenHeight: number;
      private readonly drawerWidth: number;
      private readonly drawerHeight: number;
      private readonly drawerOpenedValues: DrawerDirectionValuesInterface;
      private animatedDrawer: any;
      private animatedOpacity: any;
      private unsubscribeSwipeStart: any;
      private unsubscribeSwipeMove: any;
      private unsubscribeSwipeEnd: any;
      private unsubscribeDismissDrawer: any;

      static defaultProps = {
        animationOpenTime: 300,
        animationCloseTime: 300,
        direction: 'left',
        dismissWhenTouchOutside: true,
        fadeOpacity: 0.6,
        drawerScreenWidth: '80%',
        drawerScreenHeight: '100%',
      };

      /**
       * [ Built-in React method. ]
       *
       * Setup the component. Executes when the component is created
       *
       * @param {object} props
       */
      constructor(props: IProps) {
        super(props);

        this.screenWidth = Dimensions.get('window').width;
        this.screenHeight = Dimensions.get('window').height;

        /*
         * We need to convert the pushed drawer width
         * to a number as it can either be a string ('20%')
         * or number (400).
         */
        const _resolveDrawerSize = (
          value: number | string,
          max: number,
        ): number => {
          /*
           * If the type is a string '%' then it should be a percentage relative
           * to our max size.
           */
          if (typeof value === 'string') {
            const valueAsNumber = parseFloat(value as string) || 100;
            const size = max * (valueAsNumber / 100);

            return size;
          }

          return value;
        };

        /** Component Variables */
        this.drawerWidth = _resolveDrawerSize(
          props.drawerScreenWidth,
          this.screenWidth,
        );
        this.drawerHeight = _resolveDrawerSize(
          props.drawerScreenHeight,
          this.screenHeight,
        );

        this.drawerOpenedValues = {
          left: 0,
          right: this.screenWidth - this.drawerWidth,
          top: 0,
          bottom: this.screenHeight - this.drawerHeight,
        };

        const initialValues: DrawerDirectionValuesInterface = {
          left: -this.drawerWidth,
          right: this.screenWidth,
          top: -this.drawerHeight,
          bottom: this.screenHeight,
        };

        /** Component State */
        this.state = {
          sideMenuOpenValue: new Animated.Value(initialValues[props.direction]),
          sideMenuOverlayOpacity: new Animated.Value(0),
          sideMenuSwipingStarted: false,
          sideMenuIsDismissing: false,
        };

        /** Component Bindings */
        this.touchedOutside = this.touchedOutside.bind(this);
        this.dismissDrawerWithAnimation = this.dismissDrawerWithAnimation.bind(
          this,
        );
        this.registerListeners = this.registerListeners.bind(this);
        this.removeListeners = this.removeListeners.bind(this);
        Navigation.events().bindComponent(this);
      }

      /**
       * [ Built-in React method. ]
       *
       * Executed when the component is mounted to the screen
       */
      componentDidMount() {
        /** Props */
        const { direction, fadeOpacity } = this.props;

        // Animate side menu open
        this.animatedDrawer = Animated.timing(this.state.sideMenuOpenValue, {
          toValue: this.drawerOpenedValues[direction],
          duration: this.props.animationOpenTime,
          useNativeDriver: false,
        });

        // Animate outside side menu opacity
        this.animatedOpacity = Animated.timing(
          this.state.sideMenuOverlayOpacity,
          {
            toValue: fadeOpacity,
            duration: this.props.animationOpenTime,
            useNativeDriver: false,
          },
        );
      }

      /**
       * [ react-native-navigation method. ]
       *
       * Executed when the component is navigated to view.
       */
      componentDidAppear() {
        this.registerListeners();

        // If there has been no Swiping, and this component appears, then just start the open animations
        if (!this.state.sideMenuSwipingStarted) {
          this.animatedDrawer.start();
          this.animatedOpacity.start();
        }
      }

      /**
       * [ react-native-navigation method. ]
       *
       * Executed when the component is navigated away from view.
       */
      componentDidDisappear() {
        this.removeListeners();

        dispatch('DRAWER_CLOSED');
      }

      /**
       * Registers all the listenrs for this component
       */
      registerListeners() {
        /** Props */
        const { direction, fadeOpacity } = this.props;

        // Executes when the side of the screen interaction starts
        this.unsubscribeSwipeStart = listen('SWIPE_START', () => {
          this.setState({
            sideMenuSwipingStarted: true,
          });
        });

        // Executes when the side of the screen is interacted with
        this.unsubscribeSwipeMove = listen(
          'SWIPE_MOVE',
          ({ value, direction: swipeDirection }: SwipeMoveInterface) => {
            if (swipeDirection === 'left') {
              // Calculates the position of the drawer from the left side of the screen
              const alignedMovementValue = value - this.drawerWidth;
              // Calculates the percetage 0 - 100 of which the drawer is open
              const openedPercentage = Math.abs(
                (Math.abs(alignedMovementValue) / this.drawerWidth) * 100 - 100,
              );
              // Calculates the opacity to set of the screen based on the percentage the drawer is open
              const normalizedOpacity = Math.min(
                openedPercentage / 100,
                fadeOpacity,
              );

              // Does allow the drawer to go further than the maximum width
              if (this.drawerOpenedValues[direction] > alignedMovementValue) {
                // Sets the animation values, we use this so we can resume animation from any point
                this.state.sideMenuOpenValue.setValue(alignedMovementValue);
                this.state.sideMenuOverlayOpacity.setValue(normalizedOpacity);
              }
            } else if (swipeDirection === 'right') {
              // Works out the distance from right of screen to the finger position
              const normalizedValue = this.screenWidth - value;
              // Calculates the position of the drawer from the left side of the screen
              const alignedMovementValue = this.screenWidth - normalizedValue;
              // Calculates the percetage 0 - 100 of which the drawer is open
              const openedPercentage = Math.abs(
                (Math.abs(normalizedValue) / this.drawerWidth) * 100,
              );
              // Calculates the opacity to set of the screen based on the percentage the drawer is open
              const normalizedOpacity = Math.min(
                openedPercentage / 100,
                fadeOpacity,
              );

              // Does allow the drawer to go further than the maximum width
              if (this.drawerOpenedValues[direction] < alignedMovementValue) {
                // Sets the animation values, we use this so we can resume animation from any point
                this.state.sideMenuOpenValue.setValue(alignedMovementValue);
                this.state.sideMenuOverlayOpacity.setValue(normalizedOpacity);
              }
            }
          },
        );

        // Executes when the side of the screen interaction ends
        this.unsubscribeSwipeEnd = listen(
          'SWIPE_END',
          (swipeDirection: string) => {
            const reverseDirection: DrawerReverseDirectionInterface = {
              right: 'left',
              left: 'right',
            };

            if (swipeDirection === reverseDirection[direction]) {
              this.animatedDrawer.start();
              this.animatedOpacity.start();
            } else {
              if (!this.state.sideMenuIsDismissing) {
                this.setState(
                  {
                    sideMenuIsDismissing: true,
                  },
                  () => {
                    this.dismissDrawerWithAnimation();
                  },
                );
              }
            }
          },
        );

        // Executes when the drawer needs to be dismissed
        this.unsubscribeDismissDrawer = listen('DISMISS_DRAWER', () => {
          if (!this.state.sideMenuIsDismissing) {
            this.dismissDrawerWithAnimation();
          }
        });
      }

      /**
       * Removes all the listenrs from this component
       */
      removeListeners() {
        if (this.unsubscribeSwipeStart) this.unsubscribeSwipeStart();
        if (this.unsubscribeSwipeMove) this.unsubscribeSwipeMove();
        if (this.unsubscribeSwipeEnd) this.unsubscribeSwipeEnd();
        if (this.unsubscribeDismissDrawer) this.unsubscribeDismissDrawer();
      }

      /**
       * [ Built-in React method. ]
       *
       * Allows us to render JSX to the screen
       */
      render() {
        /** Styles */
        const { sideMenuOverlayStyle, sideMenuContainerStyle } = styles;
        /** Props */
        const { direction, style } = this.props;
        /** State */
        const { sideMenuOpenValue, sideMenuOverlayOpacity } = this.state;
        /** Variables */
        const animatedValue =
          direction === DirectionType.left || direction === DirectionType.right
            ? { marginLeft: sideMenuOpenValue }
            : { marginTop: sideMenuOpenValue };

        return (
          <View style={sideMenuContainerStyle}>
            <TouchableWithoutFeedback onPress={this.touchedOutside}>
              <Animated.View
                style={[
                  sideMenuOverlayStyle,
                  { opacity: sideMenuOverlayOpacity },
                ]}
              />
            </TouchableWithoutFeedback>
            <Animated.View
              style={[
                { backgroundColor: '#FFF' },
                style,
                {
                  height: this.drawerHeight,
                  width: this.drawerWidth,
                  ...animatedValue,
                },
              ]}
            >
              <Component {...this.props} />
            </Animated.View>
          </View>
        );
      }

      /**
       * Touched outside drawer
       */
      touchedOutside() {
        const { dismissWhenTouchOutside } = this.props;

        if (dismissWhenTouchOutside) {
          this.dismissDrawerWithAnimation();
        }
      }

      /**
       * Dismisses drawer with animation
       */
      dismissDrawerWithAnimation() {
        const { direction } = this.props;
        const { sideMenuIsDismissing } = this.state;
        const closeValues: DrawerDirectionValuesInterface = {
          left: -this.drawerWidth,
          right: this.screenWidth,
          top: -this.drawerHeight,
          bottom: this.screenHeight,
        };

        // Animate side menu close
        Animated.timing(this.state.sideMenuOpenValue, {
          toValue: closeValues[direction],
          duration: this.props.animationCloseTime,
          useNativeDriver: false,
        }).start(() => {
          Navigation.dismissOverlay(this.props.componentId);
          this.setState({ sideMenuIsDismissing: false });
        });

        // Animate outside side menu opacity
        Animated.timing(this.state.sideMenuOverlayOpacity, {
          toValue: 0,
          duration: this.props.animationCloseTime,
          useNativeDriver: false,
        }).start();
      }
    }

    return WrappedDrawer;
  }

  /**
   * Shows a drawer component
   *
   * @param layout
   */
  static showDrawer(layout: Layout) {
    // By default for this library, we make the 'componentBackgroundColor' transparent
    const componentBackgroundColor =
      layout?.component?.options?.layout?.componentBackgroundColor ??
      'transparent';
    const options = {
      ...layout?.component?.options,
      layout: {
        componentBackgroundColor: componentBackgroundColor,
      },
    };

    // Mutate options to add 'transparent' by default
    // @ts-ignore
    layout.component.options = { ...options };

    Navigation.showOverlay(layout);
  }

  /**
   * Dismiss the drawer component
   */
  static dismissDrawer() {
    dispatch('DISMISS_DRAWER', true);
  }
}

export default RNNDrawer;

/** -------------------------------------------- */
/**             Component Styling                */
/** -------------------------------------------- */
const styles = StyleSheet.create<StylesInterface>({
  sideMenuContainerStyle: {
    flex: 1,
    flexDirection: 'row',
  },
  sideMenuOverlayStyle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
});
