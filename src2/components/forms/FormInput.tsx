import React, { memo } from 'react';

import {
  View,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  StyleSheet,
} from 'react-native';

import { TextInput, HelperText, useTheme } from 'react-native-paper';

import { Controller, Control, FieldError } from 'react-hook-form';

type FormInputProps = {
  control: Control<any>;
  name: string;
  label: string;
  error?: FieldError;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  autoFocus?: boolean;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  contextMenuHidden?: boolean;
  blurOnSubmit?: boolean;
  inputRef?: any;
  handleKeyDown?: () => void;
  onTouchStart?: () => void;
  icon?: string;
  onIconPress?: () => void;
};

const FormInput = memo(
  ({
    control,
    name,
    label,
    error,
    secureTextEntry = false,
    keyboardType = 'default',
    returnKeyType = 'done',
    autoFocus = false,
    maxLength,
    multiline = false,
    numberOfLines = 1,
    editable = true,
    contextMenuHidden = false,
    blurOnSubmit = true,
    inputRef,
    handleKeyDown = () => {},
    onTouchStart = () => {},
    icon,
    onIconPress = () => {},
  }: FormInputProps) => {
    console.log(name, 'render');
    const theme = useTheme();
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View
            style={{
            //   marginBottom: 5,
            }}
          >
            <TextInput
              ref={inputRef}
              mode="outlined"
              label={label}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              returnKeyType={returnKeyType}
              autoFocus={autoFocus}
              maxLength={maxLength}
              multiline={multiline}
              numberOfLines={numberOfLines}
              editable={editable}
              contextMenuHidden={contextMenuHidden}
              blurOnSubmit={blurOnSubmit}
              onSubmitEditing={handleKeyDown}
              onTouchStart={onTouchStart}
              error={!!error}
              right={
                icon ? (
                  <TextInput.Icon icon={icon} onPress={onIconPress} />
                ) : null
              }
              placeholderTextColor={theme.colors.outline}
              selectionColor={error ? theme.colors.error : theme.colors.primary}
              outlineColor={error ? theme.colors.error : theme.colors.outline}
              activeOutlineColor={
                error ? theme.colors.error : theme.colors.primary
              }
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                },
              ]}
              contentStyle={{
                color: theme.colors.onSurface,
              }}
              theme={{
                colors: {
                  text: theme.colors.onSurface,
                  primary: error ? theme.colors.error : theme.colors.primary,
                  placeholder: theme.colors.outline,
                },
              }}
              outlineStyle={{
                borderRadius: 12,
                borderWidth: 0.5,
                borderColor: error ? theme.colors.error : theme.colors.outline,
              }}
            />

           {error&&<HelperText type="error" visible={!!error}>
              {error?.message}
            </HelperText>} 
          </View>
        )}
      />
    );
  },
);

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
    width: '100%',
    borderRadius: 12,
  },
});

export default FormInput;
