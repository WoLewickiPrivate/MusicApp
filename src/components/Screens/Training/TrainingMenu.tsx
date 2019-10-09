import React from 'react';
import { ImageBackground, ScrollView, View } from 'react-native';

import MenuButton from '../../Buttons/MenuButton';
import convertMidi from '../../../utils/midiConverter';
import styles from '../../../styles/Menu/MenuMainStyle';

interface Props {
  navigation: Navigation;
}

const song = require('../../../static/sounds/output.json');

export default class Training extends React.Component<Props> {
  render() {
    return (
      <ImageBackground
        source={require('../../../static/backgroundImages/pianoMain.jpg')}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        <View style={styles.container}>
          <MenuButton
            text={`Practice based on your progress`}
            onPress={() =>
              this.props.navigation.navigate('Level', {
                isTraining: true,
                noteSequence: convertMidi(song),
              })
            }
          />
        </View>
      </ImageBackground>
    );
  }
}
