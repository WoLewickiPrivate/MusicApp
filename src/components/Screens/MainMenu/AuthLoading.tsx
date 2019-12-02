import React from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { connect } from 'react-redux';
import { RootReducerState } from '../../../redux/RootReducer';

interface OwnProps {
  navigation: Navigation;
}

type Props = OwnProps & ReduxProps;

class AuthLoadingScreen extends React.Component<Props> {
  componentDidMount() {
    this.tryLogin();
  }

  tryLogin = () => {
    if (this.props.credentials.login && this.props.credentials.password) {
      this.props.navigation.navigate('Main');
    } else {
      this.props.navigation.navigate('Auth');
    }
  };

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

type ReduxProps = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootReducerState) => {
  return {
    credentials: state.credentials.credentials,
  };
};

export default connect(
  mapStateToProps,
  null,
)(AuthLoadingScreen);
