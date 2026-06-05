import React from 'react';

import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { useTheme } from 'react-native-paper';

type Props = {
  children: React.ReactNode;
};

const ScreenContainer = ({ children }: Props) => {
  const theme = useTheme<any>();

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScreenContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingBottom: 120,
  },
});
