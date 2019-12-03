import React from 'react';
import { ImageBackground, View } from 'react-native';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import styles from '../../../styles/Menu/MenuMainStyle';
import { Credentials } from '../../../redux/CredentialsReducer';

import MenuButton from '../../Buttons/MenuButton';
import { changeCredentials } from '../../../redux/CredentialsActions';

interface OwnProps {
  navigation: Navigation;
}

type Props = OwnProps & ReduxProps;

class Settings extends React.Component<Props> {
  render() {
    return (
      <ImageBackground
        source={require('../../../static/backgroundImages/pianoMain.jpg')}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        <View style={styles.container}>
          <MenuButton
            text={'Logout'}
            onPress={() => {
              this.props.saveCredentials({ login: '', password: '' });
              this.props.navigation.navigate('Auth');
            }}
          />
        </View>
      </ImageBackground>
    );
  }
}

type ReduxProps = ReturnType<typeof mapDispatchToProps>;

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    saveCredentials: (credentials: Credentials) =>
      dispatch(changeCredentials(credentials)),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(Settings);
