import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';
import {  RectButtonProps } from 'react-native-gesture-handler';
import {
  Container,
  Title
} from './styles';

interface Props extends RectButtonProps{
  title: string;
  color?: string;
  isLoading?: boolean;
  light?: boolean;
}

export function Button({
  title,
  color,
  onPress,
  enabled = true,
  isLoading = false,
  light = false,
}: Props){
  const theme = useTheme();

  return (
    <Container 
      color={color ? color : theme.colors.main} 
      onPress={onPress}
      activeOpacity={0.5}
      underlayColor={color ? color : theme.colors.main}
      enabled={enabled}
      style={{ opacity: (enabled === false || isLoading === true) ? .5 : 1 }}
    >
      {
        isLoading 
        ? <ActivityIndicator color={theme.colors.shape} />
        : <Title light={light}>{title}</Title>      
      }
    </Container>
  );
}