import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Paragraph } from '@components/ui';
import colors from '@themes/colors';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import HomeScreen from '@screens/HomeScreen';
import CommunityScreen from '../screens/Community/CommunityScreen';
import AppIcon from '@components/AppIcon/AppIcon';
import { useTranslation } from 'react-i18next';
import ProfileScreen from '@screens/Profile/ProfileScreen';
// import GovernmentSchemeScreen from '@screens/GovtScheme/GovernmentSchemeScreen';
import POPListScreen from '@screens/POP/POPListScreen';
import CenterFab from '@components/AppFab/CenterFab';
import { CustomToast } from '@components/Toast';
const Tab = createBottomTabNavigator();

const EmptyScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    />
  );
};

const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const { t } = useTranslation();
  const getTabIcon = (routeName: string, focused: boolean) => {
    const color = focused ? colors.accent : colors.textMuted;

    switch (routeName) {
      case 'Home':
        return (
          <AppIcon
            type="MaterialCommunityIcons"
            name="home-variant"
            size={24}
            color={color}
          />
        );

      case 'POP':
        return (
          <AppIcon
            type="MaterialCommunityIcons"
            name="sprout"
            size={24}
            color={color}
          />
        );

      case 'Community':
        return (
          <AppIcon
            type="MaterialCommunityIcons"
            name="forum-outline"
            size={24}
            color={color}
          />
        );

      case 'Profile':
        return (
          <AppIcon
            type="MaterialCommunityIcons"
            name="account-circle-outline"
            size={24}
            color={color}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <View style={styles.bottomTabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            if (route.name == 'Community') {
              CustomToast.error(t('Please_Contact_your_admin'));
            } else {
              navigation.navigate(route.name);
            }

            // console.log('routeName', route.name);
          };

          return (
            <React.Fragment key={route.key}>
              {/* Left Side */}
              {index === 2 && <View style={styles.centerSpace} />}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPress}
                style={styles.bottomTabItem}
              >
                {getTabIcon(route.name, isFocused)}

                <Paragraph
                  size="xs"
                  numberOfLines={1}
                  style={[
                    styles.bottomTabText,
                    {
                      color: isFocused ? colors.accent : colors.textMuted,
                    },
                  ]}
                >
                  {t(route.name.toLowerCase())}
                </Paragraph>
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </View>

      {/* <CenterFab currentScreen={state.routes[state.index].name as any} /> */}
    </>
  );
};

const BottomTabNavigator = () => {
  const [currentTab, setCurrentTab] = React.useState('Home');

  return (
    <>
      <Tab.Navigator
        screenListeners={{
          state: e => {
            const index = e.data.state.index;
            const routeName = e.data.state.routeNames[index];
            setCurrentTab(routeName);
          },
        }}
        screenOptions={{
          headerShown: false,
        }}
        tabBar={props => <CustomTabBar {...props} />}
      >
        <Tab.Screen name="Home" component={HomeScreen} />

        {/* <Tab.Screen name="Government" component={GovernmentSchemeScreen} /> */}

        <Tab.Screen name="POP" component={POPListScreen} />

        <Tab.Screen name="Community" component={CommunityScreen} />

        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      <CenterFab currentScreen={currentTab as any} />
    </>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
  bottomTabBar: {
    position: 'absolute',
    bottom: 10,
    left: 18,
    right: 18,
    height: 64,
    backgroundColor: colors.bottomBar,
    borderRadius: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 6,
  },

  bottomTabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 0,
  },
  bottomTabText: {
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
  },

  centerButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    borderWidth: 5,
    borderColor: colors.primary,
  },
  centerSpace: {
    width: 60,
  },
});
