import { EventSubscription } from 'fbemitter';
import React from 'react';
import { DeviceEventEmitter, StyleSheet, Text } from 'react-native';

interface State {
  eventListener?: EventSubscription;
  strike: number;
}

interface Props {}

export default class StrikeDisplayer extends React.Component<Props, State> {
  state: State = {
    strike: 0,
  };

  componentDidMount() {
    this.setState({
      eventListener: DeviceEventEmitter.addListener(
        'strikeUpdateEvent',
        this.eventHandler,
      ),
    });
  }

  componentWillUnmount() {
    this.state.eventListener!.remove();
  }

  eventHandler = (event: any) => {
    this.setState({ strike: event.value });
  };

  render() {
    return <Text style={styles.strike_text}>{this.state.strike}</Text>;
  }
}

const styles = StyleSheet.create({
  strike_text: {
    zIndex: 1,
    textShadowOffset: { width: 10, height: 10 },
    fontWeight: 'bold',
    fontSize: 30,
    top: 50,
    position: 'absolute',
    justifyContent: 'flex-start',
    color: 'green',
    alignSelf: 'center',
  },
});
