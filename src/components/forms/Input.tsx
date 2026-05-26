// Input.tsx
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, HelperText, useTheme } from 'react-native-paper';
import { Controller } from 'react-hook-form';
import type { KeyboardTypeOptions, ReturnKeyTypeOptions } from 'react-native';
import type { FieldErrors } from 'react-hook-form';
type InputProps = {
  labelText: string;
  placeholderText?: string;
  name: string;
  control: any;
  errors?: FieldErrors;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  handleKeyDown?: () => void;
  editable?: boolean;
  contextMenuHidden?: boolean;
  onTouchStart?: () => void;
  autoFocus?: boolean;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  onIconPress?: () => void;
  icon?: string;
  touchedFields?: Record<string, boolean>;
  dirtyFields?: Record<string, boolean>;
  isValid?: any;
  inputRef?: any;
  blurOnSubmit?: boolean;
  secureTextEntry?: boolean;
};
const Input = ({
  labelText = '',
  placeholderText = '',
  name,
  control,
  errors = {},
  keyboardType = 'default',
  returnKeyType = 'done',
  handleKeyDown = () => {},
  editable = true,
  contextMenuHidden = false,
  onTouchStart = () => {},
  autoFocus = false,
  maxLength,
  multiline = false,
  numberOfLines = 1,
  onIconPress = () => {},
  icon,
  touchedFields,
  dirtyFields,
  isValid,
  inputRef,
  blurOnSubmit = true,
  secureTextEntry = false,
}: InputProps) => {
  const theme = useTheme<any>();
  const hasError = !!errors[name];
  const errorMessage = errors[name]?.message?.toString();
  console.log("randder",name)
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value,onBlur } }) => (
        <>
          <TextInput
            ref={inputRef}
            label={`${labelText}*`}
            mode="outlined"
            value={value}
            onChangeText={onChange}
              onBlur={onBlur}
            placeholder={placeholderText}
            placeholderTextColor={theme.colors.outline}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            blurOnSubmit={blurOnSubmit}
            onSubmitEditing={handleKeyDown}
            maxLength={maxLength}
            editable={editable}
            onTouchStart={onTouchStart}
            contextMenuHidden={contextMenuHidden}
            autoFocus={autoFocus}
            multiline={multiline}
            numberOfLines={numberOfLines}
            secureTextEntry={secureTextEntry}
            underlineColorAndroid="transparent"
            selectionColor={
              hasError ? theme.colors.error : theme.colors.primary
            }
            outlineColor={hasError ? theme.colors.error : theme.colors.border}
            activeOutlineColor={
              hasError ? theme.colors.error : theme.colors.primary
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
                primary: hasError ? theme.colors.error : theme.colors.primary,
                placeholder: theme.colors.outline,
              },
            }}
            outlineStyle={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: hasError ? theme.colors.error : theme.colors.border,
            }}
            right={
              icon ? <TextInput.Icon icon={icon} onPress={onIconPress} /> : null
            }
          />
          {hasError && (
            <HelperText type="error" visible>
              {errorMessage}
            </HelperText>
          )}
        </>
      )}
    />
  );
};
export default Input;
const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
    width: '100%',
    borderRadius: 12,
  },
});
