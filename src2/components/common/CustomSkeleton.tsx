// CustomSkeleton.tsx

import React from 'react';

import Skeleton from 'react-native-reanimated-skeleton';

import { useTheme } from 'react-native-paper';

import {
  View,
  StyleSheet,
} from 'react-native';

import type {
  DimensionValue,
} from 'react-native';

type SkeletonType =
  | 'card'
  | 'list'
  | 'profile'
  | 'banner';

type Props = {
  type?: SkeletonType;
};

export const CustomSkeleton = ({
  type = 'card',
}: Props) => {
  const theme = useTheme<any>();

  const getLayout = () => {
    switch (type) {
      case 'profile':
        return [
          {
            key: 'avatar',

            width: 80,

            height: 80,

            borderRadius: 999,

            marginBottom: 20,
          },

          {
            key: 'name',

            width: '60%' as DimensionValue,

            height: 20,

            borderRadius: 8,

            marginBottom: 12,
          },

          {
            key: 'email',

            width: '40%' as DimensionValue,

            height: 16,

            borderRadius: 8,
          },
        ];

      case 'list':
        return [
          {
            key: 'item1',

            width: '100%' as DimensionValue,

            height: 70,

            borderRadius: 12,

            marginBottom: 16,
          },

          {
            key: 'item2',

            width: '100%' as DimensionValue,

            height: 70,

            borderRadius: 12,

            marginBottom: 16,
          },

          {
            key: 'item3',

            width: '100%' as DimensionValue,

            height: 70,

            borderRadius: 12,
          },
        ];

      case 'banner':
        return [
          {
            key: 'banner',

            width: '100%' as DimensionValue,

            height: 220,

            borderRadius: 20,
          },
        ];

      case 'card':
      default:
        return [
          {
            key: 'card',

            width: '100%' as DimensionValue,

            height: 180,

            borderRadius: 16,

            marginBottom: 20,
          },

          {
            key: 'title',

            width: '70%' as DimensionValue,

            height: 20,

            borderRadius: 8,

            marginBottom: 12,
          },

          {
            key: 'subtitle',

            width: '50%' as DimensionValue,

            height: 20,

            borderRadius: 8,
          },
        ];
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme.colors.background,
        },
      ]}
    >
      <Skeleton
        isLoading
        containerStyle={{
          width: '100%',
        }}
        layout={getLayout()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});