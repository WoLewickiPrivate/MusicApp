import React from 'react';
import { ImageBackground } from 'react-native';

import MenuButton from '../../Buttons/MenuButton';

interface Props {
  navigation: Navigation;
}

export default class Training extends React.Component<Props> {
  render() {
    return (
      <ImageBackground
        source={require('../../../static/backgroundImages/pianoMain.jpg')}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        <MenuButton
          text={`Practice based on your progress`}
          onPress={() =>
            this.props.navigation.navigate('Level', {
              isTraining: true,
              noteSequence: {
                notes: [{ start: 0, end: 1, pitch: 60 }],
                totalDuration: 1.5,
              },
            })
          }
        />
      </ImageBackground>
    );
  }
}
