import React, { Fragment } from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';

interface Props {
  onPress: () => void;
  stars: number;
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
      <TouchableOpacity style={styles.button} onPress={this.props.onPress}>
        <Text style={styles.buttonText}>{this.props.name}</Text>
        <View style={{ flexDirection: 'row', marginRight: 30 }}>
          {this.renderLevelStars()}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 300,
    backgroundColor: 'powderblue',
    borderRadius: 25,
    paddingVertical: 13,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'left',
    marginLeft: 30,
  },
});
