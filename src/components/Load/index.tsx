import React from 'react';
import theme from '../../styles/theme';

import {ActivityIndicator} from "react-native"

export function Load() {
  return (
    <ActivityIndicator 
      color={theme.colors.main}
      size="large"
      style={{flex: 1}}
    />
 );
}