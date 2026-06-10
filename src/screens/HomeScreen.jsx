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
import { useTranslation } from 'react-i18next';
import {
  Container,
  Card,
  Button,
  Icon,
  Headline,
  Paragraph,
} from '@components/ui';
import { CustomStatusBar } from '../components/common/CustomStatusBar';
import SectionHeader from '@components/common/SectionHeader';
import { BackgroundImage } from '../components/common/BackgroundImage';
import MandiCard from '@components/Dashboard/MandiCard';
import CameraSection from '@components/Dashboard/CameraSection';
import WeatherForecastCard from '@components/cards/WeatherForecastCard';
import useThemeMode from '@hook/useThemeMode';
import CarbonSection from '@components/Dashboard/CarbonSection';
import { CustomAppBar } from '@components/common/CustomAppBar';
import colors from '@themes/colors';
const HomeScreen = () => {
  const { t } = useTranslation();
  const { theme,isDark } = useThemeMode();
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
 weatherType: 'sunny',
    humidity: '65%',
    rainfall: '2 mm',
    wind: '12 km/h',

    irrigation: 'সেচের জন্য উপযুক্ত দিন',
    fertilizer: 'আজ সার প্রয়োগ করা যেতে পারে',
    pesticide: 'কীটনাশক প্রয়োগ নিরাপদ',

    soil: 'মাটির আর্দ্রতা মাঝারি',
    drainage: 'ড্রেনেজ স্বাভাবিক',
  },

  {
    day: t('tomorrow'),
    temp: '30°',
    weather: t('cloudy'),
    rain: '35%',
 weatherType: 'cloudy',
    humidity: '78%',
    rainfall: '8 mm',
    wind: '15 km/h',

    irrigation: 'সেচ কম করার পরামর্শ',
    fertilizer: 'সার প্রয়োগ সীমিত রাখুন',
    pesticide: 'হালকা স্প্রে করা যেতে পারে',

    soil: 'মাটি ভেজা থাকতে পারে',
    drainage: 'ড্রেনেজ পর্যবেক্ষণ প্রয়োজন',
  },

  {
    day: t('day_after'),
    temp: '28°',
    weather: t('rain'),
    rain: '70%',
 weatherType: 'rain',
    humidity: '90%',
    rainfall: '18 mm',
    wind: '22 km/h',

    irrigation: 'সেচ প্রয়োজন নেই',
    fertilizer: 'আজ সার প্রয়োগ এড়িয়ে চলুন',
    pesticide: 'কীটনাশক ব্যবহার অনুপযুক্ত',

    soil: 'মাটি অতিরিক্ত ভেজা',
    drainage: 'জল নিষ্কাশন জরুরি',
  },
]
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

  color: colors.success,

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

color: colors.warning,
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
      color: colors.info,
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
    
    <Container scrollable>
      
      <CustomStatusBar />

      <BackgroundImage source={require('../assets/images/weather.png')}
       style={styles.heroBackground}
          resizeMode="cover"
      >
        {/* TOP HEADER */}
  <View style={styles.heroOverlay}>
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

        <WeatherForecastCard
  forecastData={weatherData.forecast}
  selectedForecast={selectedForecast}
  setSelectedForecast={setSelectedForecast}
/>
     </View>
     
      </BackgroundImage>

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
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {module.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* <Icon name="home" size={24} color={'red'} /> */}
      <Card style={styles.dynamicCard}>
     
        {selectedModule.type === 'carbon' && (
          <CarbonSection
    data={selectedModule.data}
  />
        )}
              
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

       {selectedModule.type === 'camera' && (
  <CameraSection
    data={selectedModule.data}
  />
)}
   
      </Card>

      <View style={styles.sectionHeader}>
        <SectionHeader title={t('my_fields')} actionText={t('see_all')} />
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

            <Text style={styles.fieldLocation}>উত্তর অঞ্চল • ২.1 একর</Text>
          </View>
        </ImageBackground>
      </View>

    </Container>
  );
};

const styles = StyleSheet.create({
heroBackground: {
  width: '100%',
  borderBottomLeftRadius: 40,
  borderBottomRightRadius: 40,
  overflow: 'hidden',
},

topHeader: {
  flexDirection: 'row',
  paddingTop: 30,
  paddingBottom: 10,
  paddingHorizontal: 10,
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: 20,
  // borderWidth: 1,
glassBorderStrong: colors.glassBorderStrong,
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
    borderColor: colors.glassBorder,
  },

  headerTitle: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },

  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 26,
    backgroundColor:  colors.glass,
    justifyContent: 'center',
    alignItems: 'center',
  },

  notificationIcon: {
    fontSize: 15,
   color: colors.textLight,
  },

forecastContainer: {
  paddingTop: 10,
},

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },

  tabButton: {
    flex: 1,
    height: 54,
    backgroundColor: colors.surface,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
  },

  tabText: {
    color:  colors.text,
    fontWeight: '700',
    fontSize: 13,
  },

  activeTabText: {
    color: colors.textLight,
  },

  dynamicCard: {
    marginTop: 15,
    marginHorizontal: 15,
    padding: 20,
  },

  mandiGridContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  sectionHeader: {
    marginTop: 32,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    backgroundColor: colors.darkOverlay,
    justifyContent: 'flex-end',
    padding: 22,
  },

  ratingBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor:  colors.glassMedium,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },

  ratingText: {
    color: colors.textLight,
    fontWeight: '700',
  },

  fieldName: {
    color: colors.textLight,
    fontSize: 30,
    fontWeight: '900',
  },

  fieldLocation: {
    marginTop: 10,
    color: colors.textMuted,
  },
 
heroOverlay: {
  flex: 1,
 backgroundColor: colors.heroOverlay,
},

});

export default HomeScreen;
