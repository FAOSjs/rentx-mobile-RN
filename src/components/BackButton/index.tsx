import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableHighlight } from 'react-native'
import { BorderlessButtonProps, GestureHandlerRootView } from 'react-native-gesture-handler';

import { useTheme } from 'styled-components';

import {
  Container
} from './styles';

interface Props extends BorderlessButtonProps{
  color?: string;
}

export function BackButton({ color, ...rest }: Props){
  const theme = useTheme();

  return (
    <Container {...rest} activeOpacity={0.2} underlayColor={'#c2c2c2'}>
      <MaterialIcons 
        name="chevron-left"
        size={24}
        under
        color={color ? color : theme.colors.text}      
      />
    </Container>
  );
}