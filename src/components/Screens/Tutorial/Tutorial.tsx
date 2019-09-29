import React from 'react';
import { Image, Text, View } from 'react-native';

import TutorialButton from '../../Buttons/TutorialButton';
import TutorialTexts from '../../../styles/Texts/TutorialTexts';

interface Props {
  navigation: Navigation;
}

interface State {
  pictureIndex: number;
}

export default class Tutorial extends React.Component<Props, State> {
  state: State = {
    pictureIndex: 0,
  };
  imgLength: number = this.props.navigation.getParam('imgLength', 0);
  images: any = this.props.navigation.getParam('images', []);

  nextPicture = () => {
    if (this.state.pictureIndex < this.imgLength - 1) {
      if (this.state.pictureIndex === this.imgLength - 2) {
        this.setState({ pictureIndex: this.state.pictureIndex + 1 });
      } else {
        this.setState({ pictureIndex: this.state.pictureIndex + 1 });
      }
    }
  };

  previousPicture = () => {
    if (this.state.pictureIndex > 0) {
      this.setState({ pictureIndex: this.state.pictureIndex - 1 });
    }
  };

  render() {
    const { navigation } = this.props;
    return (
      <View>
        <View
          style={{
            height: '20%',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <Text style={TutorialTexts.text}>
            Slides left: {this.imgLength - this.state.pictureIndex - 1}
          </Text>
        </View>
        <Image
          source={this.images[this.state.pictureIndex]}
          style={{ width: '100%', height: '70%' }}
        />
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'flex-end',
            height: '10%',
          }}
        >
          <TutorialButton
            disabled={this.state.pictureIndex === 0}
            text="Previous"
            onPress={() => this.previousPicture()}
          />
          <TutorialButton
            disabled={this.state.pictureIndex !== this.imgLength - 1}
            text="Finish"
            onPress={() => navigation.goBack()}
          />
          <TutorialButton
            disabled={this.state.pictureIndex === this.imgLength - 1}
            text="Next"
            onPress={() => this.nextPicture()}
          />
        </View>
      </View>
    );
  }
}
