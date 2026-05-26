import React, { ReactNode } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { useTheme } from 'react-native-paper';

type ContainerProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  scrollable?: boolean;
};

const Container = ({
  children,
  style,
  scrollable = false,
}: ContainerProps) => {
  const theme = useTheme();

  const content = (
    <View
      style={[
        styles.container,
        style,
      ]}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor:
            theme.colors.background,
        },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        {scrollable ? (
          <ScrollView
            contentContainerStyle={
              styles.scrollContainer
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Container;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
  },
});