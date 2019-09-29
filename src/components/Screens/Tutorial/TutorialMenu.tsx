import React, { Fragment } from 'react';
import { Text, View, ImageBackground, ScrollView } from 'react-native';
import styles from '../../../styles/Menu/MenuMainStyle';

import MenuButton from '../../Buttons/MenuButton';

interface Props {
  navigation: Navigation;
}

interface TutorialDesc {
  reqTable: Array<NodeRequire>;
  text: string;
}

interface State {
  images: Array<TutorialDesc>;
}

export default class TutorialMenu extends React.Component<Props, State> {
  state: State = {
    images: new Array(),
  };
  componentDidMount() {
    this.addImageArrays();
  }

  fillWithPictures(): Array<NodeRequire> {
    let reqTable: Array<NodeRequire> = [];
    reqTable.push(
      require(`../../../static/TutorialImages/Tutorial1Images/1.jpg`),
      require(`../../../static/TutorialImages/Tutorial1Images/2.jpg`),
      require(`../../../static/TutorialImages/Tutorial1Images/3.jpg`),
      require(`../../../static/TutorialImages/Tutorial1Images/4.jpg`),
    );
    return reqTable;
  }

  addImageArrays() {
    let newImages: Array<TutorialDesc> = [];
    for (let i = 1; i < 10; i++) {
      const imageArray: NodeRequire[] = this.fillWithPictures();
      newImages.push({ reqTable: imageArray, text: `Lesson ${i}` });
    }
    this.setState({
      images: newImages,
    });
  }

  renderMenuButtons() {
    return this.state.images!.map(imageTable => {
      return (
        <Fragment>
          <MenuButton
            text={imageTable.text}
            onPress={() =>
              this.props.navigation.navigate('Tutorial', {
                images: imageTable.reqTable,
                imgLength: imageTable.reqTable.length,
              })
            }
          />
        </Fragment>
      );
    });
  }

  render() {
    return (
      <ImageBackground
        source={require('../../../static/backgroundImages/pianoMain.jpg')}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        <ScrollView>
          <View style={styles.container}>
            <Text style={{ color: 'red' }}>
              Take the lessons from first to the last. You can always go back to
              them.
            </Text>
            {this.renderMenuButtons()}
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}
