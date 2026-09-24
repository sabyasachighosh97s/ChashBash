// DropdownInput.tsx

import React, { memo, useMemo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { HelperText, TextInput, useTheme } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import { Controller, Control, FieldErrors, FieldError } from 'react-hook-form';
type DropdownOption = {
  label: string;
  value: string;
};
type DropdownInputProps = {
  labelText: string;
  name: string;
  control: Control<any>;
  data: DropdownOption[];
  error?: FieldError;
  disabled?: boolean;
  customBorderColor?: string;
  customBackgroundColor?: string;
  customPrimaryColor?: string;
  placeholder?: string;
};
type CustomDropdownInputProps = {
  selectedLabel?: string;
  rightIcon?: React.ReactNode;
  showSoftInputOnFocus?: boolean;
  disabled?: boolean;
  error?: boolean;
  mode?: 'flat' | 'outlined';
  customBorderColor?: string;
  customPrimaryColor?: string;
  customBackgroundColor?: string;
  hasError?: boolean;
  placeholder?: string;
  labelText?: string;
};
const CustomDropdownInput = memo(
  ({
    labelText,
    selectedLabel,
    rightIcon,
    showSoftInputOnFocus,
    disabled,
    error,
    mode,
    customBorderColor,
    customPrimaryColor,
    customBackgroundColor,
    hasError,
    placeholder,
  }: CustomDropdownInputProps) => {
    const theme = useTheme<any>();
    return (
      <TextInput
        mode={mode || 'outlined'}
        label={`${labelText}*`}
        value={selectedLabel || ''}
        placeholder={placeholder}
        editable={!disabled}
        showSoftInputOnFocus={showSoftInputOnFocus}
        error={error}
        right={rightIcon}
        placeholderTextColor={theme.colors.outline}
        selectionColor={
          hasError
            ? theme.colors.error
            : customPrimaryColor || theme.colors.primary
        }
        outlineColor={
          hasError
            ? theme.colors.error
            : customBorderColor || theme.colors.outline
        }
        activeOutlineColor={
          hasError
            ? theme.colors.error
            : customPrimaryColor || theme.colors.primary
        }
        style={[
          styles.input,
          {
            backgroundColor: customBackgroundColor || theme.colors.surface,
          },
        ]}
        contentStyle={{
          color: theme.colors.onSurface,
        }}
        theme={{
          colors: {
            text: theme.colors.onSurface,
            primary: customPrimaryColor || theme.colors.primary,
            outline: customBorderColor || theme.colors.outline,
            error: theme.colors.error,
            placeholder: theme.colors.outline,
          },
        }}
        outlineStyle={{
          borderRadius: 12,
          borderWidth: 0.5,
          borderColor: hasError
            ? theme.colors.error
            : customBorderColor || theme.colors.outline,
        }}
      />
    );
  },
);

const FormdownInput = memo(
  ({
    labelText,
    name,
    control,
    data,
    error,
    disabled = false,
    customBorderColor,
    customBackgroundColor,
    customPrimaryColor,
    placeholder,
  }: DropdownInputProps) => {
    const theme = useTheme<any>();

    const hasError = !!error;

    const errorMessage = error?.message?.toString();

    console.log(name, 'dropdown render');

    // prevent options recreation
    const memoizedOptions = useMemo(() => {
      return data.map(item => ({
        label: item.label,
        value: item.value?.toString(),
      }));
    }, [data]);

    // prevent custom input recreation
    const MemoizedDropdownInput = useCallback(
      (props: any) => (
        <CustomDropdownInput
          labelText={labelText}
          {...props}
          placeholder={placeholder}
          customBorderColor={customBorderColor}
          customBackgroundColor={customBackgroundColor}
          customPrimaryColor={customPrimaryColor}
          hasError={hasError}
        />
      ),
      [
        placeholder,
        customBorderColor,
        customBackgroundColor,
        customPrimaryColor,
        hasError,
      ],
    );

    // stable select callback
    const handleSelect = useCallback(
      (selectedValue: any, onChange: (value: string) => void) => {
        onChange(selectedValue || '');
      },
      [],
    );

    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <View style={styles.container}>
            <Dropdown
              label={`${labelText}*`}
              mode="outlined"
              value={value}
              options={memoizedOptions}
              disabled={disabled}
              error={hasError}
              statusBarHeight={100}
              onSelect={selectedValue => handleSelect(selectedValue, onChange)}
              menuContentStyle={{
                backgroundColor: customBackgroundColor || theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 12,
                maxHeight: 300,
                overflow: 'hidden',
              }}
              CustomDropdownInput={MemoizedDropdownInput}
            />

            {hasError && (
              <HelperText
                type="error"
                visible={hasError}
                style={styles.errorText}
              >
                {errorMessage}
              </HelperText>
            )}
          </View>
        )}
      />
    );
  },
);

export default FormdownInput;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },

  input: {
    backgroundColor: 'transparent',
  },

  errorText: {
    marginLeft: 0,
    // marginTop: 4,
  },
});
