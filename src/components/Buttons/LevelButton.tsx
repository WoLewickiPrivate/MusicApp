import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  onPress: () => void;
  disabled: boolean;
  stars: number;
  levelNumber: number;
  name: string;
}

export default class LevelButton extends React.Component<Props> {
  render() {
    return (
      <TouchableOpacity
        disabled={this.props.disabled}
        style={
          this.props.disabled ? styles.disabledButton : styles.enabledButton
        }
        onPress={this.props.onPress}
      >
        <Text
          style={
            this.props.disabled
              ? styles.disabledButtonText
              : styles.enabledButtonText
          }
        >
          {this.props.levelNumber}: {this.props.name} stars: {this.props.stars}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  enabledButton: {
    width: 300,
    backgroundColor: 'powderblue',
    borderRadius: 25,
    paddingVertical: 13,
    marginVertical: 10,
  },
  disabledButton: {
    width: 300,
    backgroundColor: 'grey',
    borderRadius: 25,
    paddingVertical: 13,
    marginVertical: 10,
  },
  enabledButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
  disabledButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
    textAlign: 'center',
  },
});
