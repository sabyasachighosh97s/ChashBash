import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
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

  loading?: boolean;

  location: string;
};
const WeatherSkeleton = () => {
  const opacity = React.useRef(new Animated.Value(0.35)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.75,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeletonContainer,
        {
          opacity,
        },
      ]}
    >
      {/* Location */}
      <View style={styles.skeletonLocationRow}>
        <View style={styles.skeletonLocationIcon} />
        <View style={styles.skeletonLocationText} />
      </View>

      {/* Temperature */}
      <View style={styles.skeletonMainRow}>
        <View style={styles.skeletonTemperature} />

        <View style={styles.skeletonWeatherRight}>
          <View style={styles.skeletonWeatherIcon} />
          <View style={styles.skeletonWeatherText} />
        </View>
      </View>

      {/* Details */}
      <View style={styles.skeletonDetailsRow}>
        <View style={styles.skeletonDetailItem}>
          <View style={styles.skeletonSmallLabel} />
          <View style={styles.skeletonValue} />
        </View>

        <View style={styles.skeletonDivider} />

        <View style={styles.skeletonDetailItem}>
          <View style={styles.skeletonSmallLabel} />
          <View style={styles.skeletonValue} />
        </View>

        <View style={styles.skeletonDivider} />

        <View style={styles.skeletonDetailItem}>
          <View style={styles.skeletonSmallLabel} />
          <View style={styles.skeletonValue} />
        </View>
      </View>

      {/* Forecast days */}
      <View style={styles.skeletonTabsContainer}>
        {[1, 2, 3].map(item => (
          <View key={item} style={styles.skeletonForecastTab}>
            <View style={styles.skeletonDay} />

            <View style={styles.skeletonTabIcon} />

            <View style={styles.skeletonTabTemp} />

            <View style={styles.skeletonRain} />
          </View>
        ))}
      </View>
    </Animated.View>
  );
};
const WeatherForecastCard = ({
  forecastData,
  selectedForecast,
  setSelectedForecast,
  loading = false,
  location,
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
      {loading || !selectedForecast ? (
        <WeatherSkeleton />
      ) : (
        <>
          {/* LOCATION */}

          <View style={styles.headerRow}>
            <View style={styles.locationRow}>
              <AppIcon
                type="MaterialCommunityIcons"
                name="map-marker"
                size={14}
                color={colors.textLight}
              />

              <Paragraph size="md" style={styles.locationText} lineHeight={20}>
                {location},ভারত
              </Paragraph>
            </View>
          </View>

          {/* TEMP SECTION */}

          <View style={styles.weatherMainRow}>
            <Paragraph size="lg" lineHeight={36} style={styles.temperature}>
              {selectedForecast.temp}
            </Paragraph>

            <View style={styles.weatherRight}>
              <AppIcon
                type="MaterialCommunityIcons"
                name={getWeatherIcon(selectedForecast.weatherType)}
                size={28}
                color={colors.textLight}
              />

              <Paragraph
                size="sm"
                lineHeight={20}
                style={styles.weatherCondition}
              >
                {selectedForecast.weather}
              </Paragraph>
            </View>
          </View>

          {/* DETAILS */}

          <View style={styles.weatherDetailsRow}>
            <View style={styles.weatherItem}>
              <Paragraph size="sm" lineHeight={18} style={styles.weatherLabel}>
                {t('humidity')}
              </Paragraph>

              <Paragraph size="sm" lineHeight={20} style={styles.weatherValue}>
                {selectedForecast.humidity}
              </Paragraph>
            </View>

            <View style={styles.weatherDivider} />

            <View style={styles.weatherItem}>
              <Paragraph size="sm" lineHeight={18} style={styles.weatherLabel}>
                {t('precipitation')}
              </Paragraph>

              <Paragraph size="sm" lineHeight={20} style={styles.weatherValue}>
                {selectedForecast.rainfall}
              </Paragraph>
            </View>

            <View style={styles.weatherDivider} />

            <View style={styles.weatherItem}>
              <Paragraph size="sm" lineHeight={18} style={styles.weatherLabel}>
                {t('wind_speed')}
              </Paragraph>

              <Paragraph size="sm" lineHeight={20} style={styles.weatherValue}>
                {selectedForecast.wind}
              </Paragraph>
            </View>
          </View>

          {/* FORECAST TABS */}

          <View style={styles.tabsContainer}>
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

                      borderColor: active
                        ? colors.glassBorderActive
                        : colors.glass,

                      transform: [
                        {
                          scale: active ? 1.04 : 1,
                        },
                      ],
                    },
                  ]}
                >
                  <Paragraph lineHeight={20} size="sm" style={styles.dayText}>
                    {item.day}
                  </Paragraph>

                  <AppIcon
                    type="MaterialCommunityIcons"
                    name={getWeatherIcon(item.weatherType)}
                    size={22}
                    color={colors.textLight}
                  />

                  <Paragraph lineHeight={25} size="lg" style={styles.tempText}>
                    {item.temp}
                  </Paragraph>

                  <View style={styles.rainContainer}>
                    <AppIcon
                      type="MaterialCommunityIcons"
                      name="water-percent"
                      size={14}
                      color={colors.textMuted}
                    />

                    <Paragraph
                      size="xs"
                      lineHeight={18}
                      style={styles.rainText}
                    >
                      {item.rain}
                    </Paragraph>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
};

