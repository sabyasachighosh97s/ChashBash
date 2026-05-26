import React from 'react';
import { View } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Controller } from 'react-hook-form';

const FormInput = React.memo(
  ({
    control,
    name,
    label,
    error,
    secureTextEntry = false,
    keyboardType = 'default',
  }) => {
    console.log(name, 'render');

    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{ marginBottom: 12 }}>
            <TextInput
              mode="outlined"
              label={label}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              error={!!error}
            />

            <HelperText
              type="error"
              visible={!!error}
            >
              {error?.message}
            </HelperText>
          </View>
        )}
      />
    );
  }
);

export default FormInput;
