import React from 'react';
import { View, Text } from 'react-native';

const WeatherDetailsScreen = ({ route }: any) => {
  const { forecastData, selectedForecast } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Weather Details Screen</Text>
      <Text>{selectedForecast.day}</Text>
      <Text>{selectedForecast.temp}</Text>
    </View>
  );
};

export default WeatherDetailsScreen;
