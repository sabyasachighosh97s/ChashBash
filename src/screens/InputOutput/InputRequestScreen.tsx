import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Container,
  Headline,
  Paragraph,
} from '@components/ui';

import AppIcon from '@components/AppIcon/AppIcon';

import useThemeMode from '@hook/useThemeMode';
import { useTranslation } from 'react-i18next';
import colors from '@themes/colors';
import { Rbutton } from '@components/common/Rbutton';
import CustomHeader from '@components/Header/CustomHeader';
import {apiGet,apiPost} from '../../api/client';
import {API_ROUTES} from '../../api/routes';
import {useAuth} from '../../context/AuthContext';


import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import {
  InputItem,
} from '@components/inputOutput/InputItemCard';

type SelectedInputItem = {
  item: InputItem;
  quantity: number;
  packageId?: string;
  packageSize?: string;
};

type RouteParams = {
  selectedItems?: SelectedInputItem[];
};

const InputRequestScreen =
  () => {
    const {theme} =
      useThemeMode();

    const {t} = useTranslation();
    const { token, userType, isLoggedIn } = useAuth();

    const navigation =
      useNavigation<any>();

    const route =
      useRoute<any>();

    const params =
      (route.params ??
        {}) as RouteParams;

    const [
      requestItems,
      setRequestItems,
    ] = useState<
      SelectedInputItem[]
    >(
      params.selectedItems ??
        [],
    );

    const [
      submitted,
      setSubmitted,
    ] = useState(false);

    const [
      imageLoadFailed,
      setImageLoadFailed,
    ] = useState<Record<string, boolean>>({});

    /* ======================================================================
       Counts
    ====================================================================== */

    const totalItems =
      requestItems.length;

    const totalQuantity =
      useMemo(
        () =>
          requestItems.reduce(
            (total, current) =>
              total +
              current.quantity,
            0,
          ),
        [requestItems],
      );

    /* ======================================================================
       Remove
    ====================================================================== */

    const handleRemove =
      useCallback(
        (item: InputItem) => {
          const itemId =
            item.id ?? item.fid;

          setRequestItems(
            current =>
              current.filter(
                selected =>
                  (selected.item.id ??
                    selected.item.fid) !==
                  itemId,
              ),
          );
        },
        [],
      );

/* ======================================================================
   Submit
====================================================================== */

const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = useCallback(async () => {
  if (requestItems.length === 0 || isSubmitting) {
    return;
  }

  // Guest behavior remains local, as before.
  if (userType !== 'registered' || !isLoggedIn || !token) {
    setSubmitted(true);
    return;
  }

  try {
    setIsSubmitting(true);

    /*
     * Add each selected package to the authenticated user's cart.
     *
     * Expected request body assumption:
     * {
     *   packet_id: selected package ID,
     *   quantity: selected quantity
     * }
     *
     * Backend contract must confirm these field names.
     */
    for (const selected of requestItems) {
      const availablePackages =
        selected.item.agri_product_prices ?? [];

      const selectedPacket =
        availablePackages.find(
          packet =>
            String(packet.prod_price_id) ===
            String(selected.packageId ?? ''),
        ) ??
        availablePackages.find(
          (_, index) =>
            `packet-${index}` ===
            String(selected.packageSize ?? ''),
        ) ??
        availablePackages[0];

      const packetId = selectedPacket?.prod_price_id;

      if (!packetId) {
        throw new Error(
          `Selected package ID is missing for ${
            selected.item.product_name ||
            selected.item.name ||
            'an input item'
          }`,
        );
      }

      const requestBody = {
        packet_id: packetId,
        quantity: selected.quantity,
      };

      console.log('SELECTED PACKET:', selectedPacket);
      console.log('RESOLVED PACKET ID:', packetId);
      console.log('CART POST URL:', API_ROUTES.POST.CART_ITEMS);
      console.log('CART POST BODY:', requestBody);

      // Important: post exactly once per selected item.
      await apiPost(
        API_ROUTES.POST.CART_ITEMS,
        requestBody,
        token,
      );
    }

    // Keep the existing success screen behavior.
    setSubmitted(true);
  } catch (error: any) {
 console.log('CART API ERROR STATUS:', error?.response?.status);
  console.log('CART API ERROR URL:', error?.config?.url);
  console.log('CART API ERROR METHOD:', error?.config?.method);
  console.log('CART API ERROR BODY:', error?.response?.data);

  Alert.alert(
    t('error') || 'Error',
    'কার্টে আইটেম যোগ করা যায়নি। আবার চেষ্টা করো।',
  );
  } finally {
    setIsSubmitting(false);
  }
}, [
  requestItems,
  isSubmitting,
  userType,
  isLoggedIn,
  token,
  t,
]);

    /* ======================================================================
       Product row
    ====================================================================== */

    const renderItem =
      useCallback(
        ({
          item,
        }: {
          item: SelectedInputItem;
        }) => {
          const product =
            item.item;

          const productName =
            product.product_name ||
            product.name ||
            t('input_item');

          const selectedPacket =
            product.agri_product_prices?.find(
              packet =>
                String(
                  packet?.prod_price_id ?? '',
                ) ===
                String(item.packageId ?? ''),
            ) ??
            product.agri_product_prices?.find(
              (packet, index) =>
                `packet-${index}` ===
                String(item.packageSize ?? ''),
            ) ??
            product.agri_product_prices?.[0];

          const packageQuantity =
            selectedPacket?.quantity;

          const unitName =
            selectedPacket?.unit
              ?.unit_name ||
            selectedPacket?.unit
              ?.unit_sname ||
            '';

          const effectivePrice =
            selectedPacket?.discounted_price ??
            selectedPacket?.sales_price ??
            selectedPacket?.price;

          const originalPrice =
            selectedPacket?.sales_price ??
            selectedPacket?.price;

          const hasDiscount =
            selectedPacket?.discounted_price !==
              undefined &&
            selectedPacket?.discounted_price !==
              null &&
            String(
              selectedPacket.discounted_price,
            ) !==
              String(originalPrice ?? '');

          const productImage =
            product.image ||
            product.image_url;

          const productId = String(
            product.id ?? product.fid,
          );

          return (
            <View
              style={[
                styles.itemCard,
                {
                  backgroundColor:
                    theme.colors.surface ??
                    colors.surface,

                  borderColor:
                    theme.colors.border ??
                    colors.border,
                },
              ]}>

              {/* Product image */}

              <View
                style={
                  styles.itemVisual
                }>

                {productImage &&
                !imageLoadFailed[productId] ? (
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
                        current => ({
                          ...current,
                          [productId]: true,
                        }),
                      )
                    }
                  />
                ) : (
                  <View
                    style={
                      styles.itemIcon
                    }>

                    <AppIcon
                      type="MaterialIcons"
                      name="inventory-2"
                      size={22}
                      color={
                        colors.primary
                      }
                    />

                  </View>
                )}

              </View>

              {/* Content */}

              <View
                style={
                  styles.itemContent
                }>

                <Headline
                  size="sm"
                  numberOfLines={2}
                  textColor={
                    theme.colors.text ??
                    colors.text
                  }>
                  {productName}
                </Headline>

                {(product.category ||
                  product.sub_category) ? (
                  <View
                    style={
                      styles.categoryRow
                    }>

                    {product.category ? (
                      <Paragraph
                        size="xs"
                        textColor={
                          colors.primary
                        }
                        style={
                          styles.categoryText
                        }>
                        {product.category}
                      </Paragraph>
                    ) : null}

                    {product.sub_category ? (
                      <Paragraph
                        size="xs"
                        textColor={
                          colors.subText
                        }
                        style={
                          styles.subcategoryText
                        }>
                        {product.sub_category}
                      </Paragraph>
                    ) : null}

                  </View>
                ) : null}

                <View
                  style={
                    styles.metaRow
                  }>

                  <View
                    style={
                      styles.quantityBadge
                    }>

                    <AppIcon
                      type="MaterialIcons"
                      name="inventory-2"
                      size={14}
                      color={
                        colors.primary
                      }
                    />

                    <Paragraph
                      size="xs"
                      textColor={
                        colors.primary
                      }
                      style={
                        styles.quantityText
                      }>
                      {item.quantity} {t('pieces')}
                    </Paragraph>

                  </View>

                  {packageQuantity !==
                    undefined &&
                  packageQuantity !== null ? (
                    <Paragraph
                      size="xs"
                      textColor={
                        theme.colors
                          .onSurfaceVariant ??
                        colors.subText
                      }>
                      {packageQuantity}{' '}
                      {unitName}
                    </Paragraph>
                  ) : null}

                  {effectivePrice !==
                    undefined &&
                  effectivePrice !== null ? (
                    <View
                      style={
                        styles.priceGroup
                      }>

                      <Paragraph
                        size="xs"
                        textColor={
                          colors.primary
                        }
                        style={
                          styles.effectivePrice
                        }>
                        ₹{effectivePrice}
                      </Paragraph>

                      {hasDiscount ? (
                        <Paragraph
                          size="xs"
                          textColor={
                            colors.subText
                          }
                          style={
                            styles.originalPrice
                          }>
                          ₹{originalPrice}
                        </Paragraph>
                      ) : null}

                    </View>
                  ) : null}

                </View>

              </View>

              {/* Remove */}

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() =>
                  handleRemove(
                    product,
                  )
                }
                style={
                  styles.removeButton
                }>

                <AppIcon
                  type="MaterialIcons"
                  name="delete-outline"
                  size={21}
                  color={
                    colors.error
                  }
                />

              </TouchableOpacity>

            </View>
          );
        },
        [
          handleRemove,
          theme.colors,
        ],
      );

    /* ======================================================================
       SUCCESS
    ====================================================================== */

    if (submitted) {
      return (
        <Container
          backgroundColor={
            theme.colors.background
          }
          style={
            styles.container
          }>

          <CustomHeader />

          <View
            style={
              styles.successContainer
            }>

            <View
              style={
                styles.successIcon
              }>

              <AppIcon
                type="MaterialIcons"
                name="check-circle"
                size={58}
                color={
                  colors.success
                }
              />

            </View>

         <Headline
  size="xs"
  textColor={
    colors.textLight
  }>
  {t('send_request')}
</Headline>

            <Paragraph
              size="sm"
              textColor={
                theme.colors
                  .onSurfaceVariant ??
                colors.subText
              }
              style={
                styles.successDescription
              }>
              {t('request_saved_successfully')}
            </Paragraph>

            <View
              style={
                styles.successSummary
              }>

              <View
                style={
                  styles.summaryItem
                }>

                <Headline
                  size="md"
                  textColor={
                    colors.primary
                  }>
                  {totalItems}
                </Headline>

                <Paragraph
                  size="xs"
                  textColor={
                    colors.subText
                  }>
                  {t('input_items')}
                </Paragraph>

              </View>

              <View
                style={
                  styles.summaryDivider
                }
              />

              <View
                style={
                  styles.summaryItem
                }>

                <Headline
                  size="md"
                  textColor={
                    colors.primary
                  }>
                  {totalQuantity}
                </Headline>

                <Paragraph
                  size="xs"
                  textColor={
                    colors.subText
                  }>
                  {t('total_quantity')}
                </Paragraph>

              </View>

            </View>

        <Rbutton
  title={t('back_to_inputs')}
  buttonColor={colors.primary}
  textColor={colors.textLight}
  onPress={() =>
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'InputOutput',
        },
      ],
    })
  }
