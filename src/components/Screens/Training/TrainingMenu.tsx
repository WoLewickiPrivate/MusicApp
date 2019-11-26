import React from 'react';
import { ImageBackground, View } from 'react-native';

import MenuButton from '../../Buttons/MenuButton';
import { getLevelNotes } from '../../../utils/midiConverter';
import styles from '../../../styles/Menu/MenuMainStyle';
import { getToken } from '../../../networking/ServerConnector';

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
            onPress={async () => {
              const token = await getToken();
              const noteSequence = await getLevelNotes(0, token);
              this.props.navigation.navigate('Level', {
                isTraining: true,
                noteSequence,
              });
            }}
          />
        </View>
      </ImageBackground>
    );
  }
}
