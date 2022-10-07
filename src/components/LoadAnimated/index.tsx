import React from 'react';

import loadingCar from '../../../assets/load_car.json'

import {
  Container
} from './styles';

import LottieView from 'lottie-react-native'

export function LoadAnimated() {
  return (
    <Container>
      <LottieView
        style={{height: 200}}
        resizeMode='contain'
        source={loadingCar}
        autoPlay
        loop
      />
    </Container>
  );
}