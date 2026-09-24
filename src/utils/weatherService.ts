// src/services/weatherService.ts

import axios from 'axios';

const openWeather = axios.create({
  baseURL: 'https://openweathermap.org/data/2.5/',
  timeout: 15000,
});

const accuWeather = axios.create({
  baseURL: 'https://dataservice.accuweather.com',
  timeout: 15000,
});

/**
 * OpenWeather One Call API
 */
export const openweathermapAPI = async (
  latitude: number,
  longitude: number,
) => {
  try {
    const response = await openWeather.get('onecall', {
      params: {
        lat: latitude,
        lon: longitude,
        units: 'metric',
        appid: '439d4b804bc8187953eb36d2a8c26a02',
      },
    });

    return response;
  } catch (error: any) {
    console.log('OpenWeather OneCall Error:', error?.response?.data);
    return error?.response;
  }
};

/**
 * Current Weather API
 */
export const openweathermapLocation = async (
  latitude: number,
  longitude: number,
) => {
  try {
    const response = await openWeather.get('/weather', {
      params: {
        lat: latitude,
        lon: longitude,
        units: 'metric',
        appid: '439d4b804bc8187953eb36d2a8c26a02',
      },
    });

    return response;
  } catch (error: any) {
    console.log('Current Weather Error:', error?.response?.data);
    return error?.response;
  }
};

