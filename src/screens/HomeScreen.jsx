import React, { useState } from 'react';

import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { COLORS } from '../../theme';

import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import GlassCard from '@components/common/GlassCard';

import SectionHeader from '@components/common/SectionHeader';

import ScreenContainer from '@components/common/ScreenContainer';

import MandiCard from '@components/cards/MandiCard';

import WeatherForecastCard from '@components/cards/WeatherForecastCard';
const HomeScreen = () => {
 const { t } = useTranslation();
 
  // const navigation = useNavigation<any>(); 
  
  /*
  =====================================
  API READY STRUCTURE
  =====================================

  Later you can replace:
  weatherData => api.weather
  dashboardModules => api.modules

  No UI logic needs changing later.
  */

  const weatherData = {
    current: {
      temp: '32°C',
      status: t('sunny'),
      humidity: '65%',
      wind: '12 km/h',
      uv: t('high'),
    },

    forecast: [
      {
        day: t('today'),
        temp: '32°',
        weather: t('sunny'),
        rain: '10%',
      },

      {
        day: t('tomorrow'),
        temp: '30°',
        weather: t('cloudy'),
        rain: '35%',
      },

      {
        day: t('day_after'),
        temp: '28°',
        weather: t('rain'),
        rain: '70%',
      },
    ],
  };

  /*
  =====================================
  BUSINESS MODULES
  =====================================
  */

  const dashboardModules = [
    {
      id: 'carbon',

      title: t('carbon'),

      type: 'carbon',

      color: '#2E7D32',

      data: {
        title: t('carbon_title'),

        description: t('carbon_desc'),

        cards: [
          {
            label: 'AWD',

            value: '₹ 3,200 / acre / season',
          },

          {
            label: 'Biochar',

            value: '₹ 4,800 / acre / season',
          },
        ],
      },
    },

    {
      id: 'mandi',

      title: t('mandi_rate'),

      type: 'mandi',

      color: '#FB8C00',

      data: {
        title: t('mandi_title'),

        description: t('mandi_desc'),

        rates: [
          {
            crop: t('paddy'),

            market: t('barasat'),

            price: '₹ 2,340 / q',
          },

          {
            crop: t('potato'),

            market: t('kolkata'),

            price: '₹ 1,850 / q',
          },

          {
            crop: t('wheat'),

            market: t('burdwan'),

            price: '₹ 2,520 / q',
          },

          {
            crop: t('onion'),

            market: t('howrah'),

            price: '₹ 2,100 / q',
          },
        ],
      },
    },

    {
      id: 'camera',

      title: t('ডা. কিউব'),

      type: 'camera',

      color: '#1565C0',

      data: {
        title: t('scan_crop_disease'),

        description: t('camera_desc'),

        buttonText: t('open_camera'),
      },
    },
  ];

  const [selectedForecast, setSelectedForecast] = useState(
    weatherData.forecast[0],
  );

  const [selectedModule, setSelectedModule] = useState(dashboardModules[0]);

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ScreenContainer style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {/* =========================================
              HERO SECTION
          ========================================= */}

      <ImageBackground
  source={require('../assets/images/weather.png')}
  resizeMode="cover"
  style={styles.heroSection}
  imageStyle={styles.heroBackgroundImage}
>
            {/* TOP HEADER */}

            <View style={styles.topHeader}>
              <View style={styles.profileContainer}>
                <Image
                  source={require('../assets/images/farmer.jpg')}
                  style={styles.profileImage}
                />

                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.headerTitle}>{t('hello_user')}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => navigation.navigate('HomeScreen2')}
              >
                <Text style={styles.notificationIcon}>➜</Text>
              </TouchableOpacity>
            </View>

            {/* WEATHER GLASS CARD */}

            <View style={styles.weatherGlassCard}>
              {/* LOCATION */}

              <View style={styles.locationRow}>
                <Text style={styles.locationIcon}>📍</Text>

                <Text style={styles.locationText}>{t('new_york_city')}</Text>
              </View>

              {/* WEATHER ROW */}

              <View style={styles.weatherMainRow}>
                {/* LEFT */}

                <View>
                  <Text style={styles.temperature}>
                    {selectedForecast.temp}
                  </Text>
                </View>

                {/* RIGHT */}

                <View style={styles.weatherRight}>
                  <Text style={styles.weatherCloud}>
                    {selectedForecast.weather === t('sunny')
                      ? '☀️'
                      : selectedForecast.weather === t('cloudy')
                      ? '☁️'
                      : '🌧️'}
                  </Text>

                  <Text style={styles.weatherCondition}>
                    {selectedForecast.weather}
                  </Text>

                  <Text style={styles.weatherDate}>{t('weather_date')}</Text>
                </View>
              </View>

              {/* WEATHER DETAILS */}

              <View style={styles.weatherDetailsRow}>
                <View style={styles.weatherItem}>
                  <Text style={styles.weatherItemLabel}>{t('humidity')}</Text>
                  <Text style={styles.weatherItemValue}>85%</Text>
                </View>

                <View style={styles.weatherDivider} />

                <View style={styles.weatherItem}>
                  <Text style={styles.weatherItemLabel}>
                    {t('precipitation')}
                  </Text>
                  <Text style={styles.weatherItemValue}>8 mm</Text>
                </View>

                <View style={styles.weatherDivider} />

                <View style={styles.weatherItem}>
                  <Text style={styles.weatherItemLabel}>{t('wind_speed')}</Text>

                  <Text style={styles.weatherItemValue}>13 km/h</Text>
                </View>
              </View>

              {/* FORECAST */}

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.forecastContainer}
              >
                {weatherData.forecast.map(item => {
                  const isSelected = selectedForecast.day === item.day;

                  return (
<WeatherForecastCard
  key={item.day}
  day={item.day}
  temp={item.temp}
  rain={item.rain}
  weather={item.weather}
  active={isSelected}
  onPress={() =>
    setSelectedForecast(item)
  }
/>
                  );
                })}
              </ScrollView>
            </View>
