import React, { Fragment } from 'react';
import { Text, View, ImageBackground, ScrollView } from 'react-native';
import styles from '../../../styles/Menu/MenuMainStyle';

import MenuButton from '../../Buttons/MenuButton';

interface Props {
  navigation: Navigation;
}

export default class TutorialMenu extends React.Component<Props> {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <ImageBackground
        source={require('../../../static/backgroundImages/pianoMain.jpg')}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        <View style={styles.container}>
          <MenuButton text="Note quiz" onPress={() => navigate('Tutorial')} />
        </View>
      </ImageBackground>
    );
  }
}
