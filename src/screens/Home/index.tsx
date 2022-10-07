import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { BackHandler } from "react-native"
import { useNavigation } from '@react-navigation/native'
import { Ionicons} from "@expo/vector-icons"
import Logo from "../../../assets/logo.svg"
import { Car } from '../../components/CarCard';

import {
  CarList,
  Container, Header, HeaderContent, MyCarsButton, TotalCars
} from './styles';
import { api } from '../../services/api';
import { CarDTO } from '../../dtos/CarDTOS';
import theme from '../../styles/theme';
import { LoadAnimated } from '../../components/LoadAnimated';

export function Home() {
  const navigation = useNavigation<any>()
  const [ cars, setCars ] = useState<CarDTO[]>([])
  const [ isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true
    })

    async function fetchCars(){
      try {
        const response = await api.get('/cars')
        setCars(response.data)
      } catch (error) {
        console.log('error on server -> getCars: ', error)
      }
      setIsLoading(false)
    }

    fetchCars()
  }, [])


  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', { car })
  }

  function handleOpenMyCars(){
    navigation.navigate('MyCars')
  }

  return (
    <Container>
      <StatusBar style="light"/>
      <Header>
        <HeaderContent>
          <Logo 
            width={RFValue(108)} 
            height={RFValue(12)}
          />
          <TotalCars>{isLoading ? '...' : `Total de Carros: ${cars.length}`}</TotalCars>
        </HeaderContent>
      </Header>
      {
        isLoading ? <LoadAnimated/> :
        <CarList 
          data={cars}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Car data={item} onPress={() => handleCarDetails(item)}/>}
        />
      }

    <MyCarsButton 
      activeOpacity={1}
      underlayColor={'#dc1637d2'}    
      onPress={handleOpenMyCars}>
      <Ionicons
        name="ios-car-sport"
        size={32}
        color={theme.colors.shape}
      />
    </MyCarsButton>
    </Container>
  );
}