</ImageBackground>
          {/* =========================================
              MODULE TABS
          ========================================= */}

          <View style={styles.tabContainer}>
            {dashboardModules.map(module => {
              const isActive = selectedModule.id === module.id;

              return (
                <TouchableOpacity
                  key={module.id}
                  activeOpacity={0.9}
                  onPress={() => setSelectedModule(module)}
                  style={[
                    styles.tabButton,
                    isActive && {
                      backgroundColor: module.color,
                    },
                  ]}
                >
                  <Text
                    style={[styles.tabText, isActive && styles.activeTabText]}
                  >
                    {module.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* =========================================
              DYNAMIC MODULE CARD
          ========================================= */}

          <View style={styles.dynamicCard}>
            <Text style={styles.dynamicTitle}>{selectedModule.data.title}</Text>

            <Text style={styles.dynamicDescription}>
              {selectedModule.data.description}
            </Text>

            {/* CARBON */}

            {selectedModule.type === 'carbon' && (
              <View style={styles.carbonWrapper}>
                {/* HEADER */}

                {/* CARDS */}

                <View style={styles.carbonCardsRow}>
                  {/* AWD */}

                  <View style={styles.awdCard}>
                    <Text style={styles.carbonCardTitle}>AWD পদ্ধতি</Text>

                    <View style={styles.priceBoxBlue}>
                      <Text style={styles.incomeLabel}>আয় করতে পারবেন</Text>

                      <Text style={styles.priceBlue}>₹ 3,200</Text>

                      <Text style={styles.priceUnit}>
                        প্রতি একর / প্রতি মৌসুম
                      </Text>
                    </View>

                    <TouchableOpacity style={styles.detailsButtonBlue}>
                      <Text style={styles.detailsTextBlue}>
                        বিস্তারিত দেখুন →
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* BIOCHAR */}

                  <View style={styles.biocharCard}>
                    <Text style={styles.biocharTitle}>Biochar পদ্ধতি</Text>

                    <View style={styles.priceBoxGreen}>
                      <Text style={styles.incomeLabel}>আয় করতে পারবেন</Text>

                      <Text style={styles.priceGreen}>₹ 4,800</Text>

                      <Text style={styles.priceUnit}>
                        প্রতি একর / প্রতি মৌসুম
                      </Text>
                    </View>

                    <TouchableOpacity style={styles.detailsButtonGreen}>
                      <Text style={styles.detailsTextGreen}>
                        বিস্তারিত দেখুন →
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* MANDI */}

            {selectedModule.type === 'mandi' && (
              <View style={styles.mandiGridContainer}>
                {selectedModule.data.rates?.map((item, index) => (
<MandiCard
  key={`${item.crop}-${index}`}
  crop={item.crop}
  market={item.market}
  price={item.price}
/>
                ))}
              </View>
            )}

            {/* CAMERA */}

            {/* CAMERA */}

            {selectedModule.type === 'camera' && (
              <View style={styles.cameraContainer}>
                {/* TOP HEADING */}

                {/* LEAF PREVIEW */}
                {/* LEAF PREVIEW + CAMERA PREVIEW */}
                <View style={styles.cameraTopRow}>
                  {/* LEFT SIDE */}
                  <View style={styles.cameraPreviewCard}>
                    <Image
                      source={require('../assets/images/leaf_scan.png')}
                      style={styles.liveCameraImage}
                      resizeMode="contain"
                    />

                    <Text style={styles.cameraMainTitle}>এইভাবে ছবি তুলুন</Text>
                    <Text style={styles.cameraInstruction}>
                      ভালো আলোতে পাতাটি পরিষ্কারভাবে ধরুন
                    </Text>
                  </View>

                  {/* RIGHT SIDE */}
                  <View style={styles.previewBox}>
                    <Text style={styles.previewIcon}>📷</Text>

                    <Text style={styles.previewText}>
                      আক্রান্ত অংশের ছবি তুলুন
                    </Text>
                  </View>
                </View>

                {/* OPEN CAMERA BUTTON */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.openCameraButton}
                >
                  <Text style={styles.openCameraButtonText}>
                    ক্যামেরা খুলুন
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* =========================================
              FIELD SECTION
          ========================================= */}

          <View style={styles.sectionHeader}>
          <SectionHeader
  title={t('my_fields')}
  actionText={t('see_all')}
/>
          </View>

          <View style={styles.fieldCard}>
            <ImageBackground
              source={require('../assets/images/field.png')}
              resizeMode="cover"
              imageStyle={styles.fieldImage}
              style={styles.fieldImageContainer}
            >
              <View style={styles.fieldOverlay}>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ 4.5</Text>
                </View>

                <Text style={styles.fieldName}>গ্রিন ভ্যালি জমি F5</Text>

                <Text style={styles.fieldLocation}>উত্তর অঞ্চল • ২.৪ একর</Text>
              </View>
            </ImageBackground>
          </View>
        </ScrollView>
      </ScreenContainer>
      {/* =========================================
    FLOATING BOTTOM TAB BAR
========================================= */}

      <View style={styles.bottomTabBar}>
        <TouchableOpacity activeOpacity={0.8} style={styles.bottomTabItem}>
          <Text style={[styles.bottomTabIcon, { color: '#A4E45F' }]}>🏠</Text>
          <Text style={[styles.bottomTabText, { color: '#A4E45F' }]}>
            {t('home')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} style={styles.bottomTabItem}>
          <Text style={styles.bottomTabIcon}>🌾</Text>
          <Text style={styles.bottomTabText}>{t('fields')}</Text>
        </TouchableOpacity>

        {/* CENTER BUTTON */}

        <TouchableOpacity activeOpacity={0.9} style={styles.centerButton}>
          <Text style={styles.centerButtonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} style={styles.bottomTabItem}>
          <Text style={styles.bottomTabIcon}>📄</Text>
          <Text style={styles.bottomTabText}>{t('docs')}</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} style={styles.bottomTabItem}>
          <Text style={styles.bottomTabIcon}>👤</Text>
          <Text style={styles.bottomTabText}>{t('profile')}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#F4F7F1',
  },

  scrollContainer: {
    paddingBottom: 40,
  },

  /*
  =====================================
  HERO SECTION
  =====================================
  */

  heroBackgroundImage: {
   

   

    borderBottomLeftRadius: 38,

    borderBottomRightRadius: 38,
  },
 heroSection: {
    paddingTop: 10,

    paddingHorizontal: 20,
    paddingBottom: 10,

    borderBottomLeftRadius: 38,

    borderBottomRightRadius: 38,
  },
  topHeader: {
    flexDirection: 'row',
    paddingTop: 22,
    justifyContent: 'space-between',

    alignItems: 'center',
  },

  profileContainer: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  profileImage: {
    width: 42,

    height: 42,

    borderRadius: 26,

    borderWidth: 2,

    borderColor: 'rgba(255,255,255,0.2)',
  },

  welcomeText: {
    color: 'rgba(255,255,255,0.72)',

    fontSize: 12,
  },

  headerTitle: {
    color: '#fff',

    fontSize: 18,

    fontWeight: '900',

    marginTop: 2,
  },

  notificationButton: {
    width: 40,

    height: 40,

    borderRadius: 26,

    backgroundColor: 'rgba(255,255,255,0.12)',

    justifyContent: 'center',

    alignItems: 'center',
  },

  notificationIcon: {
    fontSize: 15,
    color: 'white',
  },

  /*
  =====================================
  WEATHER GLASS CARD
  =====================================
  */

  weatherGlassCard: {
    marginTop: 10,

    backgroundColor: 'rgba(255,255,255,0.08)',

    borderRadius: 28,

    padding: 15,

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.08)',
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
    // marginTop: 20,

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  temperature: {
    color: '#fff',

    fontSize: 40,

    fontWeight: '900',
  },

  weatherRight: {
    alignItems: 'flex-end',
  },

  weatherCloud: {
    fontSize: 20,
  },

  weatherCondition: {
    // marginTop: 8,

    color: '#fff',

    fontWeight: '700',
  },

  weatherDate: {
    marginTop: 2,

    color: 'rgba(255,255,255,0.7)',

    fontSize: 12,
  },

  weatherDetailsRow: {
    marginTop: 10,

    flexDirection: 'row',

    justifyContent: 'space-between',

    backgroundColor: 'rgba(255,255,255,0.06)',

    borderRadius: 20,

    paddingVertical: 10,
  },

  weatherItem: {
    flex: 1,

    alignItems: 'center',
  },

  weatherItemLabel: {
    color: 'rgba(255,255,255,0.65)',

    fontSize: 12,
  },

  weatherItemValue: {
    // marginTop: 8,

    color: '#fff',

    fontWeight: '800',
  },

  weatherDivider: {
    width: 1,

    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  /*
  =====================================
  FORECAST
  =====================================
  */

  forecastContainer: {
    paddingTop: 15,
  },

  forecastCard: {
    width: 100,

    backgroundColor: 'rgba(255,255,255,0.08)',

    borderRadius: 24,

    paddingVertical: 5,

    alignItems: 'center',

    marginRight: 14,
  },

  activeForecastCard: {
    backgroundColor: 'rgba(255,255,255,0.18)',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.1)',
  },

  forecastDay: {
    color: '#fff',

    fontWeight: '700',
  },

  forecastIcon: {
    fontSize: 15,

    // marginTop: 10,
  },

  forecastTemp: {
    // marginTop: 8,

    color: '#fff',

    fontSize: 18,

    fontWeight: '900',
  },

  forecastRain: {
    marginTop: 4,

    color: 'rgba(255,255,255,0.7)',

    fontSize: 12,
  },

  /*
  =====================================
  MODULE TABS
  =====================================
  */

  tabContainer: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    paddingHorizontal: 20,

    marginTop: 20,
  },

  tabButton: {
    flex: 1,

    height: 54,

    backgroundColor: '#fff',

    borderRadius: 18,

    justifyContent: 'center',

    alignItems: 'center',

    marginHorizontal: 4,

    elevation: 2,
  },

  tabText: {
    color: '#334155',

    fontWeight: '700',

    fontSize: 13,
  },

  activeTabText: {
    color: '#fff',
  },

  /*
  =====================================
  DYNAMIC CARD
  =====================================
  */

  dynamicCard: {
    marginTop: 15,

    marginHorizontal: 20,

    backgroundColor: '#fff',

    borderRadius: 30,

    padding: 22,

    elevation: 4,
  },

  dynamicTitle: {
    fontSize: 20,

    fontWeight: '900',

    color: '#0F172A',
  },

  dynamicDescription: {
    marginTop: 12,

    color: '#64748B',

    lineHeight: 24,
  },

  /*
  =====================================
  STATS
  =====================================
  */

  statsContainer: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    marginTop: 15,
  },

  statBox: {
    width: '48%',

    backgroundColor: '#F8FAF7',

    borderRadius: 20,

    padding: 18,
  },

  statLabel: {
    color: '#64748B',
  },

  statValue: {
    marginTop: 8,

    color: '#0F172A',

    fontWeight: '800',
  },

  /*
  =====================================
  MANDI
  =====================================
  */

  mandiGridContainer: {
    marginTop: 20,

    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'space-between',
  },

  compactMandiCard: {
    width: '49%',

    backgroundColor: '#F8FAF7',

    borderRadius: 20,

    paddingVertical: 14,

    paddingHorizontal: 14,

    marginBottom: 12,
  },

  compactCrop: {
    fontSize: 14,

    fontWeight: '800',

    color: '#0F172A',
  },

  compactPrice: {
    color: '#2E7D32',

    fontWeight: '900',
  },

  compactMarket: {
    marginTop: 5,

    color: '#64748B',

    fontSize: 12,
  },

  /*
  =====================================
  CAMERA
  =====================================
  */

  /*
  =====================================
  FIELD SECTION
  =====================================
  */

  sectionHeader: {
    marginTop: 32,

    paddingHorizontal: 20,

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 28,

    fontWeight: '900',

    color: '#0F172A',
  },

  seeAll: {
    color: '#2E7D32',

    fontWeight: '700',
  },

  fieldCard: {
    marginTop: 20,

    paddingHorizontal: 20,
  },

  fieldImageContainer: {
    height: 260,

    borderRadius: 32,

    overflow: 'hidden',
  },

  fieldImage: {
    borderRadius: 32,
  },

  fieldOverlay: {
    flex: 1,

    backgroundColor: 'rgba(0,0,0,0.24)',

    justifyContent: 'flex-end',

    padding: 22,
  },

  ratingBadge: {
    position: 'absolute',

    top: 20,

    left: 20,

    backgroundColor: 'rgba(255,255,255,0.18)',

    paddingHorizontal: 12,

    paddingVertical: 8,

    borderRadius: 14,
  },

  ratingText: {
    color: '#fff',

    fontWeight: '700',
  },

  fieldName: {
    color: '#fff',

    fontSize: 30,

    fontWeight: '900',
  },

  fieldLocation: {
    marginTop: 10,

    color: 'rgba(255,255,255,0.8)',
  },
  bottomTabBar: {
    position: 'absolute',

    bottom: 10,

    left: 18,

    right: 18,

    height: 60,

    backgroundColor: '#21432d',

    borderRadius: 34,

    flexDirection: 'row',

    justifyContent: 'space-around',

    alignItems: 'center',

    // paddingHorizontal: 10,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.18,

    shadowRadius: 12,

    elevation: 12,
  },

  bottomTabItem: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',
  },

  bottomTabIcon: {
    fontSize: 18,

    color: '#FFFFFF',
  },

  bottomTabText: {
    marginTop: 4,

    fontSize: 10,

    color: '#FFFFFF',

    fontWeight: '600',
  },

  centerButton: {
    width: 50,

    height: 50,

    borderRadius: 28,

    backgroundColor: '#A4E45F',

    justifyContent: 'center',

    alignItems: 'center',

    marginTop: -25,

    borderWidth: 5,

    borderColor: '#173522',

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.2,

    shadowRadius: 8,

    elevation: 10,
  },

  centerButtonText: {
    fontSize: 30,

    color: '#173522',

    fontWeight: '900',
  },
  /*
=====================================
CARBON NEW UI
=====================================
*/

  carbonWrapper: {
    // marginTop: 10,
  },

  carbonHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  carbonMainTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },

  carbonInfoButton: {
    backgroundColor: '#EAF7EA',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
  },

  carbonInfoText: {
    color: '#2E7D32',
    fontWeight: '700',
    fontSize: 12,
  },

  carbonSubtitle: {
    marginTop: 10,
    color: '#64748B',
    lineHeight: 22,
  },

  carbonCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  awdCard: {
    width: '49%',
    backgroundColor: '#F4F7FF',
    borderRadius: 28,
    padding: 10,
    // borderWidth: 1,
    borderColor: '#DCE7FF',
  },

  biocharCard: {
    width: '49%',
    backgroundColor: '#F4F7FF',
    borderRadius: 28,
    padding: 10,
    // borderWidth: 1,
    borderColor: '#DCE7FF',
  },

  carbonCardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2453B3',
  },

  biocharTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2E7D32',
  },

  carbonEmoji: {
    fontSize: 42,
    marginTop: 10,
  },

  bulletContainer: {
    marginTop: 10,
  },

  bulletText: {
    color: '#475569',
    marginBottom: 6,
    fontWeight: '600',
    fontSize: 12,
  },

  bioBulletText: {
    color: '#47624B',
    marginBottom: 6,
    fontWeight: '600',
    fontSize: 11,
  },

  priceBoxBlue: {
    marginTop: 5,
    backgroundColor: '#EAF1FF',
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
  },

  priceBoxGreen: {
    marginTop: 5,
    backgroundColor: '#E8F6E4',
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
  },

  incomeLabel: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },

  priceBlue: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: '900',
    color: '#2453B3',
  },

  priceGreen: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: '900',
    color: '#2E7D32',
  },

  priceUnit: {
    marginTop: 6,
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },

  detailsButtonBlue: {
    marginTop: 10,
    backgroundColor: '#EAF1FF',
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: 'center',
  },

  detailsButtonGreen: {
    marginTop: 10,
    backgroundColor: '#EAF1FF',
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: 'center',
  },

  detailsTextBlue: {
    color: '#2453B3',
    fontSize: 12,
    fontWeight: '800',
  },

  detailsTextGreen: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '800',
  },
  cameraRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
  },

  cameraCard: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#F4F7F1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cameraItem: {
    flex: 1,
    alignItems: 'center',
  },

  cameraIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  cameraIcon: {
    fontSize: 40,
  },
  cameraLabel: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    paddingHorizontal: 4,
  },
  cameraButton: {
    backgroundColor: '#1B5E20',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },

  cameraButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cameraContainer: {
    marginTop: 18,
    alignItems: 'center',
  },

  cameraMainTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 5,
    textAlign: 'center',
  },

  cameraPreviewCard: {
    flex: 1,
    backgroundColor: '#F4F7F1',
    borderRadius: 24,
    // paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  liveCameraImage: {
    width: 120,
    height: 100,
  },

  cameraInstruction: {
    fontSize: 10,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },

  previewBox: {
    flex: 1,
    height: 160,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },

  previewIcon: {
    fontSize: 48,
  },

  previewText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },

  openCameraButton: {
    marginTop: 24,
    width: '100%',
    backgroundColor: '#1565C0',
    paddingVertical: 16,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  openCameraButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  cameraTopRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 12,
  },
});

export default HomeScreen;
