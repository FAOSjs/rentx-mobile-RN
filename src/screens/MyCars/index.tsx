import React, { useEffect, useState } from 'react';
import { StatusBar, FlatList } from 'react-native';
import { BackButton } from '../../components/BackButton';
import { Car } from '../../components/CarCard';
import { CarDTO } from '../../dtos/CarDTOS';
import { useNavigation } from '@react-navigation/native'
import { useTheme } from 'styled-components';
import { api } from '../../services/api';
import { AntDesign } from '@expo/vector-icons';

import {
  Header,
  Appointments,
  AppointmentsQuantity,
  AppointmentsTitle,
  CarFooter,
  CarFooterDate,
  CarFooterPeriod,
  CarFooterTitle,
  CarWrapper,
  Container, Content, SubTitle, Title
} from './styles';
import { Load } from '../../components/Load';
import { LoadAnimated } from '../../components/LoadAnimated';

interface CarProps {
  id: string;
  user_id: string;
  car: CarDTO;
  startDate: string;
  endDate: string;
}


export function MyCars() {
  const [ cars, setCars ] = useState<CarProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const theme = useTheme();
  const navigation = useNavigation<any>()

  useEffect(() => {
    async function fetchCars(){
      try {
        const response = await api.get('/schedules_byuser?use_id=1')

        setCars(response.data)
      } catch (error) {
        console.log(error)
      }

      setIsLoading(false)
    }
    fetchCars()
  }, [])

  return (
    <Container>
      <Header>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <BackButton
          onPress={() => navigation.goBack()} 
          color={theme.colors.shape}
        />

        <Title>
          Seus agendamentos. {'\n'}
          Agradecemos a {'\n'}
          preferência
        </Title>

        <SubTitle>
          Conforto, segurança e praticidade.
        </SubTitle>
      </Header>
      { 
        isLoading ? <LoadAnimated/> :
        <Content>
          <Appointments>
            <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
            <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
          </Appointments>

          <FlatList
            data={cars}
            keyExtractor={item => String(item.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <CarWrapper>
                <Car data={item.car} />
                <CarFooter>
                  <CarFooterTitle>Período</CarFooterTitle>
                  <CarFooterPeriod>
                    <CarFooterDate>{item.startDate}</CarFooterDate>
                    <AntDesign 
                      name="arrowright"
                      size={20}
                      color={theme.colors.title}
                      style={{ marginHorizontal: 10 }}
                    />
                    <CarFooterDate>{item.endDate}</CarFooterDate>
                  </CarFooterPeriod>
                </CarFooter>
              </CarWrapper>
            )}
          /> 
        </Content>
      }
    </Container>
  );
}