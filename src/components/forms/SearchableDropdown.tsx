import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  Keyboard,
} from 'react-native';
import {ReactElement} from 'react';
const {width: screenWidth} = Dimensions.get('window');

type MuiDropdownProps = {
  data?: any[];
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  onSelect?: (value: any, item?: any) => void;
  value?: any;
  maxHeight?: number;
  disabled?: boolean;
  searchable?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
  error?: boolean;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  renderItem?: (
    item: any,
    index: number,
    onSelect: (item: any) => void,
  ) => React.ReactNode;
  keyExtractor?: (item: any, index: number) => string;
  displayKey?: string;
  valueKey?: string;
  style?: any;
  dropdownStyle?: any;
  itemStyle?: any;
  textStyle?: any;
  searchStyle?: any;
  color?: 'primary' | 'secondary';
  backgroundColor?: string;
};

const MuiDropdown = ({
  data = [],
  label = '',
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  onSelect,
  value,
  maxHeight = 200,
  disabled = false,
  searchable = true,
  variant = 'outlined', // 'outlined', 'filled', 'standard'
  size = 'medium', // 'small', 'medium', 'large'
  error = false,
  helperText = '',
  required = false,
  fullWidth = true,
  renderItem,
  keyExtractor = (item, index) => index.toString(),
  displayKey = 'label',
  valueKey = 'value',
  style,
  dropdownStyle,
  itemStyle,
  textStyle,
  searchStyle,
  color = 'primary', // 'primary', 'secondary'
  backgroundColor = '#fff',
}: MuiDropdownProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [dropdownLayout, setDropdownLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [isFocused, setIsFocused] = useState(false);

  const dropdownRef = useRef<View>(null);
  const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderAnimation = useRef(new Animated.Value(0)).current;

  // Material Design colors
  const colors = {
    primary: '#1976d2',
    primaryLight: '#42a5f5',
    secondary: '#dc004e',
    secondaryLight: '#f48fb1',
    error: '#d32f2f',
    errorLight: '#f44336',
    text: '#212121',
    textSecondary: '#757575',
    disabled: '#bdbdbd',
    divider: '#e0e0e0',
    background: '#fafafa',
  };

  const getColor = () => {
    if (error) return colors.error;
    if (color === 'secondary') return colors.secondary;
    return colors.primary;
  };

  const getLightColor = () => {
    if (error) return colors.errorLight;
    if (color === 'secondary') return colors.secondaryLight;
    return colors.primaryLight;
  };

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    if (searchable) {
      const filtered = data.filter(item => {
        const itemText = typeof item === 'string' ? item : item[displayKey];
        return itemText.toLowerCase().includes(searchText.toLowerCase());
      });
      setFilteredData(filtered);
    }
  }, [searchText, data, displayKey, searchable]);

  useEffect(() => {
    Animated.timing(labelAnimation, {
      toValue: isFocused || value || isVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, isVisible]);

  useEffect(() => {
    Animated.timing(borderAnimation, {
      toValue: isFocused || isVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, isVisible]);

  const measureDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownLayout({x: px, y: py + height, width, height});
      });
    }
  };

  const toggleDropdown = () => {
    if (disabled) return;

    if (!isVisible) {
      measureDropdown();
      setIsVisible(true);
      setIsFocused(true);
    } else {
      setIsVisible(false);
      setIsFocused(false);
      setSearchText('');
    }
  };

  const handleItemSelect = (item: {[x: string]: any}) => {
    const selectedValue = typeof item === 'string' ? item : item[valueKey];
    onSelect && onSelect(selectedValue, item);
    setIsVisible(false);
    setIsFocused(false);
    setSearchText('');
    Keyboard.dismiss();
  };

  const getDisplayText = () => {
    if (value === null || value === undefined) return '';

    if (typeof value === 'string') return value;

    const selectedItem = data.find(item => {
      const itemValue = typeof item === 'string' ? item : item[valueKey];
      return itemValue === value;
    });

    return selectedItem
      ? typeof selectedItem === 'string'
        ? selectedItem
        : selectedItem[displayKey]
      : '';
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {paddingVertical: 8, fontSize: 14, minHeight: 40};
      case 'large':
        return {paddingVertical: 16, fontSize: 18, minHeight: 56};
      default:
        return {paddingVertical: 12, fontSize: 16, minHeight: 48};
    }
  };

  const getVariantStyles = () => {
    const sizeStyles = getSizeStyles();
    const primaryColor = getColor();

    const baseStyle = {
      paddingHorizontal: 12,
      ...sizeStyles,
      borderRadius: variant === 'standard' ? 0 : 4,
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: disabled
            ? colors.disabled + '20'
            : colors.background,
          borderBottomWidth: 2,
          borderBottomColor: borderAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [colors.divider, primaryColor],
          }),
        };
      case 'standard':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderBottomWidth: 1,
          borderBottomColor: borderAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [colors.divider, primaryColor],
          }),
          paddingHorizontal: 0,
        };
      default: // outlined
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.disabled + '10' : backgroundColor,
          borderWidth: 1,
          borderColor: borderAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [colors.divider, primaryColor],
          }),
        };
    }
  };

  const renderDropdownItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }): ReactElement | null => {
    if (renderItem) {
      const rendered = renderItem(item, index, handleItemSelect);
      // Only return if it's a valid React element, otherwise return null
      return React.isValidElement(rendered) ? rendered : null;
    }

    const itemText = typeof item === 'string' ? item : item[displayKey];
    const itemValue = typeof item === 'string' ? item : item[valueKey];
    const isSelected = itemValue === value;

    return (
      <TouchableOpacity
        style={[
          styles.dropdownItem,
          itemStyle,
          isSelected && {backgroundColor: getLightColor() + '20'},
        ]}
        onPress={() => handleItemSelect(item)}>
        <Text
          style={[
            styles.dropdownItemText,
            textStyle,
            isSelected && {color: getColor(), fontWeight: '500'},
          ]}>
          {itemText}
        </Text>
      </TouchableOpacity>
    );
  };

  const labelStyle = {
    position: 'absolute' as 'absolute',
    left: variant === 'standard' ? 0 : 12,
    color: disabled
      ? colors.disabled
      : error
      ? colors.error
      : isFocused || isVisible
      ? getColor()
      : colors.textSecondary,
    fontSize: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [getSizeStyles().fontSize, 12],
    }),
    top: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [getSizeStyles().paddingVertical + 2, -8],
    }),
    backgroundColor: variant === 'outlined' ? backgroundColor : 'transparent',
    paddingHorizontal: variant === 'outlined' ? 4 : 0,
    zIndex: 1,
  };

  return (
    <View style={[styles.container, fullWidth && {width: '100%'}, style]}>
      {label && (
        <Animated.Text style={[styles.label, labelStyle]}>
          {label}
          {required && ' *'}
        </Animated.Text>
      )}

      <Animated.View
        ref={dropdownRef}
        style={[
          styles.dropdown,
          getVariantStyles(),
          disabled && styles.disabled,
          dropdownStyle,
        ]}>
        <TouchableOpacity
          style={styles.dropdownTouchable}
          onPress={toggleDropdown}
          disabled={disabled}>
          <Text
            style={[
              styles.dropdownText,
              textStyle,
              {
                color: disabled
                  ? colors.disabled
                  : getDisplayText()
                  ? colors.text
                  : colors.textSecondary,
                fontSize: getSizeStyles().fontSize,
              },
            ]}
            numberOfLines={1}>
            {getDisplayText() || placeholder}
          </Text>
          <Animated.Text
            style={[
              styles.arrow,
              {
                transform: [
                  {
                    rotate: isVisible ? '180deg' : '0deg',
                  },
                ],
                color: disabled ? colors.disabled : colors.textSecondary,
              },
            ]}>
            ▼
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>

      {helperText && (
        <Text
          style={[
            styles.helperText,
            {color: error ? colors.error : colors.textSecondary},
          ]}>
          {helperText}
        </Text>
      )}

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}>
          <View
            style={[
              styles.dropdownContainer,
              {
                left: dropdownLayout.x,
                top: dropdownLayout.y,
                width: dropdownLayout.width,
                maxHeight: maxHeight + (searchable ? 60 : 0),
              },
            ]}>
            {searchable && (
              <View style={styles.searchContainer}>
                <TextInput
                  style={[styles.searchInput, searchStyle]}
                  placeholder={searchPlaceholder}
                  placeholderTextColor={colors.textSecondary}
                  value={searchText}
                  onChangeText={setSearchText}
                  autoFocus={false}
                />
              </View>
            )}

            <FlatList
              data={filteredData}
              renderItem={renderDropdownItem}
              keyExtractor={keyExtractor}
              style={[styles.flatList, {maxHeight}]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              ListEmptyComponent={
                <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
                  No options available
                </Text>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
    marginVertical: 8,
  },
  label: {
    fontWeight: '400',
    position: 'absolute',
  },
  dropdown: {
    position: 'relative',
  },
  dropdownTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  disabled: {
    opacity: 0.6,
  },
  dropdownText: {
    flex: 1,
    color: '#212121',
  },
  arrow: {
    fontSize: 12,
    marginLeft: 8,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
    fontWeight: '400',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 1000,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 0,
    fontSize: 16,
    color: '#212121',
  },
  flatList: {
    flexGrow: 0,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
    justifyContent: 'center',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '400',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
    fontSize: 14,
  },
});

export default MuiDropdown;

// Usage Example:
/*
import MuiDropdown from './MuiDropdown';

const App = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedValue2, setSelectedValue2] = useState('');
  const [selectedValue3, setSelectedValue3] = useState('');
  
  const data = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Date', value: 'date' },
    { label: 'Elderberry', value: 'elderberry' },
  ];

  return (
    <View style={{ padding: 20 }}>
      <MuiDropdown
        data={data}
        label="Fruits"
        placeholder="Select a fruit"
        value={selectedValue}
        onSelect={(value) => setSelectedValue(value)}
        variant="outlined"
        size="medium"
        required
        helperText="Choose your favorite fruit"
      />
      
      <MuiDropdown
        data={data}
        label="Filled Variant"
        placeholder="Select option"
        value={selectedValue2}
        onSelect={(value) => setSelectedValue2(value)}
        variant="filled"
        color="secondary"
      />
      
      <MuiDropdown
        data={data}
        label="Standard Variant"
        placeholder="Select option"
        value={selectedValue3}
        onSelect={(value) => setSelectedValue3(value)}
        variant="standard"
        searchable={false}
        error={false}
        helperText="This is a standard variant"
      />
    </View>
  );
};
*/
