import React from 'react';
import { View, ImageBackground } from 'react-native';
import styles from '../../../styles/Menu/MenuMainStyle';

import MenuButton from '../../Buttons/MenuButton';

interface Props {
  navigation: Navigation;
}

export default class MenuScreen extends React.Component<Props> {
  backgroundImage: any;
  componentWillMount() {
    this.backgroundImage = require('../../../static/backgroundImages/pianoMain.jpg');
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <ImageBackground
        source={this.backgroundImage}
        style={{ width: '100%', height: '100%' }}
      >
        <View style={styles.container}>
          <MenuButton
            text="Easy levels"
            onPress={() => navigate('StartGameMenu', { difficulty: 'Easy' })}
          />
          <MenuButton
            text="Medium levels"
            onPress={() => navigate('StartGameMenu', { difficulty: 'Medium' })}
          />
          <MenuButton
            text="Difficult levels"
            onPress={() =>
              navigate('StartGameMenu', { difficulty: 'Difficult' })
            }
          />
        </View>
      </ImageBackground>
    );
  }
}
