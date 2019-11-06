import React, { Fragment } from 'react';
import { StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

interface Props {
  onPress: () => void;
  disabled: boolean;
  stars: number;
  levelNumber: number;
  name: string;
}

const starJpeg = require('../../static/profilePicture/star.png');

export default class LevelButton extends React.Component<Props> {
  renderLevelStars() {
    return new Array<number>(this.props.stars).fill(0).map((_, index) => {
      return (
        <Fragment key={index}>
          <Image style={{ width: 20, height: 20 }} source={starJpeg} />
        </Fragment>
      );
    });
  }
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
          {this.props.levelNumber}: {this.props.name}
        </Text>
        {this.renderLevelStars()}
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  disabledButton: {
    width: 300,
    backgroundColor: 'grey',
    borderRadius: 25,
    paddingVertical: 13,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
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
