import { StyleSheet, Platform, StatusBar } from 'react-native';
import colors from '@themes/colors';

const HEADER_HEIGHT =
  Platform.OS === 'android'
    ? 64
    : 56;

export default StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    backgroundColor: colors.primary,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 16,

    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,

    elevation: 8,
  },

  iosContainer: {
    paddingTop: 0,
  },

  /*
  =====================================
  Left
  =====================================
  */

  leftContainer: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 40,
    height: 40,

    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  logo: {
    width: 42,
    height: 42,

    marginLeft: 10,

    borderRadius: 21,
  },

  titleContainer: {
    flex: 1,

    marginLeft: 12,
    marginRight: 8,
  },

  title: {
    color: colors.textLight,

    fontSize: 18,

    fontWeight: '700',

    letterSpacing: 0.2,
  },

  /*
  =====================================
  Right
  =====================================
  */

  rightContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    minWidth: 40,
  },

  filterButton: {
    width: 42,
    height: 42,

    borderRadius: 21,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.12)',
  },
});