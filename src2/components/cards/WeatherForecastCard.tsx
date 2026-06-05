import React from 'react';

import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { useTheme } from 'react-native-paper';

type Props = {
  day: string;

  temp: string;

  rain: string;

  weather: string;

  active?: boolean;

  onPress?: () => void;
};

const WeatherForecastCard = ({
  day,
  temp,
  rain,
  weather,
  active,
  onPress,
}: Props) => {
  const theme = useTheme<any>();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,

        {
          backgroundColor: active
            ? theme.colors.weatherOverlay
            : theme.colors.weatherCard,

          borderColor: theme.colors.glassBorder,
        },
      ]}
    >
      <Text style={styles.day}>{day}</Text>

      <Text style={styles.icon}>
        {weather === 'Sunny' ? '☀️' : weather === 'Cloudy' ? '☁️' : '🌧️'}
      </Text>

      <Text style={styles.temp}>{temp}</Text>

      <Text style={styles.rain}>🌧️ {rain}</Text>
    </TouchableOpacity>
  );
};

export default WeatherForecastCard;

const styles = StyleSheet.create({
  card: {
    width: 100,

    borderRadius: 24,

    paddingVertical: 10,

    alignItems: 'center',

    marginRight: 14,

    borderWidth: 1,
  },

  day: {
    color: '#fff',

    fontWeight: '700',
  },

  icon: {
    fontSize: 16,

    marginTop: 4,
  },

  temp: {
    marginTop: 4,

    color: '#fff',

    fontSize: 18,

    fontWeight: '900',
  },

  rain: {
    marginTop: 4,

    color: 'rgba(255,255,255,0.7)',

    fontSize: 12,
  },
});
