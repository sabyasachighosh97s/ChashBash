import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Paragraph } from '@components/ui';
import AppIcon from '@components/AppIcon/AppIcon';
import colors from '@themes/colors';

type ForecastItem = {
  day: string;
  temp: string;
  rain: string;
  weather: string;

  humidity: string;
  rainfall: string;
  wind: string;

  irrigation: string;
  fertilizer: string;
  pesticide: string;
};

type Props = {
  forecastData: ForecastItem[];

  selectedForecast: ForecastItem;

  setSelectedForecast: (item: ForecastItem) => void;
};

const WeatherForecastCard = ({
  forecastData,
  selectedForecast,
  setSelectedForecast,
}: Props) => {
  const { t } = useTranslation();
  return (
    <View style={styles.mainCard}>
      {/* LOCATION */}
      <View style={styles.locationRow}>
        <AppIcon
          type="MaterialCommunityIcons"
          name="map-marker"
          size={14}
          color="#FFFFFF"
        />{' '}
        <Paragraph size="sm" style={styles.locationText}>
          Kolkata, India
        </Paragraph>
      </View>

      {/* TEMP SECTION */}
      <View style={styles.weatherMainRow}>
        <Paragraph style={styles.temperature}>
          {selectedForecast.temp}
        </Paragraph>
        <View style={styles.weatherRight}>
          <AppIcon
            type="MaterialCommunityIcons"
            name={
              selectedForecast.weather === 'Sunny'
                ? 'weather-sunny'
                : selectedForecast.weather === 'Cloudy'
                ? 'weather-cloudy'
                : 'weather-rainy'
            }
            size={28}
            color="#FFFFFF"
          />

          <Paragraph size="sm" style={styles.weatherCondition}>
            {selectedForecast.weather}
          </Paragraph>
        </View>
      </View>

      {/* DETAILS */}
      <View style={styles.weatherDetailsRow}>
        <View style={styles.weatherItem}>
          <Paragraph size="xs" lineHeight={20} style={styles.weatherLabel}>
            {t('humidity')}
          </Paragraph>

          <Paragraph size="sm" lineHeight={15} style={styles.weatherValue}>
            {selectedForecast.humidity}
          </Paragraph>
        </View>

        <View style={styles.weatherDivider} />

        <View style={styles.weatherItem}>
          <Paragraph size="xs" lineHeight={20} style={styles.weatherLabel}>
            {t('precipitation')}
          </Paragraph>

          <Paragraph size="sm" lineHeight={15} style={styles.weatherValue}>
            {selectedForecast.rainfall}
          </Paragraph>
        </View>

        <View style={styles.weatherDivider} />

        <View style={styles.weatherItem}>
          <Paragraph size="xs" lineHeight={20} style={styles.weatherLabel}>
            {t('wind_speed')}
          </Paragraph>

          <Paragraph size="sm" lineHeight={15} style={styles.weatherValue}>
            {selectedForecast.wind}
          </Paragraph>
        </View>
      </View>

      {/* FORECAST TABS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {forecastData.map(item => {
          const active = selectedForecast.day === item.day;

          return (
            <TouchableOpacity
              key={item.day}
              activeOpacity={0.9}
              onPress={() => setSelectedForecast(item)}
              style={[
                styles.forecastTab,

                {
                  backgroundColor: active
                    ? 'rgba(255,255,255,0.28)'
                    : 'rgba(17,8,8,0.27)',

                  borderColor: active
                    ? 'rgba(255,255,255,0.4)'
                    : 'rgba(255,255,255,0.08)',

                  transform: [
                    {
                      scale: active ? 1.04 : 1,
                    },
                  ],
                },
              ]}
            >
              <Paragraph lineHeight={20} size="xs" style={styles.dayText}>
                {item.day}
              </Paragraph>

              <AppIcon
                type="MaterialCommunityIcons"
                name={
                  item.weather === 'Sunny'
                    ? 'weather-sunny'
                    : item.weather === 'Cloudy'
                    ? 'weather-cloudy'
                    : 'weather-rainy'
                }
                size={22}
                color="#FFFFFF"
              />

              <Paragraph lineHeight={15} size="lg" style={styles.tempText}>
                {item.temp}
              </Paragraph>

              <View style={styles.rainContainer}>
                <AppIcon
                  type="MaterialCommunityIcons"
                  name="water-percent"
                  size={14}
                  color="rgba(255,255,255,0.75)"
                />

                <Paragraph size="xs" style={styles.rainText}>
                  {item.rain}
                </Paragraph>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* QUICK ADVICE */}
      <View style={styles.quickAdviceContainer}>
        <AppIcon
          type="MaterialCommunityIcons"
          name="lightbulb-on-outline"
          size={25}
          color="#F59E0B"
        />

        <Paragraph size="base" style={styles.quickAdviceText}>
          {selectedForecast.irrigation}
        </Paragraph>
      </View>
    </View>
  );
};

export default WeatherForecastCard;

const styles = StyleSheet.create({
  mainCard: {
    marginHorizontal: 15,
    // marginTop: 10,

    borderRadius: 30,

    padding: 15,

    backgroundColor: 'rgba(0,0,0,0.12)',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationIcon: {
    fontSize: 12,
  },

  locationText: {
    color: 'rgba(255,255,255,0.85)',
    marginLeft: 6,
    fontSize: 14,
  },

  weatherMainRow: {
    // marginTop: 8,

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  temperature: {
    color: colors.textLight,
    fontSize: 30,

    fontWeight: '900',
  },

  weatherRight: {
    alignItems: 'flex-end',
  },

  weatherIcon: {
    fontSize: 22,
  },

  weatherCondition: {
    marginTop: 4,

    color: colors.textLight,

    fontWeight: '700',
  },

  weatherDetailsRow: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'row',

    justifyContent: 'space-between',

    backgroundColor: 'rgba(17,8,8,0.28)',

    borderRadius: 20,

    // paddingVertical: 8,
  },

  weatherItem: {
    flex: 1,
    alignItems: 'center',
  },

  weatherLabel: {
    color: 'rgba(255,255,255,0.65)',

    fontSize: 11,
  },

  weatherValue: {
    marginTop: 3,

    color: colors.textLight,

    fontWeight: '800',
  },

  weatherDivider: {
    width: 1,

    backgroundColor: 'rgba(208, 196, 196, 0.63)',
  },

  tabsContainer: {
    paddingTop: 5,
  },

  forecastTab: {
    width: 105,

    borderRadius: 24,

    // paddingVertical: 8,
    alignItems: 'center',

    marginRight: 12,

    borderWidth: 1,
  },

  dayText: {
    color: colors.textLight,

    fontWeight: '700',

    fontSize: 13,
  },

  iconText: {
    fontSize: 18,

    // marginTop: 5,
  },

  tempText: {
    // marginTop: 5,

    color: '#fff',

    fontSize: 20,

    fontWeight: '900',
  },

  rainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  rainText: {
    marginLeft: 4,
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
  },

  quickAdviceContainer: {
    marginTop: 10,
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    flexDirection: 'row',
    borderRadius: 18,

    paddingVertical: 8,

    paddingHorizontal: 12,
  },

  quickAdviceText: {
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 8,
    fontWeight: '600',
  },
});