export default WeatherForecastCard;

const styles = StyleSheet.create({
  mainCard: {
    marginHorizontal: 15,
    borderRadius: 30,
    padding: 15,
    backgroundColor: '#0000006d',
    minHeight: 280,
    maxHeight: 280,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 20,
  },

  locationText: {
    color: colors.textMuted,
    marginLeft: 6,
  },

  weatherMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
    paddingVertical: 3,
  },

  temperature: {
    color: colors.textLight,
    fontSize: 30,
    fontWeight: '900',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  weatherRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minHeight: 48,
  },

  weatherCondition: {
    marginTop: 3,
    color: colors.textLight,
    fontWeight: '700',
  },

  weatherDetailsRow: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#00000090',
    borderRadius: 20,
    minHeight: 48,
    paddingVertical: 5,
  },

  weatherItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 38,
  },

  weatherLabel: {
    color: colors.textMuted,
    includeFontPadding: false,
  },

  weatherValue: {
    marginTop: 1,
    color: colors.textLight,
    fontWeight: '800',
    includeFontPadding: false,
  },

  weatherDivider: {
    width: 1,
    backgroundColor: colors.glassBorderStrong,
    marginVertical: 4,
  },

  tabsContainer: {
    flexDirection: 'row',
    width: '100%',
  },

  forecastTab: {
    flex: 1,
    minWidth: 0,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 4,
    borderWidth: 1,
  },

  dayText: {
    color: colors.textLight,
    fontWeight: '700',
    includeFontPadding: false,
  },

  tempText: {
    color: colors.textLight,
    fontSize: 20,
    fontWeight: '900',
    includeFontPadding: false,
  },

  rainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    minHeight: 18,
  },

  rainText: {
    marginLeft: 4,
    color: colors.textMuted,
    fontSize: 12,
    includeFontPadding: false,
  },

  quickAdviceContainer: {
    marginTop: 10,
    alignItems: 'flex-start',
    backgroundColor: colors.glassLight,
    flexDirection: 'row',
    borderRadius: 18,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },

  quickAdviceText: {
    color: colors.textLight,
    flex: 1,
    marginLeft: 8,
    fontWeight: '600',
  },

  skeletonContainer: {
    width: '100%',
  },

  skeletonLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 20,
  },

  skeletonLocationIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.glassMedium,
  },

  skeletonLocationText: {
    width: 110,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.glassMedium,
    marginLeft: 8,
  },

  skeletonMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 70,
    paddingVertical: 8,
  },

  skeletonTemperature: {
    width: 80,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.glassMedium,
  },

  skeletonWeatherRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  skeletonWeatherIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.glassMedium,
  },

  skeletonWeatherText: {
    width: 75,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.glassMedium,
    marginTop: 6,
  },

  skeletonDetailsRow: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#00000090',
    borderRadius: 20,
    minHeight: 48,
    paddingVertical: 5,
  },

  skeletonDetailItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  skeletonSmallLabel: {
    width: 48,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.glassMedium,
  },

  skeletonValue: {
    width: 60,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.glassMedium,
    marginTop: 6,
  },

  skeletonDivider: {
    width: 1,
    backgroundColor: colors.glassBorderStrong,
    marginVertical: 4,
  },

  skeletonTabsContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: 5,
  },

  skeletonForecastTab: {
    flex: 1,
    minWidth: 0,
    height: 145,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.cardOverlay,
    paddingVertical: 10,
  },

  skeletonDay: {
    width: 55,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.glassMedium,
  },

  skeletonTabIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.glassMedium,
  },

  skeletonTabTemp: {
    width: 45,
    height: 20,
    borderRadius: 8,
    backgroundColor: colors.glassMedium,
  },

  skeletonRain: {
    width: 35,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.glassMedium,
  },
});
