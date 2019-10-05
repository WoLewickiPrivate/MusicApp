import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import createSecureStore from 'redux-persist-expo-securestore';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import Navigator from './src/navigation/AppNavigator';
import { reducers } from './src/redux/RootReducer';

const storage = createSecureStore();

const config = {
  key: 'root',
  storage,
};

const reducer = persistReducer(config, reducers);

const store = createStore(reducer);

const persistor = persistStore(store);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate
          loading={
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <ActivityIndicator
                style={{ alignSelf: 'center' }}
                size="large"
                color="#0000ff"
              />
            </View>
          }
          persistor={persistor}
        >
          <Navigator />
        </PersistGate>
      </Provider>
    );
  }
}
