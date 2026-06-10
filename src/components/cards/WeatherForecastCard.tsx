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
  weatherType: 'sunny' | 'cloudy' | 'rain';
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
  const getWeatherIcon = (weatherType: 'sunny' | 'cloudy' | 'rain') => {
    switch (weatherType) {
      case 'sunny':
        return 'weather-sunny';

      case 'cloudy':
        return 'weather-cloudy';

      case 'rain':
        return 'weather-rainy';

      default:
        return 'weather-cloudy';
    }
  };
  return (
    <View style={styles.mainCard}>
      {/* LOCATION */}
      <View style={styles.locationRow}>
        <AppIcon
          type="MaterialCommunityIcons"
          name="map-marker"
          size={14}
          color={colors.textLight}
        />
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
            name={getWeatherIcon(selectedForecast.weatherType)}
            size={28}
            color={colors.textLight}
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
                    ? colors.glassActive
                    : colors.cardOverlay,

                  borderColor: active ? colors.glassBorderActive : colors.glass,

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
                name={getWeatherIcon(item.weatherType)}
                size={22}
                color={colors.textLight}
              />

              <Paragraph lineHeight={15} size="lg" style={styles.tempText}>
                {item.temp}
              </Paragraph>

              <View style={styles.rainContainer}>
                <AppIcon
                  type="MaterialCommunityIcons"
                  name="water-percent"
                  size={14}
                  color={colors.textMuted}
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
          color={colors.warning}
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
    borderRadius: 30,
    padding: 15,
    backgroundColor: colors.heroOverlay,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationIcon: {
    fontSize: 12,
  },

  locationText: {
    color: colors.textMuted,
    marginLeft: 6,
    fontSize: 14,
  },

  weatherMainRow: {
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
    backgroundColor: colors.cardOverlay,
    borderRadius: 20,
  },

  weatherItem: {
    flex: 1,
    alignItems: 'center',
  },

  weatherLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },

  weatherValue: {
    marginTop: 3,
    color: colors.textLight,
    fontWeight: '800',
  },

  weatherDivider: {
    width: 1,
    backgroundColor: colors.glassBorderStrong,
  },

  tabsContainer: {
    paddingTop: 5,
  },

  forecastTab: {
    width: 105,
    borderRadius: 24,
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
  },

  tempText: {
    color: colors.textLight,
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
    color: colors.textMuted,
    fontSize: 12,
  },

  quickAdviceContainer: {
    marginTop: 10,
    alignItems: 'flex-start',
    backgroundColor: colors.glassLight,
    flexDirection: 'row',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  quickAdviceText: {
    color: colors.textLight,
    flex: 1,
    marginLeft: 8,
    fontWeight: '600',
  },
});
