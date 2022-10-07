import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Accessory } from '../../components/Acessory';
import { BackButton } from '../../components/BackButton';
import { Feather } from '@expo/vector-icons';
import { ImageSlider } from '../../components/ImageSlider';
import { useNavigation, useRoute } from '@react-navigation/native'

import {
  Accessories,
  Brand,
  CalendarIcon,
  CarImages,
  Container, 
  Content, 
  DateInfo, 
  DateTitle, 
  DateValue, 
  Description, 
  Details, 
  Footer, 
  Header,
  Name,
  Period,
  Price,
  Rent,
  RentalPeriod,
  RentalPrice,
  RentalPriceDetails,
  RentalPriceLabel,
  RentalPriceQuota,
  RentalPriceTotal
} from './styles';

import { Button } from '../../components/Button';
import theme from '../../styles/theme';
import { StatusBar } from 'react-native';
import { CarDTO } from '../../dtos/CarDTOS';
import { getAccessoryIcon } from '../../utils/getAcessoryIcon';
import { RFValue } from 'react-native-responsive-fontsize';
import { format } from 'date-fns';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { api } from '../../services/api';

interface Params {
  car: CarDTO;
  dates: string[];
}

interface RentalPeriod {
  start: string;
  end: string; 
}

export function SchedulingDetails() {
  const [isLoading, setLoading] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);
  
  
  const route = useRoute();
  const { car, dates } = route.params as Params;
  const navigation = useNavigation<any>()
  const rentalTotal = dates.length * car.price
  const rentalTotalFormatted = function(){
    let rentalTotalFormatted = rentalTotal.toString().replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    if(!rentalTotalFormatted.includes(",")) rentalTotalFormatted = rentalTotalFormatted + ",00"

    return rentalTotalFormatted;
  }();
  
  async function handleConfirmRental() {
    setLoading(true);

    try {
      const scheduleByCar = await api.get(`/schedules_bycars/${car.id}`)
      const unavailable_dates = [
        ...scheduleByCar.data.unavailable_dates,
        ...dates
      ]
  
      await api.put(`/cars/${car.id}`, {
        id: car.id,
        unavailable_dates
      })
  
  
      await api.post('/users', {      
        user_id: 1,
        car
      })

      navigation.navigate('Confirmation', {
        nextScreenRoute: 'Home',
        title: 'Carro alugado!',
        message: `Agora você só precisa ir\naté a concessionária da RENTX\npegar o seu automóvel.`
      })
      
    } catch (error) {
      console.log(error)
      alert('Não foi possível confirmar o agendamento.')  
    }
    setLoading(false);
  }

  useEffect(() => {
    setRentalPeriod({
      start: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
      end:  format(getPlatformDate(new Date(dates[dates.length - 1])), 'dd/MM/yyyy'),
    })
  },[])

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Header>
        <BackButton onPress={() => navigation.goBack()}/>
      </Header>
      <CarImages>
        <ImageSlider
          imagesUrl={car.photos.map(({id,photo}) => {
            return {
              id,
              photo
            }
          })}
        />
      </CarImages>
        
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 24, alignItems: 'center'}}>
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
        <Accessories>
        {
          car.accessories.map(accessory => {
            return <Accessory name={accessory.name} key={accessory.type} icon={getAccessoryIcon(accessory.type)}/>
          })
        }
        </Accessories>

        <RentalPeriod>
          <CalendarIcon>
            <Feather 
              name="calendar"
              size={RFValue(24)}
              color={theme.colors.shape}
            />
          </CalendarIcon>

          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.start}</DateValue>
          </DateInfo>

          <Feather 
              name="chevron-right"
              size={RFValue(10)}
              color={theme.colors.text}
          />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue>{rentalPeriod.end}</DateValue>
          </DateInfo>
        </RentalPeriod>

        <RentalPrice>
          <RentalPriceLabel>TOTAL</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>{`R$ ${car.price} x ${dates.length} diárias`}</RentalPriceQuota>
            <RentalPriceTotal>R$ {rentalTotalFormatted}</RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>
      </ScrollView>
      <Footer>
        <Button 
          title='Alugar agora' 
          isLoading={isLoading}
          enabled={!isLoading}
          color={theme.colors.success} 
          onPress={handleConfirmRental}/>
      </Footer>
    </Container>
  );
}