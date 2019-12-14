import React from 'react';
import { Animated } from 'react-native';
import { Sequence, getLevelNotes } from '../../../utils/midiConverter';

interface Props {
  notes: Sequence;
}

interface State {
  movingVal: Animated.Value;
}

class Game extends React.Component<Props, State> {
  state: State = {
    movingVal: new Animated.Value(0),
  };
}
