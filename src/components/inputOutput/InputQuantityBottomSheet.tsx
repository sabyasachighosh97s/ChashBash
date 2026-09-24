import React, {
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {Portal} from 'react-native-paper';

import {
  Headline,
  Paragraph,
} from '@components/ui';

import AppIcon from '@components/AppIcon/AppIcon';

import useThemeMode from '@hook/useThemeMode';

import colors from '@themes/colors';

import FormdownInput from '@components/forms/FormdownInput';

import {useForm} from 'react-hook-form';

import {useTranslation} from 'react-i18next';

import {InputItem} from './InputItemCard';

/* ==========================================================================
   Types
========================================================================== */

type PackageOption = {
  label: string;
  value: string;
};

type FormData = {
  packageSize: string;
};

type Props = {
  visible: boolean;

  item: InputItem | null;

  initialQuantity?: number;

  initialPackageSize?: string;

  onClose: () => void;

  onAdd: (
    item: InputItem,
    quantity: number,
    packageSize: string,
  ) => void;
};

const MIN_QUANTITY = 1;

/* ==========================================================================
   Component
========================================================================== */

const InputQuantityBottomSheet = ({
  visible,
  item,
  initialQuantity = MIN_QUANTITY,
  initialPackageSize,
  onClose,
  onAdd,
}: Props) => {
  const {theme} = useThemeMode();

  const {t} = useTranslation();

  const [
    quantity,
    setQuantity,
  ] = useState(initialQuantity);

  const [imageLoadFailed, setImageLoadFailed] =
    useState(false);

  /* ------------------------------------------------------------------------
     Package options
  ------------------------------------------------------------------------ */

  const packageOptions = useMemo<PackageOption[]>(
    () =>
      (item?.agri_product_prices ?? []).map(
        (packet, index) => {
          const unit =
            packet?.unit?.unit_name ||
            packet?.unit?.unit_sname ||
            '';

          const quantityValue = packet?.quantity;

          const label =
            quantityValue !== undefined &&
            quantityValue !== null &&
            quantityValue !== ''
              ? `${quantityValue} ${unit}`.trim()
              : unit || t('packet');

          return {
            label,
            value: String(
              packet?.prod_price_id ??
                `packet-${index}`,
            ),
          };
        },
      ),
    [item?.agri_product_prices, t],
  );

  const defaultPackageValue =
    initialPackageSize &&
    packageOptions.some(
      option =>
        option.value ===
        String(initialPackageSize),
    )
      ? String(initialPackageSize)
      : packageOptions[0]?.value ?? '';

  /* ------------------------------------------------------------------------
     Package dropdown form
  ------------------------------------------------------------------------ */

  const {
    control,
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      packageSize:
        defaultPackageValue,
    },
  });

  /*
   * Keep a local selected package value as well.
   *
   * This prevents the selected option from falling back
   * to the initial package value after selecting another option.
   */
  const [
    selectedPackage,
    setSelectedPackage,
  ] = useState(defaultPackageValue);

  const formPackageSize =
    watch('packageSize');

  /*
   * Use the local selected value as the source for
   * the preview and Add action.
   */
  const selectedPackageSize =
    selectedPackage ||
    formPackageSize ||
    defaultPackageValue;

  /* ------------------------------------------------------------------------
     Reset sheet state
  ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!visible) {
      return;
    }

    const packageSize =
      initialPackageSize &&
      packageOptions.some(
        option =>
          option.value ===
          String(initialPackageSize),
      )
        ? String(initialPackageSize)
        : packageOptions[0]?.value ?? '';

    setQuantity(
      Math.max(
        MIN_QUANTITY,
        initialQuantity,
      ),
    );

    setSelectedPackage(packageSize);

    reset({
      packageSize,
    });

    setImageLoadFailed(false);
  }, [
    visible,
    item?.id,
    item?.fid,
    initialQuantity,
    initialPackageSize,
    packageOptions,
    reset,
  ]);

  /* ------------------------------------------------------------------------
     No item
  ------------------------------------------------------------------------ */

  if (!item) {
    return null;
  }

  /* ------------------------------------------------------------------------
     Product information
  ------------------------------------------------------------------------ */

  const productName =
    item.product_name ||
    item.name ||
    t('input_item');

  const selectedPacketIndex =
    packageOptions.findIndex(
      option =>
        option.value ===
        selectedPackageSize,
    );

  const selectedPacket =
    selectedPacketIndex >= 0
      ? item.agri_product_prices?.[
          selectedPacketIndex
        ]
      : item.agri_product_prices?.[0];

  const price =
    selectedPacket?.discounted_price ??
    selectedPacket?.sales_price ??
    selectedPacket?.price;

  const originalPrice =
    selectedPacket?.sales_price ??
    selectedPacket?.price;

  const unitName =
    selectedPacket?.unit?.unit_name ||
    selectedPacket?.unit?.unit_sname ||
    '';

  const packageQuantity =
    selectedPacket?.quantity;

  const productImage =
    item.image ||
    item.image_url;

  const priceText =
    price !== undefined &&
    price !== null
      ? `₹${price}`
      : '';

  const packageText =
    packageQuantity !== undefined &&
    packageQuantity !== null &&
    packageQuantity !== ''
      ? `${packageQuantity} ${unitName}`.trim()
      : unitName;

  const hasDiscount =
    selectedPacket?.discounted_price !==
      undefined &&
    selectedPacket?.discounted_price !==
      null &&
    String(selectedPacket.discounted_price) !==
      String(originalPrice ?? '');

  /* ------------------------------------------------------------------------
     Quantity
  ------------------------------------------------------------------------ */

  const decreaseQuantity = () => {
    setQuantity(current =>
      Math.max(
        MIN_QUANTITY,
        current - 1,
      ),
    );
  };

  const increaseQuantity = () => {
    setQuantity(current =>
      current + 1,
    );
  };

  /* ------------------------------------------------------------------------
     Package selection
  ------------------------------------------------------------------------ */

  const handlePackageSelect = (
    value: string,
  ) => {
    /*
     * Update local state immediately.
     */
    setSelectedPackage(value);

    /*
     * Also explicitly update react-hook-form.
     * This makes the selection persistent in both
     * the dropdown and form state.
     */
    setValue(
      'packageSize',
      value,
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
  };

  /* ------------------------------------------------------------------------
     Add
  ------------------------------------------------------------------------ */

  const handleAdd = () => {
    onAdd(
      item,
      quantity,
      selectedPackageSize,
    );
  };

  /* ------------------------------------------------------------------------
     UI
  ------------------------------------------------------------------------ */

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Portal.Host>
        <View style={styles.overlay}>

          {/* Backdrop */}

          <TouchableOpacity
            activeOpacity={1}
            onPress={onClose}
            style={styles.backdrop}
          />

          {/* Sheet */}

          <View
            style={[
              styles.sheet,
              {
                backgroundColor:
                  colors.surface,
              },
            ]}
          >

            {/* Handle */}

            <View
              style={styles.handle}
            />

            {/* ================================================================
                Header
            ================================================================= */}

            <View
              style={styles.header}
            >
              <View
                style={styles.headerText}
              >
                <Headline
                  size="md"
                  textColor={
                    colors.text
                  }
                >
                  {t('how_many_want')}
                </Headline>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onClose}
                style={
                  styles.closeButton
                }
              >
                <AppIcon
                  type="MaterialIcons"
                  name="close"
                  size={21}
                  color={
                    colors.subText
                  }
                />
              </TouchableOpacity>
            </View>

            {/* ================================================================
                Product
            ================================================================= */}

            <View
              style={styles.productBox}
            >
              <View
                style={
                  styles.productVisual
                }
              >
                {productImage &&
                !imageLoadFailed ? (
                  <Image
                    source={{
                      uri: productImage,
                    }}
                    style={
                      styles.productImage
                    }
                    resizeMode="cover"
                    onError={() =>
                      setImageLoadFailed(
                        true,
                      )
                    }
                  />
                ) : (
                  <View
                    style={
                      styles.productIcon
                    }
                  >
                    <AppIcon
                      type="MaterialIcons"
                      name="inventory-2"
                      size={24}
                      color={
                        colors.primary
                      }
                    />
                  </View>
                )}
              </View>

              <View
                style={
                  styles.productInfo
                }
              >
                <Headline
                  size="sm"
                  numberOfLines={2}
                  textColor={
                    colors.text
                  }
                >
                  {productName}
                </Headline>

                <View
                  style={styles.meta}
                >
                  {priceText ? (
                    <View
                      style={
                        styles.priceGroup
                      }
                    >
                      <Paragraph
                        size="xs"
                        textColor={
                          colors.primary
                        }
                        style={
                          styles.price
                        }
                      >
                        {priceText}
                      </Paragraph>

                      {hasDiscount ? (
                        <Paragraph
                          size="xs"
                          textColor={
                            colors.subText
                          }
                          style={
                            styles.originalPrice
                          }
                        >
                          ₹{originalPrice}
                        </Paragraph>
                      ) : null}
                    </View>
                  ) : null}

                  {packageText ? (
                    <Paragraph
                      size="xs"
                      textColor={
                        colors.subText
                      }
                    >
                      / {packageText}
                    </Paragraph>
                  ) : null}
                </View>
              </View>
            </View>

            {/* ================================================================
                Package / Measure Dropdown
            ================================================================= */}

            <View
              style={
                styles.packageDropdown
              }
            >
              <FormdownInput
                control={control}
                name="packageSize"
                labelText={t('package_quantity')}
                data={packageOptions}
                placeholder={t(
                  'select_package_quantity',
                )}
                onSelect={
                  handlePackageSelect
                }
              />
            </View>

            {/* ================================================================
                Quantity Count
            ================================================================= */}

            <Paragraph
              size="sm"
              textColor={
                colors.text
              }
              style={
                styles.quantityLabel
              }
            >
              {t('quantity')}
            </Paragraph>

            <View
              style={
                styles.quantityRow
              }
            >

              {/* Minus */}

              <TouchableOpacity
                activeOpacity={0.8}
                disabled={
                  quantity <=
                  MIN_QUANTITY
                }
                onPress={
                  decreaseQuantity
                }
                style={[
                  styles.quantityButton,
                  quantity <=
                    MIN_QUANTITY &&
                    styles.disabledButton,
                ]}
              >
                <AppIcon
                  type="MaterialIcons"
                  name="remove"
                  size={24}
                  color={
                    quantity <=
                    MIN_QUANTITY
                      ? colors.disabled
                      : colors.primary
                  }
                />
              </TouchableOpacity>

              {/* Value */}

              <View
                style={
                  styles.quantityValue
                }
              >
                <Headline
                  size="lg"
                  textColor={
                    colors.text
                  }
                >
                  {quantity}
                </Headline>

                <Paragraph
                  size="xs"
                  textColor={
                    colors.subText
                  }
                >
                  {t('pieces')}
                </Paragraph>
              </View>

              {/* Plus */}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={
                  increaseQuantity
                }
                style={
                  styles.quantityButton
                }
              >
                <AppIcon
                  type="MaterialIcons"
                  name="add"
                  size={24}
                  color={
                    colors.primary
                  }
                />
              </TouchableOpacity>
            </View>

            {/* ================================================================
                Selected Package Preview
            ================================================================= */}

            <View
              style={
                styles.selectedPackage
              }
            >
              <AppIcon
                type="MaterialIcons"
                name="inventory-2"
                size={17}
                color={
                  colors.primary
                }
              />

              <Paragraph
                size="xs"
                textColor={
                  colors.subText
                }
                style={
                  styles.selectedPackageText
                }
              >
                {quantity} {t('pieces')} ×{' '}
                {packageOptions.find(
                  option =>
                    option.value ===
                    selectedPackageSize,
                )?.label ??
                  packageText ??
                  t('packet')}
              </Paragraph>
            </View>

            {/* ================================================================
                Notice
            ================================================================= */}

            <View
              style={styles.notice}
            >
              <AppIcon
                type="MaterialIcons"
                name="info-outline"
                size={18}
                color={
                  colors.info
                }
              />

              <Paragraph
                size="xs"
                textColor={
                  colors.subText
                }
                style={
                  styles.noticeText
                }
              >
                {t('request_list_notice')}
              </Paragraph>
            </View>

            {/* ================================================================
                Add
            ================================================================= */}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleAdd}
              disabled={
                packageOptions.length === 0
              }
              style={[
                styles.addButton,
                packageOptions.length === 0 &&
                  styles.disabledAddButton,
              ]}
            >
              <AppIcon
                type="MaterialIcons"
                name="playlist-add-check"
                size={21}
                color={
                  colors.textLight
                }
              />

              <Paragraph
                size="sm"
                textColor={
                  colors.textLight
                }
                style={
                  styles.addText
                }
              >
                {initialQuantity > 1
                  ? t('update_request')
                  : t('add_to_my_request')}
              </Paragraph>
            </TouchableOpacity>

          </View>
        </View>
      </Portal.Host>
    </Modal>
  );
};

