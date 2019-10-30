import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from 'react-navigation';

declare global {
  type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;
}
