import { AppRegistry } from 'react-native';
import { initialiseBugSnag } from './util/bugsnag';

import App from './components/App';

initialiseBugSnag();

AppRegistry.registerComponent('cali', () => App);
