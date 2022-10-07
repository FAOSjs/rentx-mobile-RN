import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Accessory } from '../../components/Acessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { useNavigation } from '@react-navigation/native'
import { useRoute } from "@react-navigation/native"
import {
  About,
  Accessories,
  Brand,
  CarImages,
  Container, 
  Content, 
  Description, 
  Details, 
  Footer, 
  Header,
  Name,
  Period,
  Price,
  Rent
} from './styles';

import { Button } from '../../components/Button';
import { CarDTO } from '../../dtos/CarDTOS';
import { getAccessoryIcon } from '../../utils/getAcessoryIcon';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { StatusBar, StyleSheet } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import theme from '../../styles/theme';

export function CarDetails() {
  const navigation = useNavigation<any>()
  const route = useRoute()
  const { car } = route.params as { car: CarDTO }

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;    
  });

  const headerStyleAnimation = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, 200],
        [200, 70],
        Extrapolate.CLAMP
      ),
    }
  });

  const sliderCarsStyleAnimation = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, 150],
        [1, 0],
        Extrapolate.CLAMP
      )
    }
  });

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Animated.View
        style={[
          headerStyleAnimation, 
          styles.header,
          { backgroundColor: theme.colors.background_secondary}
        ]}
      >
        <Header>
          <BackButton onPress={() => navigation.goBack()}  />
        </Header>

        <Animated.View style={sliderCarsStyleAnimation}>
          <CarImages>
            <ImageSlider
              imagesUrl={car.photos.map(({id, photo}) => {
                return {
                  id,
                  photo
                }
              })}
            />
          </CarImages>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: getStatusBarHeight() + 160,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Accessories>
          {
            car.accessories.map(accessory => {
              return <Accessory name={accessory.name} key={accessory.type} icon={getAccessoryIcon(accessory.type)}/>
            })
          }
        </Accessories>

        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>
          <Rent>
            <Period>{car.period}</Period>
            <Price>R$ {car.price}</Price>
          </Rent>
        </Details>
        <About>
          {car.about}
        </About>
      </Animated.ScrollView>
      <Footer>
        <Button title='Escolher periodo de aluguel' onPress={() => navigation.navigate('Scheduling', {car})}/>
      </Footer>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    overflow: 'hidden', 
    zIndex: 1,
  },
})