/>

          </View>

        </Container>
      );
    }

    /* ======================================================================
       MAIN
    ====================================================================== */

    return (
      <Container
        backgroundColor={
          theme.colors.background
        }
        style={
          styles.container
        }>

        <CustomHeader />

        <View
          style={
            styles.content
          }>

          {/* Header */}

          <View
            style={
              styles.header
            }>

            <View
              style={
                styles.headerIcon
              }>

              <AppIcon
                type="MaterialIcons"
                name="playlist-add-check"
                size={24}
                color={
                  colors.primary
                }
              />

            </View>

            <View
              style={
                styles.headerText
              }>

              <Headline
                size="md"
                textColor={
                  theme.colors.text
                }>
                {t('my_request')}
              </Headline>

      

            </View>

            <View
              style={
                styles.countBadge
              }>

              <Paragraph
                size="sm"
                textColor={
                  colors.primary
                }
                style={
                  styles.countBadgeText
                }>
                {totalItems}
              </Paragraph>

            </View>

          </View>

          {/* Notice */}

          <View
            style={
              styles.notice
            }>

            <View
              style={
                styles.noticeIcon
              }>

              <AppIcon
                type="MaterialIcons"
                name="info-outline"
                size={18}
                color={
                  colors.info
                }
              />

            </View>

            <Paragraph
              size="xs"
              textColor={
                theme.colors
                  .onSurfaceVariant ??
                colors.subText
              }
              style={
                styles.noticeText
              }>
              {t('request_list_notice')}
            </Paragraph>

          </View>

          {/* List */}

          {requestItems.length >
          0 ? (
            <FlatList
              data={
                requestItems
              }
              renderItem={
                renderItem
              }
              keyExtractor={item =>
                String(
                  item.item.id ??
                    item.item.fid,
                )
              }
              showsVerticalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.listContent
              }
            />
          ) : (
            <View
              style={
                styles.emptyContainer
              }>

              <View
                style={
                  styles.emptyIcon
                }>

                <AppIcon
                  type="MaterialIcons"
                  name="playlist-remove"
                  size={34}
                  color={
                    colors.primary
                  }
                />

              </View>

              <Headline
                size="md"
                textColor={
                  theme.colors.text
                }>
                {t('no_input_item_selected')}
              </Headline>

              <Paragraph
                size="xs"
                textColor={
                  theme.colors
                    .onSurfaceVariant ??
                  colors.subText
                }
                style={
                  styles.emptyText
                }>
                {t('return_to_input_list_description')}
              </Paragraph>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() =>
                  navigation.goBack()
                }
                style={
                  styles.emptyButton
                }>

                <Paragraph
                  size="sm"
                  textColor={
                    colors.textLight
                  }
                  style={
                    styles.emptyButtonText
                  }>
                  {t('view_inputs')}
                </Paragraph>

              </TouchableOpacity>

            </View>
          )}

        </View>

        {/* Submit */}

        {requestItems.length >
          0 && (
         <View
  style={[
    styles.submitBar,
    {
      backgroundColor:
        colors.primary,
    },
  ]}>

            <View
              style={
                styles.submitInfo
              }>

              <View
                style={
                  styles.submitIcon
                }>

               <AppIcon
  type="MaterialIcons"
  name="send"
  size={21}
  color={colors.textLight}
/>

              </View>

              <View
                style={
                  styles.submitText
                }>

                <Headline
                  size="sm"
                 textColor={
    'rgba(255,255,255,0.78)'
  }>
  {totalItems}{t('pieces')} {t('input_items')} •{' '}
  {totalQuantity}{t('pieces')}
                </Headline>

  

              </View>

            </View>

            <TouchableOpacity
              activeOpacity={0.86}
              onPress={
                handleSubmit
              }
              disabled={isSubmitting}
              style={
                styles.submitButton
              }>

            <Paragraph
  size="xs"
  textColor={
    colors.primary
  }
  style={
    styles.submitButtonText
  }>
 {isSubmitting ? 'Submitting...' : t('send_request')}
</Paragraph>

<AppIcon
  type="MaterialIcons"
  name="send"
  size={17}
  color={
    colors.primary
  }
/>

            </TouchableOpacity>

          </View>
        )}

      </Container>
    );
  };

