import React from 'react';

import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import { Headline, Paragraph } from '@components/ui';

import AppIcon from '@components/AppIcon/AppIcon';

import useThemeMode from '@hook/useThemeMode';

import { useTranslation } from 'react-i18next';

type CropFilterItem = {
  value: string;
  label: string;
};

type CropFilterModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedCrop: string;
  onSelect: (crop: string) => void;
  cropList: CropFilterItem[];
};

const CropFilterModal = ({
  visible,
  onClose,
  selectedCrop,
  onSelect,
  cropList,
}: CropFilterModalProps) => {
  const { theme } = useThemeMode();

  const { t } = useTranslation();

  // ==========================================
  // SELECT CROP
  // ==========================================

  const handleSelect = (crop: CropFilterItem) => {
    onSelect(crop.value);

    onClose();
  };

  // ==========================================
  // CLEAR FILTER
  // ==========================================

  const handleClearFilter = () => {
    // Reset to default "All Crops"
    onSelect('all');

    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          {/* ==================================
              HEADER
          ================================== */}

          <View style={styles.header}>
            <Headline
              size="md"
              style={[
                styles.title,
                {
                  color: theme.colors.text,
                },
              ]}
            >
              {t('select_crop')}
            </Headline>

            {/* ==================================
                CLOSE BUTTON
            ================================== */}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.closeButton}
            >
              <AppIcon
                type="MaterialCommunityIcons"
                name="close"
                size={24}
                color="#D32F2F"
              />
            </TouchableOpacity>
          </View>

          {/* ==================================
              DIVIDER
          ================================== */}

          <View
            style={[
              styles.divider,
              {
                backgroundColor: theme.colors.outline,
              },
            ]}
          />

          {/* ==================================
              CROP LIST
          ================================== */}

          <FlatList
            data={cropList}
            keyExtractor={(item, index) => `${item.value}-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isSelected = selectedCrop === item.value;

              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSelect(item)}
                  style={[
                    styles.cropItem,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.background,

                      borderColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.outline,
                    },
                  ]}
                >
                  <Paragraph
                    size="sm"
                    style={[
                      styles.cropText,
                      {
                        color: isSelected ? '#FFFFFF' : theme.colors.text,
                      },
                    ]}
                  >
                    {item.label}
                  </Paragraph>

                  {isSelected ? (
                    <AppIcon
                      type="MaterialCommunityIcons"
                      name="check"
                      size={20}
                      color="#FFFFFF"
                    />
                  ) : null}
                </TouchableOpacity>
              );
            }}
          />

          {/* ==================================
              CLEAR FILTER
          ================================== */}

          {selectedCrop !== 'all' ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleClearFilter}
              style={[
                styles.clearButton,
                {
                  borderTopColor: theme.colors.outline,
                },
              ]}
            >
              <AppIcon
                type="MaterialCommunityIcons"
                name="filter-remove-outline"
                size={20}
                color={theme.colors.primary}
              />

              <Paragraph
                size="sm"
                style={[
                  styles.clearText,
                  {
                    color: theme.colors.primary,
                  },
                ]}
              >
                {t('clear_filter')}
              </Paragraph>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

export default CropFilterModal;

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    backgroundColor: 'rgba(0,0,0,0.45)',

    justifyContent: 'center',

    alignItems: 'center',

    paddingHorizontal: 20,
  },

  modalContainer: {
    width: '100%',

    maxHeight: '75%',

    borderRadius: 20,

    overflow: 'hidden',

    elevation: 8,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,

      height: 4,
    },

    shadowOpacity: 0.2,

    shadowRadius: 8,
  },

  header: {
    minHeight: 62,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    paddingLeft: 20,

    paddingRight: 12,
  },

  title: {
    flex: 1,

    fontWeight: '600',
  },

  closeButton: {
    width: 38,

    height: 38,

    borderRadius: 19,

    alignItems: 'center',

    justifyContent: 'center',

    marginLeft: 10,

    backgroundColor: '#FFEBEE',
  },

  divider: {
    height: StyleSheet.hairlineWidth,

    width: '100%',
  },

  listContent: {
    padding: 16,
  },

  cropItem: {
    minHeight: 48,

    borderWidth: 1,

    borderRadius: 12,

    paddingHorizontal: 14,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: 10,
  },

  cropText: {
    flex: 1,
  },

  clearButton: {
    minHeight: 50,

    borderTopWidth: StyleSheet.hairlineWidth,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 16,
  },

  clearText: {
    marginLeft: 7,

    fontWeight: '600',
  },
});
