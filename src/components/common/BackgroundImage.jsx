import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

export const BackgroundImage = ({ children, source, resizeMode = 'cover', style }) => {
  return (
    <ImageBackground
      source={source}
      style={[styles.background, style]}
      resizeMode={resizeMode}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});