export default InputRequestScreen;

/* ==========================================================================
   Styles
============================================================================ */

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
    },

    content: {
      flex: 1,

      paddingHorizontal: 16,
    },

    header: {
      flexDirection: 'row',

      alignItems: 'center',

      paddingTop: 14,

      paddingBottom: 12,
    },

    headerIcon: {
      width: 46,
      height: 46,

      borderRadius: 15,

      backgroundColor:
        `${colors.primary}10`,

      alignItems: 'center',
      justifyContent: 'center',

      marginRight: 10,
    },

    headerText: {
      flex: 1,
    },

    countBadge: {
      minWidth: 34,
      height: 34,

      borderRadius: 17,

      backgroundColor:
        `${colors.primary}12`,

      alignItems: 'center',
      justifyContent: 'center',
    },

    countBadgeText: {
      fontWeight: '800',
    },

    notice: {
      flexDirection: 'row',

      alignItems: 'center',

      padding: 11,

      borderRadius: 16,

      backgroundColor:
        `${colors.info}08`,

      borderWidth: 1,

      borderColor:
        `${colors.info}18`,

      marginBottom: 12,
    },

    noticeIcon: {
      width: 34,
      height: 34,

      borderRadius: 11,

      backgroundColor:
        `${colors.info}10`,

      alignItems: 'center',
      justifyContent: 'center',

      marginRight: 9,
    },

    noticeText: {
      flex: 1,

      lineHeight: 19,
    },

    listContent: {
      paddingBottom: 100,
    },

    itemCard: {
      minHeight: 76,

      borderRadius: 18,

      borderWidth: 1,

      padding: 10,

      flexDirection: 'row',

      alignItems: 'center',

      marginBottom: 9,

      elevation: 1,
    },

    itemVisual: {
      width: 50,
      height: 50,
      borderRadius: 15,
      overflow: 'hidden',
      marginRight: 10,
    },

    productImage: {
      width: '100%',
      height: '100%',
    },

    itemIcon: {
      flex: 1,
      width: '100%',
      height: 50,

      borderRadius: 15,

      backgroundColor:
        `${colors.primary}0C`,

      alignItems: 'center',
      justifyContent: 'center',

      marginRight: 10,
    },

    categoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      // marginTop: 4,
      flexWrap: 'wrap',
    },

    categoryText: {
      fontWeight: '700',
      marginRight: 8,
      
    },

    subcategoryText: {
      fontWeight: '500',
    },

    priceGroup: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginLeft: 6,
    },

    effectivePrice: {
      fontWeight: '700',
    },

    originalPrice: {
      marginLeft: 5,
      textDecorationLine: 'line-through',
    },

    itemContent: {
      flex: 1,
    },

    metaRow: {
      flexDirection: 'row',

      alignItems: 'center',

  
    },

    quantityBadge: {
      flexDirection: 'row',

      alignItems: 'center',

      marginRight: 9,
    },

    quantityText: {
      marginLeft: 4,

      fontWeight: '700',
    },

    removeButton: {
      width: 40,
      height: 40,

      borderRadius: 13,

      backgroundColor:
        `${colors.error}08`,

      alignItems: 'center',
      justifyContent: 'center',

      marginLeft: 6,
    },

    submitBar: {
  position: 'absolute',

  left: 12,
  right: 12,
  bottom: 10,

  minHeight: 72,

  borderRadius: 21,

  paddingHorizontal: 10,

  backgroundColor:
    colors.primary,

  flexDirection: 'row',

  alignItems: 'center',

  elevation: 10,

  shadowOffset: {
    width: 0,
    height: 5,
  },

  shadowOpacity: 0.18,

  shadowRadius: 10,
},

    submitInfo: {
      flex: 1,

      flexDirection: 'row',

      alignItems: 'center',
    },

    submitIcon: {
  width: 44,
  height: 44,

  borderRadius: 14,

  backgroundColor:
    'rgba(255,255,255,0.16)',

  alignItems: 'center',
  justifyContent: 'center',

  marginRight: 9,
},

    submitText: {
      flex: 1,
       alignItems: 'center',
  justifyContent: 'center',
    },

    submitButton: {
  height: 44,

  minWidth: 112,

  borderRadius: 15,

  paddingHorizontal: 12,

  backgroundColor:
    colors.accent,

  flexDirection: 'row',

  alignItems: 'center',
  justifyContent: 'center',
},

    submitButtonText: {
      fontWeight: '700',

      marginRight: 6,
    },

    emptyContainer: {
      flex: 1,

      alignItems: 'center',
      justifyContent: 'center',

      paddingHorizontal: 28,

      paddingBottom: 70,
    },

    emptyIcon: {
      width: 72,
      height: 72,

      borderRadius: 25,

      backgroundColor:
        `${colors.accent}22`,

      alignItems: 'center',
      justifyContent: 'center',

      marginBottom: 16,
    },

    emptyText: {
      textAlign: 'center',

      lineHeight: 20,

      marginTop: 7,

      marginBottom: 17,
    },

    emptyButton: {
      minHeight: 44,

      paddingHorizontal: 20,

      borderRadius: 14,

      backgroundColor:
        colors.primary,

      alignItems: 'center',
      justifyContent: 'center',
    },

    emptyButtonText: {
      fontWeight: '700',
    },

    successContainer: {
      flex: 1,

      alignItems: 'center',
      justifyContent: 'center',

      paddingHorizontal: 28,

      paddingBottom: 70,
    },

    successIcon: {
      width: 100,
      height: 100,

      borderRadius: 35,

      backgroundColor:
        `${colors.success}10`,

      alignItems: 'center',
      justifyContent: 'center',

      marginBottom: 20,
    },

    successTitle: {
      textAlign: 'center',

      marginBottom: 8,
    },

    successDescription: {
      textAlign: 'center',

      lineHeight: 21,

      marginBottom: 24,
    },

    successSummary: {
      width: '100%',

      minHeight: 90,

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        `${colors.success}20`,

      backgroundColor:
        `${colors.success}06`,

      flexDirection: 'row',

      alignItems: 'center',

      marginBottom: 24,
    },

    summaryItem: {
      flex: 1,

      alignItems: 'center',
    },

    summaryDivider: {
      width: 1,

      height: 42,

      backgroundColor:
        `${colors.success}20`,
    },

    backButton: {
      minHeight: 48,

      borderRadius: 16,

      paddingHorizontal: 22,

      backgroundColor:
        colors.primary,

      flexDirection: 'row',

      alignItems: 'center',
      justifyContent: 'center',
    },

    backButtonText: {
      fontWeight: '700',

      marginLeft: 7,
    },
  });