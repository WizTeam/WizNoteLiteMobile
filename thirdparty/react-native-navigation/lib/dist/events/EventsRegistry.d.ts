/// <reference types="react" />
import { EmitterSubscription } from 'react-native';
import { NativeEventsReceiver } from '../adapters/NativeEventsReceiver';
import { CommandsObserver } from './CommandsObserver';
import { EventSubscription } from '../interfaces/EventSubscription';
import { NavigationComponentListener } from '../interfaces/NavigationComponentListener';
import { ComponentEventsObserver } from './ComponentEventsObserver';
import { ComponentDidAppearEvent, ComponentDidDisappearEvent, NavigationButtonPressedEvent, SearchBarUpdatedEvent, SearchBarCancelPressedEvent, PreviewCompletedEvent, ModalDismissedEvent, ScreenPoppedEvent, ModalAttemptedToDismissEvent } from '../interfaces/ComponentEvents';
import { CommandCompletedEvent, BottomTabSelectedEvent, BottomTabLongPressedEvent, BottomTabPressedEvent } from '../interfaces/Events';
export declare class EventsRegistry {
    private nativeEventsReceiver;
    private commandsObserver;
    private componentEventsObserver;
    constructor(nativeEventsReceiver: NativeEventsReceiver, commandsObserver: CommandsObserver, componentEventsObserver: ComponentEventsObserver);
    registerAppLaunchedListener(callback: () => void): EmitterSubscription;
    registerComponentDidAppearListener(callback: (event: ComponentDidAppearEvent) => void): EmitterSubscription;
    registerComponentDidDisappearListener(callback: (event: ComponentDidDisappearEvent) => void): EmitterSubscription;
    registerCommandCompletedListener(callback: (event: CommandCompletedEvent) => void): EmitterSubscription;
    registerBottomTabSelectedListener(callback: (event: BottomTabSelectedEvent) => void): EmitterSubscription;
    registerBottomTabPressedListener(callback: (event: BottomTabPressedEvent) => void): EmitterSubscription;
    registerBottomTabLongPressedListener(callback: (event: BottomTabLongPressedEvent) => void): EmitterSubscription;
    registerNavigationButtonPressedListener(callback: (event: NavigationButtonPressedEvent) => void): EmitterSubscription;
    registerModalDismissedListener(callback: (event: ModalDismissedEvent) => void): EmitterSubscription;
    registerModalAttemptedToDismissListener(callback: (event: ModalAttemptedToDismissEvent) => void): EmitterSubscription;
    registerSearchBarUpdatedListener(callback: (event: SearchBarUpdatedEvent) => void): EmitterSubscription;
    registerSearchBarCancelPressedListener(callback: (event: SearchBarCancelPressedEvent) => void): EmitterSubscription;
    registerPreviewCompletedListener(callback: (event: PreviewCompletedEvent) => void): EmitterSubscription;
    registerCommandListener(callback: (name: string, params: any) => void): EventSubscription;
    bindComponent(component: React.Component<any>, componentId?: string): EventSubscription;
    registerComponentListener(listener: NavigationComponentListener, componentId: string): EventSubscription;
    registerScreenPoppedListener(callback: (event: ScreenPoppedEvent) => void): EmitterSubscription;
}
