import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  text: string;
}

export default class NoteButton extends React.Component<Props> {
  render() {
    return (
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 300,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    paddingVertical: 13,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
});
