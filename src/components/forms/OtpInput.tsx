import React, { useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';

import { useTheme } from 'react-native-paper';

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
  error?: boolean;
};

const OtpInput = ({
  value,
  onChange,
  length = 6,
  autoFocus = true,
  error = false,
}: OtpInputProps) => {
  const theme = useTheme();

  const inputRefs = useRef<TextInput[]>([]);

  /*
  ============================================
  CHANGE OTP
  ============================================
  */

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) {
      return;
    }

    const otpArray = value.split('');

    otpArray[index] = text;

    const newOtp = otpArray.join('');

    onChange(newOtp);

    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /*
  ============================================
  BACKSPACE
  ============================================
  */

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={ref => {
            if (ref) {
              inputRefs.current[index] = ref;
            }
          }}
          value={value[index] || ''}
          style={[
            styles.input,
            {
              borderColor: error ? theme.colors.error : theme.colors.outline,
              color: theme.colors.onSurface,
            },
          ]}
          keyboardType="number-pad"
          maxLength={1}
          autoFocus={autoFocus && index === 0}
          textAlign="center"
          selectionColor={theme.colors.primary}
          onChangeText={text => handleChange(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
        />
      ))}
    </View>
  );
};

export default OtpInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },

  input: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 22,
    fontWeight: '700',
  },
});
