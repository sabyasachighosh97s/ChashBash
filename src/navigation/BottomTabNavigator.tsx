import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Paragraph } from '@components/ui';
import colors from '@themes/colors';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';

import HomeScreen from '@screens/HomeScreen';
import CommunityScreen from '../Community/CommunityScreen';
import CreatePostScreen from '../Community/CreatePostScreen';
import AppIcon from '@components/AppIcon/AppIcon';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

/*
=====================================
EMPTY SCREENS
=====================================
*/

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
            size={25}
            color={color}
          />
        );

      case 'Fields':
        return (
          <AppIcon
            type="MaterialCommunityIcons"
            name="tractor"
            size={25}
            color={color}
          />
        );

      case 'Community':
        return (
          <AppIcon
            type="MaterialCommunityIcons"
            name="forum-outline"
            size={25}
            color={color}
          />
        );

      case 'Profile':
        return (
          <AppIcon
            type="MaterialCommunityIcons"
            name="account-circle-outline"
            size={25}
            color={color}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.bottomTabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          navigation.navigate(route.name);
        };

        if (route.name === 'Add') {
          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.9}
              onPress={onPress}
              style={styles.centerButton}
            >
              <AppIcon
                type="MaterialCommunityIcons"
                name="plus"
                size={28}
                color={colors.primary}
              />
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={0.8}
            onPress={onPress}
            style={styles.bottomTabItem}
          >
            {getTabIcon(route.name, isFocused)}

            <Paragraph
              size="xs"
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
        );
      })}
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Fields" component={EmptyScreen} />
      <Tab.Screen name="Add" component={CreatePostScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Profile" component={EmptyScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
  bottomTabBar: {
    position: 'absolute',
    bottom: 10,
    left: 18,
    right: 18,
    height: 60,

    backgroundColor: colors.bottomBar,
    borderRadius: 34,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  bottomTabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomTabText: {
    // marginTop: 4,
    // fontSize: 11,
    fontWeight: '600',
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
});
