// DropdownInput.tsx

import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { HelperText, TextInput, useTheme } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import { Controller } from 'react-hook-form';
import type { FieldErrors } from 'react-hook-form';

type DropdownOption = {
  label: string;
  value: string;
};

type DropdownProps = {
  labelText: string;
  name: string;
  control: any;
  data: DropdownOption[];
  errors?: FieldErrors;
  disabled?: boolean;
  customBorderColor?: string;
  customBackgroundColor?: string;
  customPrimaryColor?: string;
};

const CustomDropdownInput = memo((props: any) => {
  const {
    placeholder,
    selectedLabel,
    rightIcon,
    showSoftInputOnFocus,
    autoFocus,
    disabled,
    error,
    mode,
    customBorderColor,
    customPrimaryColor,
    hasError,
    ...rest
  } = props;

  const theme = useTheme<any>();

  return (
    <TextInput
      mode={mode || 'outlined'}
      value={selectedLabel || ''}
      right={rightIcon}
      showSoftInputOnFocus={showSoftInputOnFocus}
      error={error}
      style={{
        backgroundColor: theme.colors.surface,
      }}
      contentStyle={{
        color: theme.colors.onSurface,
      }}
      outlineStyle={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: hasError
          ? theme.colors.error
          : customBorderColor || theme.colors.border,
      }}
      theme={{
        colors: {
          text: theme.colors.onSurface,
          primary: customPrimaryColor || theme.colors.primary,
          outline: customBorderColor || theme.colors.border,
          error: theme.colors.error,
          placeholder: theme.colors.outline,
        },
      }}
      {...rest}
    />
  );
});

const DropdownInput = ({
  labelText,
  name,
  control,
  data,
  errors = {},
  disabled = false,
  customBorderColor,
  customBackgroundColor,
  customPrimaryColor,
}: DropdownProps) => {
  const theme = useTheme<any>();
  const hasError = !!errors?.[name];
  const errorMessage = errors?.[name]?.message?.toString();
  
  console.log('labelTextdrop', labelText);

  // Memoize options to prevent recreation on each render
  const memoizedOptions = useMemo(() => {
    return data.map(option => ({
      ...option,
      value: option?.value?.toString(),
    }));
  }, [data]);

  // Memoize CustomDropdownInput to prevent recreation
  const MemoizedCustomDropdownInput = useCallback((props: any) => (
    <CustomDropdownInput
      {...props}
      customBorderColor={customBorderColor}
      customBackgroundColor={customBackgroundColor}
      customPrimaryColor={customPrimaryColor}
      hasError={hasError}
    />
  ), [customBorderColor, customBackgroundColor, customPrimaryColor, hasError]);

  // Memoize onSelect handler
  const handleSelect = useCallback((value: string) => {
    return (onChange: (value: string) => void) => {
      onChange(value || '');
    };
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: {
          onChange,
          value,
        },
      }) => (
        <View style={styles.container}>
          <Dropdown
            label={`${labelText}*`}
            mode="outlined"
            value={value}
            onSelect={(selectedValue) => {
              onChange(selectedValue || '');
            }}
            options={memoizedOptions}
            disabled={disabled}
            error={hasError}
            menuContentStyle={{
              backgroundColor: customBackgroundColor || theme.colors.surface,
              borderWidth: 0.5,
              borderColor: theme.colors.border,
              borderRadius: 12,
            }}
            statusBarHeight={100}
            CustomDropdownInput={MemoizedCustomDropdownInput}
          />
          {hasError && (
            <HelperText style={styles.errorText} type="error" visible>
              {errorMessage}
            </HelperText>
          )}
        </View>
      )}
    />
  );
};

export default memo(DropdownInput);

const styles = StyleSheet.create({
  container: {
    marginVertical: 7,
    width: '100%',
  },
  errorText: {
    fontFamily: 'System',
    marginLeft: 0,
    marginTop: 4,
  },
});