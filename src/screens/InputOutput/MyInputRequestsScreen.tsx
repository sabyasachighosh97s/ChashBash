// src/screens/.../MyInputRequestsScreen.tsx
// তোমার project-এ ফাইলটি যে path-এ আছে, সেই path-ই রাখবে.

import React, { useCallback, useState } from 'react';

import {
  Alert,
  FlatList,
  Image,
  ListRenderItem,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import AppIcon from '@components/AppIcon/AppIcon';

import {
  Container,
  Headline,
  Paragraph,
} from '@components/ui';

import { CustomCard } from '@components/cards/CustomCard';

import CustomHeader from '@components/Header/CustomHeader';

import colors from '@themes/colors';

import { useAuth } from '../../context/AuthContext';

import { useTranslation } from 'react-i18next';

import {
  apiGet,
  apiPut,
  apiDelete,
} from '../../api/client';

import { API_ROUTES } from '../../api/routes';

// ======================================================
// TYPES
// ======================================================

type SelectedInputItem = {
  // Cart item ID — PUT / DELETE API-তে ব্যবহার হবে
  id: string | number;

  // Product display information
  name: string;

  quantity: number;

  unit?: string;

  price?: number;

  category?: string;

  subcategory?: string;

  image?: string;

  icon?: string;

  // Server timestamp for when this cart item was created/submitted
  createdAt?: string;
};

type ApiCartItem = Record<string, any>;

// ======================================================
// EXTRACT CART ITEMS
// ======================================================

const extractCartItems = (
  response: any,
): ApiCartItem[] => {
  const possibleItems =
    response?.items ??
    response?.cart?.items ??
    response?.data?.items ??
    response?.data?.cart?.items ??
    response?.data ??
    response;

  return Array.isArray(possibleItems)
    ? possibleItems
    : [];
};

// ======================================================
// NORMALIZE CART ITEM
// ======================================================

const normalizeCartItem = (
  item: ApiCartItem,
): SelectedInputItem => {
  const packet = item?.packet ?? {};

  const product =
    item?.product ??
    item?.productDetails ??
    item?.item ??
    packet?.product ??
    {};

  // Cart item ID — update/delete API-তে ব্যবহার হবে
  const cartItemId =
    item?.cartItemId ??
    item?.cart_item_id ??
    item?.cart_item?.id ??
    item?.id;

  // Product ID — fallback হিসেবে ব্যবহার হবে
  const productId =
    packet?.product_id ??
    product?.id ??
    product?.productId ??
    item?.productId ??
    item?.product_id;

  // Backend-এর পাঠানো product name
  const productName =
    item?.product_name ??
    packet?.product_name ??
    product?.name ??
    product?.productName ??
    item?.name ??
    (productId ? `Product ${productId}` : 'Product');

  // Product images: একাধিক থাকলে প্রথম valid file_path/URL ব্যবহার করো।
  const productImages =
    item?.product_images ??
    packet?.product_images ??
    product?.product_images ??
    item?.images ??
    product?.images ??
    [];

  const productImage = Array.isArray(productImages)
    ? productImages
        .map((image: any) =>
          typeof image === 'string'
            ? image
            : image?.file_path ?? image?.url ?? image?.image_url,
        )
        .find(
          (path: any) =>
            typeof path === 'string' &&
            path.trim().length > 0,
        )
    : undefined;

  // Price
  const price =
    packet?.discounted_price ??
    packet?.sales_price ??
    item?.price ??
    product?.price;

  return {
    id: cartItemId ?? '',

    name: productName,

    quantity: Number(
      item?.quantity ??
      item?.qty ??
      0,
    ),

    unit: packet?.unit ?? 'packet',

    price:
      price != null
        ? Number(price)
        : undefined,

    category:
      item?.category ??
      packet?.category?.name ??
      product?.category?.name ??
      product?.category,

    subcategory:
      item?.subcategory ??
      packet?.subcategory?.name ??
      product?.subcategory?.name ??
      product?.subcategory,

    image:
      productImage ??
      item?.image ??
      packet?.image ??
      packet?.product?.image ??
      product?.image ??
      product?.imageUrl ??
      product?.image_url,

    icon:
      item?.icon ??
      packet?.icon ??
      product?.icon ??
      'package-variant-closed',

    createdAt:
      item?.created_at ??
      item?.createdAt ??
      item?.created_on ??
      item?.submitted_at,
  };
};

// ======================================================
// SCREEN
// ======================================================

const formatSubmittedDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('bn-BD', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const MyInputRequestsScreen = (props: any) => {
  const route = props.route;

  const {
    token,
    userType,
    isLoggedIn,
  } = useAuth();

  const { t } = useTranslation();

  const routeSelectedItems: SelectedInputItem[] =
    route?.params?.selectedItems ?? [];

  const isRegisteredUser =
    isLoggedIn &&
    userType === 'registered' &&
    Boolean(token);

  // ======================================================
  // STATES
  // ======================================================

  const [selectedItems, setSelectedItems] =
    useState<SelectedInputItem[]>(
      routeSelectedItems,
    );

  const [isLoading, setIsLoading] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [updatingItemId, setUpdatingItemId] =
    useState<string | null>(null);

  // Quantity edits remain drafts until the user explicitly saves them.
  const [draftQuantities, setDraftQuantities] =
    useState<Record<string, number>>({});

  // Image load fail হলে fallback icon দেখাবে।
  const [failedImages, setFailedImages] = useState<
    Record<string, boolean>
  >({});

  // ======================================================
  // LOAD CART
  // ======================================================

  const loadCart = useCallback(async () => {

      console.log('========== LOAD CART FUNCTION CALLED ==========');
    // Guest user: use route-selected items
    if (!isRegisteredUser) {
      setSelectedItems(routeSelectedItems);
      setIsLoading(false);

      return;
    }

    try {
      setIsLoading(true);

      console.log('CART LOAD START');

      console.log(
        'CART REQUEST URL:',
        API_ROUTES.GET.CART,
      );

   console.log('CART API URL:', API_ROUTES.GET.CART);
console.log('CART TOKEN EXISTS:', Boolean(token));

console.log('CART API REQUEST START');

const response = await apiGet(
  API_ROUTES.GET.CART,
  token,
);

console.log('CART API REQUEST SUCCESS');
console.log(
  'CART API RESPONSE:',
  JSON.stringify(response.data, null, 2),
);

      console.log(
        'CART API RESPONSE:',
        JSON.stringify(
          response.data,
          null,
          2,
        ),
      );

      const apiItems = extractCartItems(
        response.data,
      );

      console.log(
        'CART API ITEMS:',
        JSON.stringify(
          apiItems,
          null,
          2,
        ),
      );

      const normalizedItems =
        apiItems.map(normalizeCartItem);

      // Update UI only after successful API response.
      // If API fails, existing cart data is preserved.
      setSelectedItems(normalizedItems);
} catch (error: any) {
  console.log('========== CART LOAD ERROR ==========');

  console.log('ERROR MESSAGE:', error?.message);

  console.log(
    'ERROR STATUS:',
    error?.response?.status,
  );

  console.log(
    'ERROR RESPONSE:',
    JSON.stringify(error?.response?.data, null, 2),
  );

  console.log(
    'ERROR URL:',
    error?.config?.url,
  );

  Alert.alert(
    t('cart_load_failed'),
    t('cart_load_error_message'),
  );
} finally {
      setIsLoading(false);
    }
  }, [
    isRegisteredUser,
    routeSelectedItems,
    token,
  ]);

  // ======================================================
  // SCREEN FOCUS REFRESH
  // ======================================================

  useFocusEffect(
    useCallback(() => {
      loadCart();

      return undefined;
    }, [loadCart]),
  );

  // ======================================================
  // UPDATE CART ITEM QUANTITY
  // ======================================================

  const handleQuantityChange = (
    item: SelectedInputItem,
    change: number,
  ) => {
    const itemKey = String(item.id);
    const currentDraft =
      draftQuantities[itemKey] ?? Number(item.quantity);
    const nextQuantity = currentDraft + change;

    // Quantity must remain at least one.
    if (nextQuantity < 1) {
      return;
    }

    setDraftQuantities(previous => ({
      ...previous,
      [itemKey]: nextQuantity,
    }));
  };

  
const handleSaveQuantity = (item: SelectedInputItem) => {
  const itemKey = String(item.id);
  const draftQuantity = draftQuantities[itemKey];

  if (
    draftQuantity == null ||
    draftQuantity === Number(item.quantity) ||
    updatingItemId === itemKey
  ) {
    return;
  }

  const difference =
    draftQuantity - Number(item.quantity);

  const actionText =
    difference > 0
      ? t('quantity_increase_confirmation', {
          difference: Math.abs(difference),
          quantity: draftQuantity,
        })
      : t('quantity_decrease_confirmation', {
          difference: Math.abs(difference),
          quantity: draftQuantity,
        });

  Alert.alert(
    t('confirm_quantity_change'),
    `${item.name}: ${actionText}`,
    [
      {
        text: t('no_cancel'),
        style: 'cancel',
      },
      {
        text: t('yes_save'),
        onPress: async () => {
          try {
            if (!isRegisteredUser) {
              // Guest user: update local quantity only.
              setSelectedItems(previous =>
                previous.map(selectedItem =>
                  String(selectedItem.id) === itemKey
                    ? {
                        ...selectedItem,
                        quantity: draftQuantity,
                      }
                    : selectedItem,
                ),
              );

              setDraftQuantities(previous => {
                const updated = { ...previous };
                delete updated[itemKey];
                return updated;
              });

              return;
            }

            setUpdatingItemId(itemKey);

            console.log('CART QUANTITY UPDATE START');
            console.log('ITEM ID:', item.id);
            console.log('OLD QUANTITY:', item.quantity);
            console.log('NEW QUANTITY:', draftQuantity);

            const response = await apiPut(
              API_ROUTES.PUT.CART_ITEM(itemKey),
              {
                quantity: draftQuantity,
              },
              token,
            );

            console.log(
              'CART QUANTITY UPDATE RESPONSE:',
              JSON.stringify(response.data, null, 2),
            );

            // Update local UI after successful API response.
            setSelectedItems(previous =>
              previous.map(selectedItem =>
                String(selectedItem.id) === itemKey
                  ? {
                      ...selectedItem,
                      quantity: draftQuantity,
                    }
                  : selectedItem,
              ),
            );

            // Remove saved quantity from draft.
            setDraftQuantities(previous => {
              const updated = { ...previous };
              delete updated[itemKey];
              return updated;
            });

            Alert.alert(
              t('success'),
              'Quantity updated successfully.',
            );
          } catch (error: any) {
            console.log(
              '========== CART QUANTITY UPDATE ERROR ==========',
            );

            console.log(
              'ERROR MESSAGE:',
              error?.message,
            );

            console.log(
              'ERROR STATUS:',
              error?.response?.status,
            );

            console.log(
              'ERROR RESPONSE:',
              JSON.stringify(
                error?.response?.data,
                null,
                2,
              ),
            );

            console.log(
              'ERROR URL:',
              error?.config?.url,
            );

            Alert.alert(
              'Update failed',
              error?.response?.data?.message ||
                'Could not update item quantity. Please try again.',
            );
          } finally {
            setUpdatingItemId(null);
          }
        },
      },
    ],
  );
};


  // ======================================================
  // DELETE ONE CART ITEM
  // ======================================================

  const handleDeleteItem = (
    item: SelectedInputItem,
  ) => {
    // Guest: remove from local list only
    if (!isRegisteredUser) {
    Alert.alert(
  t('delete_item_confirmation'),
  t('remove_item_message', {
    itemName: item.name,
  }),
  [
    {
      text: t('cancel'),
      style: 'cancel',
    },
    {
      text: t('delete'),
      style: 'destructive',

            onPress: () => {
              setSelectedItems(previous =>
                previous.filter(
                  current =>
                    String(current.id) !==
                    String(item.id),
                ),
              );
            },
          },
        ],
      );

      return;
    }

    if (!item.id) {
     Alert.alert(
  t('delete_not_possible'),
  t('cart_item_id_missing'),
);

      return;
    }

Alert.alert(
  t('delete_item_confirmation'),
  t('remove_item_message', {
    itemName: item.name,
  }),
  [
    {
      text: t('cancel'),
      style: 'cancel',
    },
    {
      text: t('delete'),
      style: 'destructive',

          onPress: async () => {
            try {
              setIsDeleting(true);

              await apiDelete(
                API_ROUTES.DELETE.CART_ITEM(
                  String(item.id),
                ),
                token,
              );

              setSelectedItems(previous =>
                previous.filter(
                  current =>
                    String(current.id) !==
                    String(item.id),
                ),
              );
            } catch (error) {
              console.log(
                'Delete Cart Item Error:',
                error,
              );

            Alert.alert(
  t('delete_failed'),
  t('delete_item_error_message'),
);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  // ======================================================
  // CLEAR COMPLETE CART
  // ======================================================

  const handleClearCart = () => {
    if (selectedItems.length === 0) {
      return;
    }

Alert.alert(
  t('clear_cart_confirmation'),
  t('clear_cart_message'),
  [
    {
      text: t('cancel'),
      style: 'cancel',
    },
    {
      text: t('delete_all'),
      style: 'destructive',

          onPress: async () => {
            // Guest cart
            if (!isRegisteredUser) {
              setSelectedItems([]);

              return;
            }

            try {
              setIsDeleting(true);

              await apiDelete(
                API_ROUTES.DELETE.CART,
                token,
              );

              setSelectedItems([]);
            } catch (error) {
              console.log(
                'Clear Cart Error:',
                error,
              );

             Alert.alert(
  t('clear_cart_failed'),
  t('clear_cart_error_message'),
);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  // ======================================================
  // RENDER PRODUCT CARD
  // ======================================================

  const renderItem: ListRenderItem<
    SelectedInputItem
  > = ({ item }) => {
    const itemKey = String(item.id);
    const displayedQuantity =
      draftQuantities[itemKey] ?? Number(item.quantity);
      const estimatedTotal =
  typeof item.price === 'number'
    ? item.price * displayedQuantity
    : undefined;
    const hasQuantityDraft =
      displayedQuantity !== Number(item.quantity);
    const isUpdating =
      updatingItemId === itemKey;

    return (
      <CustomCard
        style={styles.itemCard}
      >
        {/* PRODUCT MAIN ROW */}

        <View
          style={styles.productMainRow}
        >
          {/* PRODUCT IMAGE / ICON */}

          
{/* PRODUCT IMAGE / FALLBACK ICON */}
          <View style={styles.productVisual}>
            {item.image && !failedImages[itemKey] ? (
              <Image
                source={{ uri: item.image }}
                style={styles.productImage}
                resizeMode="cover"
                onError={() => {
                  setFailedImages(previous => ({
                    ...previous,
                    [itemKey]: true,
                  }));
                }}
              />
            ) : (
              <View style={styles.productIconContainer}>
                <AppIcon
                  type="MaterialIcons"
                  name="inventory-2"
                  size={32}
                  color={colors.primary}
                />
              </View>
            )}
          </View>

          {/* PRODUCT INFORMATION */}

          <View
            style={styles.productInfo}
          >
            <View
              style={styles.productTitleRow}
            >
              <View
                style={
                  styles.productTitleContainer
                }
              >
                <Headline
                  numberOfLines={2}
                  style={styles.productName}
                >
                  {item.name}
                </Headline>

                {item.category ? (
                  <View
                    style={
                      styles.categoryBadge
                    }
                  >
                    <Paragraph
                      numberOfLines={1}
                      style={
                        styles.categoryText
                      }
                    >
                      {item.category}
                    </Paragraph>
                  </View>
                ) : null}
              </View>

              {item.subcategory ? (
                <Paragraph
                  numberOfLines={1}
                  style={styles.subcategoryText}
                >
                  {item.subcategory}
                </Paragraph>
              ) : null}
            </View>
          </View>

          {/* DELETE BUTTON */}

          <Pressable
            onPress={() =>
              handleDeleteItem(item)
            }
            disabled={isDeleting}
            hitSlop={8}
            style={styles.deleteButton}
          >
            <AppIcon
              type="MaterialCommunityIcons"
              name="delete-outline"
              size={22}
              color={colors.error}
            />
          </Pressable>
        </View>

        {/* PRODUCT DETAILS */}

        {item.createdAt ? (
          <View style={styles.submittedDateRow}>
            <AppIcon
              type="MaterialCommunityIcons"
              name="calendar-clock"
              size={15}
              color={colors.subText}
            />
           <Paragraph style={styles.submittedDateText}>
  {t('submitted_date_time')}: {formatSubmittedDate(item.createdAt)}
</Paragraph>
          </View>
        ) : null}

        <View
          style={styles.detailsSection}
        >
          {/* QUANTITY */}

          <View
            style={styles.quantitySection}
          >
          <Paragraph style={styles.detailLabel}>
  {t('package_quantity')}
</Paragraph>

            <View
              style={
                styles.quantityValueRow
              }
            >
              {/* MINUS */}

              <Pressable
                onPress={() =>
                  handleQuantityChange(
                    item,
                    -1,
                  )
                }
                disabled={
                  isDeleting ||
                  isUpdating ||
                  displayedQuantity <= 1
                }
                hitSlop={8}
                style={[
                  styles.quantityButton,

                  Number(item.quantity) <=
                    1 &&
                    styles.quantityButtonDisabled,
                ]}
              >
                <AppIcon
                  type="MaterialCommunityIcons"
                  name="minus"
                  size={17}
                  color={colors.primary}
                />
              </Pressable>

              {/* QUANTITY VALUE */}

              <Paragraph
                style={
                  styles.quantityValue
                }
              >
                {displayedQuantity.toLocaleString('bn-BD')}
              </Paragraph>

              {/* UNIT */}

    <Paragraph style={styles.quantityUnit}>
  {t('package_unit')}
</Paragraph>

              {/* PLUS */}

              <Pressable
                onPress={() =>
                  handleQuantityChange(
                    item,
                    1,
                  )
                }
                disabled={
                  isDeleting ||
                  isUpdating
                }
                hitSlop={8}
                style={
                  styles.quantityButton
                }
              >
                <AppIcon
                  type="MaterialCommunityIcons"
                  name="plus"
                  size={17}
                  color={colors.primary}
                />
              </Pressable>
            </View>

            {hasQuantityDraft ? (
              <View style={styles.quantitySaveRow}>
            <Paragraph style={styles.quantityChangeHint}>
  {displayedQuantity > Number(item.quantity)
    ? t('quantity_increase_hint', {
        difference:
          displayedQuantity - Number(item.quantity),
      })
    : t('quantity_decrease_hint', {
        difference:
          Number(item.quantity) - displayedQuantity,
      })}
</Paragraph>
                <Pressable
                  onPress={() => handleSaveQuantity(item)}
                  disabled={isDeleting || isUpdating}
                  style={[
                    styles.quantitySaveButton,
                    (isDeleting || isUpdating) &&
                      styles.quantitySaveButtonDisabled,
                  ]}
                >
                  <AppIcon
                    type="MaterialCommunityIcons"
                    name="check"
                    size={15}
                    color="#FFFFFF"
                  />
                <Paragraph style={styles.quantitySaveText}>
  {isUpdating ? t('saving') : t('submit')}
</Paragraph>
                </Pressable>
              </View>
            ) : null}
          </View>

          {/* PRICE */}

         {typeof estimatedTotal === 'number' ? (
  <View style={styles.priceSection}>
    <Paragraph style={styles.detailLabel}>
      {t('approximate_price')}
    </Paragraph>

    <Paragraph style={styles.priceValue}>
      {estimatedTotal.toLocaleString('bn-BD')}{' '}
      {t('currency_taka')}
    </Paragraph>
  </View>
) : null}
        </View>
      </CustomCard>
    );
  };

  // ======================================================
  // KEY EXTRACTOR
  // ======================================================

  const keyExtractor = (
    item: SelectedInputItem,
  ) => String(item.id);

  // ======================================================
  // UI
  // ======================================================

  return (
    <Container
      style={styles.container}
    >
      <CustomHeader />

      <View
        style={styles.content}
      >
        {/* CLEAR CART BUTTON */}

        {selectedItems.length > 0 ? (
          <View
            style={styles.clearCartRow}
          >
            <Pressable
              onPress={handleClearCart}
              disabled={isDeleting}
              hitSlop={8}
              style={
                styles.clearCartButton
              }
            >
              <AppIcon
                type="MaterialCommunityIcons"
                name="delete-sweep-outline"
                size={19}
                color={colors.error}
              />

          <Paragraph style={styles.clearCartText}>
  {t('clear_cart')}
</Paragraph>
            </Pressable>
          </View>
        ) : null}

        {/* LOADING / EMPTY / LIST */}

        {isLoading ? (
          <View
            style={
              styles.messageContainer
            }
          >
          <Paragraph>
  {t('cart_loading')}
</Paragraph>
          </View>
        ) : selectedItems.length ===
          0 ? (
          <View
            style={
              styles.messageContainer
            }
          >
           <Paragraph>
  {t('cart_empty')}
</Paragraph>
          </View>
        ) : (
          <FlatList
            data={selectedItems}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.listContent
            }
          />
        )}
      </View>
    </Container>
  );
};

export default MyInputRequestsScreen;

// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    marginTop: 6,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },

  itemCard: {
    padding: 10,
    marginBottom: 9,
    borderRadius: 18,
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: colors.border,
  },

  productMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  productVisual: {
    width: 74,
    height: 74,
    borderRadius: 17,
    overflow: 'hidden',
    marginRight: 12,
  },

  productIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.border,
  },

  productImage: {
    width: '100%',
    height: '100%',
  },

  productInfo: {
    flex: 1,
  },

  productTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  productTitleContainer: {
    flex: 1,
    paddingRight: 8,
  },

  productName: {
    fontSize: 17,
    lineHeight: 22,
    margin: 0,
    fontWeight: '800',
    color: colors.text,
  },

  categoryBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.border,
    maxWidth: '48%',
  },

  categoryText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    color: colors.primary,
    margin: 0,
  },

  subcategoryText: {
    marginTop: 4,
    maxWidth: 82,
    fontSize: 10,
    lineHeight: 13,
    textAlign: 'right',
    color: colors.subText,
    margin: 0,
  },

  detailsSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth:
      StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },

  quantitySection: {
    flex: 1,
    alignItems: 'flex-start',
  },

  priceSection: {
    alignItems: 'flex-end',
    paddingLeft: 10,
  },

  detailLabel: {
    fontSize: 11,
    lineHeight: 15,
    color: colors.subText,
    margin: 0,
    marginBottom: 2,
  },

  quantityValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 28,
  },

  quantityValue: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    color: colors.text,
    margin: 0,
  },

  quantityUnit: {
    marginLeft: 4,
    fontSize: 12,
    color: colors.subText,
    margin: 0,
  },

  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },

  quantityButtonDisabled: {
    opacity: 0.35,
  },

  quantitySaveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },

  quantityChangeHint: {
    fontSize: 11,
    color: colors.error,
    margin: 0,
  },

  quantitySaveButton: {
    minHeight: 34,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },

  quantitySaveButtonDisabled: {
    opacity: 0.6,
  },

  quantitySaveText: {
    marginLeft: 5,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    margin: 0,
  },

  submittedDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 7,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },

  submittedDateText: {
    marginLeft: 6,
     fontSize: 14,
  lineHeight: 19,
  color: colors.textSecondary,
  },

  priceValue: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    color: colors.primary,
    margin: 0,
  },

  deleteButton: {
    width: 38,
    height: 38,
    marginLeft: 8,
    borderRadius: 12,
    backgroundColor: `${colors.error}10`,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  clearCartRow: {
    paddingHorizontal: 16,
    paddingBottom: 6,
    alignItems: 'flex-end',
  },

  clearCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 11,
    backgroundColor: `${colors.error}10`,
    borderWidth: 1,
    borderColor: `${colors.error}30`,
  },

  clearCartText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '700',
    color: colors.error,
    margin: 0,
  },

  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});