export default memo(
  InputQuantityBottomSheet,
);

/* ==========================================================================
   Styles
========================================================================== */

const styles =
  StyleSheet.create({

    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },

    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor:
        colors.backdrop,
    },

    sheet: {
      width: '100%',

      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,

      paddingHorizontal: 20,
      paddingTop: 9,
      paddingBottom: 24,

      elevation: 12,
    },

    handle: {
      width: 42,
      height: 4,

      borderRadius: 2,

      alignSelf: 'center',

      backgroundColor:
        colors.border,

      marginBottom: 16,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },

    headerText: {
      flex: 1,
    },

    closeButton: {
      width: 38,
      height: 38,

      borderRadius: 19,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        colors.textMuted,
    },

    productBox: {
      flexDirection: 'row',
      alignItems: 'center',

      padding: 14,

      borderRadius: 18,

      backgroundColor:
        colors.background,

      borderWidth: 1,
      borderColor:
        colors.border,

      marginBottom: 8,
    },

    productVisual: {
      width: 52,
      height: 52,
      borderRadius: 15,
      overflow: 'hidden',
      backgroundColor: `${colors.primary}12`,
    },

    productImage: {
      width: '100%',
      height: '100%',
    },

    productIcon: {
      flex: 1,
      width: '100%',
      height: 48,

      borderRadius: 15,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        `${colors.primary}12`,
    },

    productInfo: {
      flex: 1,
      marginLeft: 12,
    },

    priceGroup: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },

    originalPrice: {
      marginLeft: 6,
      textDecorationLine: 'line-through',
    },

    meta: {
      flexDirection: 'row',
      alignItems: 'center',

      marginTop: 5,
    },

    price: {
      fontWeight: '700',
      marginRight: 6,
    },

    packageDropdown: {
      width: '100%',
      marginTop: 2,
      marginBottom: 2,

      zIndex: 1000,
      elevation: 1000,
    },

    quantityLabel: {
      marginTop: 4,
      marginBottom: 8,
      fontWeight: '600',
    },

    quantityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

      marginBottom: 10,
    },

    quantityButton: {
      width: 52,
      height: 52,

      borderRadius: 16,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        `${colors.primary}10`,

      borderWidth: 1,
      borderColor:
        `${colors.primary}25`,
    },

    disabledButton: {
      opacity: 0.5,
    },

    quantityValue: {
      minWidth: 90,

      alignItems: 'center',
      justifyContent: 'center',
    },

    selectedPackage: {
      flexDirection: 'row',
      alignItems: 'center',

      alignSelf: 'center',

      paddingHorizontal: 14,
      paddingVertical: 8,

      borderRadius: 14,

      backgroundColor:
        `${colors.primary}10`,

      marginBottom: 12,
    },

    selectedPackageText: {
      marginLeft: 7,
      fontWeight: '600',
    },

    notice: {
      flexDirection: 'row',
      alignItems: 'flex-start',

      paddingHorizontal: 4,
      marginBottom: 14,
    },

    noticeText: {
      flex: 1,
      marginLeft: 8,
      lineHeight: 18,
    },

    addButton: {
      minHeight: 52,

      borderRadius: 16,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        colors.primary,

      paddingHorizontal: 16,
    },

    addText: {
      marginLeft: 8,
      fontWeight: '700',
    },

    disabledAddButton: {
      opacity: 0.5,
    },
  });