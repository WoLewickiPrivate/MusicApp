import React, { Component } from 'react';
import { Button, Text } from 'react-native';
import Modal, {
  ModalTitle,
  ModalContent,
  ScaleAnimation,
  // @ts-ignore
} from 'react-native-modals';

import { Sequence } from '../../../utils/midiConverter';

interface Props {
  navigation: Navigation;
  visible: boolean;
  levelStars: number;
  levelNumber: number;
  song: Sequence;
  isTraining: boolean;
  startAgain: () => void;
  goBack: () => void;
  doTraining: () => void;
}

interface State {
  visible: boolean;
}

export default class EndGamePopup extends Component<Props, State> {
  state: State = {
    visible: this.props.visible,
  };
  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.visible != state.visible) {
      return {
        visible: props.visible,
      };
    }
    return null;
  }

  render() {
    return (
      <Modal
        width={0.9}
        visible={this.state.visible}
        modalAnimation={new ScaleAnimation()}
        modalTitle={
          <ModalTitle
            title="You finished level! Well done!"
            hasTitleBar={true}
          />
        }
      >
        <ModalContent style={{ paddingTop: 10 }}>
          {!this.props.isTraining && (
            <Text style={{ alignSelf: 'center', fontSize: 20 }}>
              You gained {this.props.levelStars} stars!
            </Text>
          )}
          <Button
            title="Go back to menu"
            onPress={() => {
              this.props.goBack();
            }}
          />
          <Button
            title="Restart level"
            onPress={() => {
              this.props.startAgain();
            }}
          />
          <Button
            title="Train weak elements with different notes"
            onPress={() => {
              this.setState({ visible: false });
              this.props.doTraining();
            }}
          />
        </ModalContent>
      </Modal>
    );
  }
}
