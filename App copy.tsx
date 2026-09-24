import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import {
  Appbar,
  Divider,
  Headline,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  Paragraph,
  TextInput,
  ThemeProvider,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {
  Dropdown,
  MultiSelectDropdown,
  DropdownInputProps,
  DropdownItemProps,
} from 'react-native-paper-dropdown';

const OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const MULTI_SELECT_OPTIONS = [
  { label: 'White', value: 'white' },
  { label: 'Red', value: 'red' },
  { label: 'Blue', value: 'blue' },
  { label: 'Green', value: 'green' },
  { label: 'Orange', value: 'orange' },
];

const CustomDropdownItem = ({
  width,
  option,
  value,
  onSelect,
  toggleMenu,
  isLast,
}: DropdownItemProps) => {
  const theme = useTheme<any>();
  
  const style: ViewStyle = useMemo(
    () => ({
      height: 50,
      width,
      backgroundColor:
        value === option.value
          ? theme.colors.primary
          : theme.colors.surface,
      justifyContent: 'center',
      paddingHorizontal: 16,
    }),
    [option.value, value, width, theme.colors.primary, theme.colors.surface],
  );

  return (
    <>
      <TouchableRipple
        onPress={() => {
          onSelect?.(option.value);
          toggleMenu();
        }}
        style={style}
      >
        <Headline
          style={{
            color:
              value === option.value
                ? theme.colors.onPrimary
                : theme.colors.primary,
            fontSize: 16,
          }}
        >
          {option.label}
        </Headline>
      </TouchableRipple>
      {!isLast && <Divider />}
    </>
  );
};

const CustomDropdownInput = ({
  placeholder,
  selectedLabel,
  rightIcon,
  value,
  showSoftInputOnFocus,
  autoFocus,
  disabled,
  error,
  mode,
  ...rest
}: DropdownInputProps) => {
  const theme = useTheme<any>();

  return (
    <TextInput
      mode={mode || 'outlined'}
      placeholder={placeholder}
      value={selectedLabel || value}
      right={rightIcon}
      showSoftInputOnFocus={showSoftInputOnFocus}
      autoFocus={autoFocus}
      disabled={disabled}
      error={error}
      style={styles.customDropdownInput}
      outlineStyle={styles.customOutline} // Custom outline style
      theme={{
        colors: {
          primary: '#6200ee', // Border color when focused
          outline: '#4a4a4a', // Default border color
          background: '#f5f5f5', // Background color
          surface: '#ffffff', // Input background
        },
      }}
      {...rest}
    />
  );
};

export default function App() {
  const [nightMode, setNightMode] = useState(false);
  const [gender, setGender] = useState<string>();
  const [gender2, setGender2] = useState<string>();
  const [gender3, setGender3] = useState<string>();
  const [colors, setColors] = useState<string[]>([]);
  const Theme = nightMode ? MD3DarkTheme : MD3LightTheme;

  return (
    <ThemeProvider theme={Theme}>
      <PaperProvider theme={Theme}>
        <View
          style={[
            styles.container,
            { backgroundColor: Theme.colors.background },
          ]}
        >
          <Appbar.Header elevated>
            <Appbar.Content title="Dropdown Demo" />
            <Appbar.Action
              icon={nightMode ? 'brightness-7' : 'brightness-3'}
              onPress={() => setNightMode(!nightMode)}
            />
          </Appbar.Header>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.formWrapper}>
              <Headline>Custom Styled Dropdowns</Headline>
              
              <Paragraph style={styles.sectionTitle}>1. Default Outlined Mode</Paragraph>
              <Dropdown
                label="Gender"
                placeholder="Select Gender"
                options={OPTIONS}
                value={gender}
                onSelect={setGender}
                mode="outlined"
              />
              
              <View style={styles.spacer} />
              
              <Paragraph style={styles.sectionTitle}>
                2. Custom Border & Background Color
              </Paragraph>
              <Dropdown
                label="Gender"
                placeholder="Select Gender"
                options={OPTIONS}
                value={gender2}
                onSelect={setGender2}
                mode="outlined"
                theme={{
                  colors: {
                    primary: '#2196F3', // Focused border color
                    outline: '#64B5F6', // Default border color
                    background: '#E3F2FD', // Background color
                    surface: '#BBDEFB', // Input surface color
                  },
                  roundness: 12, // Border radius
                }}
                dropdownStyle={styles.customDropdown}
                inputProps={{
                  style: styles.customInput,
                  outlineStyle: styles.customOutlineStyle,
                }}
              />
              
              <View style={styles.spacer} />
              
              <Paragraph style={styles.sectionTitle}>
                3. Custom with Error State
              </Paragraph>
              <Dropdown
                label="Gender (Required)"
                placeholder="Select Gender"
                options={OPTIONS}
                value={gender3}
                onSelect={setGender3}
                mode="outlined"
                error={!gender3}
                theme={{
                  colors: {
                    primary: '#F44336', // Red border when focused
                    outline: '#EF9A9A', // Light red border
                    error: '#F44336',
                    background: '#FFEBEE',
                  },
                }}
              />
              
              <View style={styles.spacer} />
              
              <Paragraph style={styles.sectionTitle}>
                4. Custom with CustomDropdownInput Component
              </Paragraph>
              <Dropdown
                label="Gender"
                placeholder="Select Gender"
                options={OPTIONS}
                value={gender}
                onSelect={setGender}
                mode="outlined"
                CustomDropdownInput={CustomDropdownInput}
                      statusBarHeight={100}
              />
              
                           <Dropdown
                label="Gender"
                placeholder="Select Gender"
                options={OPTIONS}
                value={gender}
                onSelect={setGender}
                mode="outlined"
                CustomDropdownInput={CustomDropdownInput}
                      statusBarHeight={100}
              />
              
                           <Dropdown
                label="Gender"
                placeholder="Select Gender"
                options={OPTIONS}
                value={gender}
                onSelect={setGender}
                mode="outlined"
                CustomDropdownInput={CustomDropdownInput}
                      statusBarHeight={100}
              />
              
              <View style={styles.spacer} />
              
              <Paragraph style={styles.sectionTitle}>
                5. Multi Select with Custom Styling
              </Paragraph>
              <MultiSelectDropdown
                label="Colors"
                placeholder="Select Colors"
                options={MULTI_SELECT_OPTIONS}
                value={colors}
                onSelect={setColors}
                mode="outlined"
                theme={{
                  colors: {
                    primary: '#4CAF50',
                    outline: '#A5D6A7',
                    background: '#E8F5E9',
                  },
                }}
              />
            </View>
          </ScrollView>
        </View>
      </PaperProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formWrapper: {
    margin: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 14,
  },
  spacer: {
    marginVertical: 16,
  },
  customDropdownInput: {
    backgroundColor: '#F5F5F5',
    fontSize: 16,
  },
  customOutline: {
    borderWidth: 2,
    borderRadius: 12,
  },
  customDropdown: {
    backgroundColor: '#FFF9C4',
    borderRadius: 12,
  },
  customInput: {
    backgroundColor: '#FFF9C4',
    fontWeight: '500',
  },
  customOutlineStyle: {
    borderColor: '#FF9800',
    borderWidth: 2,
    borderRadius: 12,
  },
});

// Alternative approach: If you want to directly style without custom components
// You can create a wrapper component like this:

export const StyledDropdown = (props: any) => {
  return (
    <View style={styles.styledDropdownContainer}>
      <Dropdown
        {...props}
        mode="outlined"
        theme={{
          colors: {
            primary: '#FF5722', // Focused state color
            outline: '#FFAB91', // Outline color
            background: '#FBE9E7', // Background
          },
          roundness: 16,
        }}
        dropdownStyle={styles.styledDropdown}
      />
    </View>
  );
};

const additionalStyles = StyleSheet.create({
  styledDropdownContainer: {
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  styledDropdown: {
    backgroundColor: '#FFF3E0',
    borderWidth: 2,
    borderColor: '#FF9800',
    borderRadius: 16,
  },
});