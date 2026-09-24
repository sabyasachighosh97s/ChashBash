import React, { useEffect, useState,useRef } from 'react';

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
  NativeModules,
  ActivityIndicator
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
import FloatingMenuFab from '@components/AppFab/FloatingMenuFab';
import colors from '@themes/colors';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getCurrentLocation } from '../utils/location';
import {
  openweathermapAPI,
  openweathermapLocation,
} from '../utils/weatherService';
import TrainingSection from '@components/Dashboard/TrainingSection';
import InformationSection from '@components/Dashboard/InformationSection';
import { useNavigation } from '@react-navigation/native';
import { apiGet } from '../api/client';
import { API_ROUTES } from '../api/routes';
import TranslateText, {
  TranslateLanguage,
} from '@react-native-ml-kit/translate-text';



const HomeScreen = () => {
const navigation = useNavigation();
  const { token, user,updateUser } = useAuth();
const [loading, setLoading] = useState(false);
const [weatherData, setWeatherData] = useState({
   forecast: [],
 });

 const [selectedForecast, setSelectedForecast] = useState(null);
const [locationName, setlocationName] = useState('');

 const [weatherLoading, setWeatherLoading] = useState(true);
 const weatherRequestStarted = useRef(false);

useEffect(() => {

  if (weatherRequestStarted.current) {
    return;
  }
  weatherRequestStarted.current = true;

  const loadWeather = async () => {
    try {
      const session = await AsyncStorage.getItem('AUTH_SESSION');
      await getLocation();

    } catch (error) {
      console.log('Weather initialization error:', error);

      weatherRequestStarted.current = false;
      setWeatherLoading(false);
    }
  };

  loadWeather();
   return () => {
  };
}, []);


  const { t } = useTranslation();
  const { theme,isDark } = useThemeMode();

  const translateToBengali = async text => {
  
      setLoading(true);
      try {
      const result = await TranslateText.translate({
        text: text,
        sourceLanguage: TranslateLanguage.ENGLISH,
        targetLanguage: TranslateLanguage.BENGALI,
        downloadModelIfNeeded: true, // ML Kit auto-downloads the models if missing!
        requireWifi: false,
      });
     
        return result;
      } catch (error) {
        console.error('Translation error:', error);
       
      } finally {
        setLoading(false);
      }
    };
  const getLocation = async () => {
     try {
       const loc = await getCurrentLocation();

       const [forecastRes,currentRes] = await Promise.all([
        
         openweathermapAPI(loc.latitude, loc.longitude),
         openweathermapLocation(loc.latitude, loc.longitude),
         
       ]);
       
       const formattedWeather = formatWeatherResponse(forecastRes?.data);

       console.log('Weather Data:', formattedWeather);
              console.log('currentRes:', currentRes);

       if (currentRes?.status === 200) {
  const cityName = currentRes?.data?.name;

  if (cityName) {
    const bengaliCityName = await translateToBengali(cityName);

    setlocationName(bengaliCityName || cityName);

  }
}

       setWeatherData(formattedWeather);

       // Select Today by default
       if (formattedWeather.forecast.length > 0) {
         setSelectedForecast(formattedWeather.forecast[0]);
         setWeatherLoading(false);
       }

       if(user.id.length >0)
        {
        const locCrop = await apiGet(API_ROUTES.GET.USER_BY_ID(user.id), token);
        console.log('locCrop:', locCrop);

       if(locCrop.status==200){


          await updateUser({
        id: user.id,
        name: user.name,
        phone: user.phone,
        state: locCrop.data.state_name,
        stateID: locCrop.data.state_id,
        district: locCrop.data.district_name,
        districtID: locCrop.data.district_id,
        block: locCrop.data.subdivision_name,
        blockID: locCrop.data.subdivision_id,
      });
       }
       }
 

     } catch (error) {
       console.log('Location Error:', error);
       setWeatherLoading(true);
     }
   };
   const toBengaliNumber = value => {
     if (value === null || value === undefined) {
       return '০';
     }

     const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

     return String(value).replace(/\d/g, digit => bengaliDigits[digit]);
   };

   const translateWeather = weather => {
     if (!weather) {
       return 'আবহাওয়া';
     }

     const value = weather.toLowerCase().trim();

     const weatherMap = {

       clear: 'পরিষ্কার আকাশ',
       clouds: 'মেঘলা',
       'few clouds': 'হালকা মেঘলা',
       'scattered clouds': 'বিক্ষিপ্ত মেঘ',
       'broken clouds': 'আংশিক মেঘলা',
       'overcast clouds': 'ঘন মেঘলা',
        rain: 'বৃষ্টি',
        drizzle: 'গুঁড়ি গুঁড়ি বৃষ্টি',
       'light rain': 'হালকা বৃষ্টি',
       'moderate rain': 'মাঝারি বৃষ্টি',
       'heavy intensity rain': 'ভারী বৃষ্টি',
       'very heavy rain': 'অতি ভারী বৃষ্টি',
       'extreme rain': 'অত্যন্ত ভারী বৃষ্টি',
        thunderstorm: 'বজ্রঝড়',
       snow: 'তুষারপাত',
       mist: 'কুয়াশাচ্ছন্ন',
       fog: 'কুয়াশাচ্ছন্ন',
       haze: 'ধোঁয়াশা',
       smoke: 'ধোঁয়াশা',
       dust: 'ধুলোময়',
       sand: 'বালুময়',
       ash: 'ছাইযুক্ত',
       squall: 'ঝোড়ো হাওয়া',
       tornado: 'টর্নেডো',
     };

     return weatherMap[value] || weather;
   };

   const getWeatherType = main => {
     const value = main?.toLowerCase();

     if (value === 'rain' || value === 'drizzle' || value === 'thunderstorm') {
       return 'rain';
     }

     if (value === 'clear') {
       return 'sunny';
     }

     return 'cloudy';
   };


   const getDayName = index => {
     switch (index) {
       case 0:
         return 'আজ';

       case 1:
         return 'আগামীকাল';

       case 2:
         return 'পরশু';

       default:
         return '';
     }
   };

 
   const formatTemperature = value => {
     const temp = Math.round(Number(value) || 0);

     return `${toBengaliNumber(temp)}°`;
   };

   const formatPercentage = value => {
  const number = Math.round(Number(value) || 0);

  return `${toBengaliNumber(number)}%`;
};


const formatRainfall = value => {
  const rainfall = Number(value) || 0;

  // Keep maximum 2 decimal places
  const formatted = rainfall
    .toFixed(2)
    .replace(/\.00$/, '')
    .replace(/(\.\d)0$/, '$1');

  return `${toBengaliNumber(formatted)} মিমি`;
};

const formatWindSpeed = value => {
  const windKmh = Math.round((Number(value) || 0) * 3.6);

  return `${toBengaliNumber(windKmh)} কিমি/ঘণ্টা`;
};


const formatWeatherResponse = data => {
  if (!data) {
    return {
      forecast: [],
    };
  }

  const current = data?.current || {};
  const daily = data?.daily || [];

  
  const currentWeather = current?.weather?.[0];

  const forecast = daily.slice(0, 3).map((item, index) => {
    const isToday = index === 0;

    const temp = isToday ? current?.temp : item?.temp?.day;

    const weatherMain = isToday
      ? currentWeather?.main
      : item?.weather?.[0]?.main;

    const weatherDescription = isToday
      ? currentWeather?.description
      : item?.weather?.[0]?.description;

    const humidity = isToday ? current?.humidity : item?.humidity;

    const windSpeed = isToday ? current?.wind_speed : item?.wind_speed;

    // Rain probability
   
    const rainProbability = Math.round((item?.pop || 0) * 100);

    // Rainfall
    // OpenWeather daily rain is already mm

    const rainfall = item?.rain || 0;

    // Weather icon type
    const weatherType = getWeatherType(weatherMain);

    return {
      // Day
      day: getDayName(index),

      // Temperature
      temp: formatTemperature(temp),

      // Rain probability
      rain: formatPercentage(rainProbability),

      // Bengali weather description
      weather: translateWeather(weatherDescription),

      // Icon type
      weatherType,

      // Humidity
      humidity: formatPercentage(humidity),

      // Rainfall
      rainfall: formatRainfall(rainfall),

      // Wind
      wind: formatWindSpeed(windSpeed),

      // Future advice
      irrigation: '',
      fertilizer: '',
      pesticide: '',
    };
  });

  return {
    forecast,
  };
};

  const dashboardModules = [

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

  {
    id: 'training',
    title: 'প্রশিক্ষণ',
    type: 'training',
    color: colors.success,
  },

  {
    id: 'information',
    title: 'তথ্য',
    type: 'information',
    color: colors.warning,

  },
 
];

  const [selectedModule, setSelectedModule] = useState(dashboardModules[0]);
  return (
    <Container scrollable>
      <CustomStatusBar />
<View style={styles.heroWrapper}>
      <BackgroundImage
        source={require('../assets/images/weather.png')}
        style={styles.heroBackground}
        resizeMode="cover"
      >
        {/* TOP HEADER */}
        <View style={styles.heroOverlay}>
          <View style={styles.topHeader}>
            <View style={styles.profileContainer}>
              <Image
                source={require('../assets/images/Logo.png')}
                style={styles.profileImage}
              />

              <View style={{ marginLeft: 12 }}>
                <Text style={styles.headerTitle}>
                  {user.name ? user.name : t('hello_user')}
                </Text>
              </View>
            </View>
          </View>

    <WeatherForecastCard
  forecastData={weatherData.forecast}
  selectedForecast={selectedForecast}
  setSelectedForecast={setSelectedForecast}
  loading={weatherLoading}
  location={locationName}
/>
        </View>
      </BackgroundImage>
</View>
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
     


<Card style={styles.dynamicCard}>
  {selectedModule.type === 'camera' && (
    <CameraSection
      data={selectedModule.data}
    />
  )}
  {selectedModule.type === 'training' && (

    <TrainingSection

      onSeeAll={() => {
        navigation.navigate('TrainingList');
      }}

      onTrainingPress={(item) => {
        navigation.navigate('TrainingDetails', {
          training: item,
        });
      }}

    />

  )}

{selectedModule.type === 'information' && (
  <InformationSection
    onSeeAll={() => {
      navigation.navigate('InformationList');
    }}
    onInformationPress={(item) => {
      navigation.navigate('InformationDetail', {
        information: item,
      });
    }}
  />
)}

</Card>

<View style={styles.bottomScrollSpacer} />

      {/* <View style={styles.sectionHeader}>
        <SectionHeader title={t('my_fields')} actionText={t('see_all')} />
      </View> */}
{/* 
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
      </View> */}
    </Container>
  );
  
};

const styles = StyleSheet.create({
heroBackground: {
  width: '100%',
  height: 370,
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
  quickServiceCard: {
  marginTop: 18,
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
 backgroundColor: colors.heroOverlay,
},

bottomScrollSpacer: {
  height: 100,
},

heroWrapper: {
  width: '100%',
  height: 370,
  borderBottomLeftRadius: 40,
  borderBottomRightRadius: 40,
  overflow: 'hidden',
},

});

export default HomeScreen;
