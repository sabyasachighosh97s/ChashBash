import {useTranslation} from 'react-i18next';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  FlatList,
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
import PlantLoader from '@components/common/PlantLoader';
import useThemeMode from '@hook/useThemeMode';
import colors from '@themes/colors';

import GuestAccessModal, {
  useGuestAccess,
} from '@components/common/GuestAccess';

import CustomHeader from '@components/Header/CustomHeader';

import {apiGet} from '../../api/client';
import {API_ROUTES} from '../../api/routes';
import {useAuth} from '../../context/AuthContext';

import {
  useNavigation,
} from '@react-navigation/native';

import InputItemCard, {
  InputItem,
} from '@components/inputOutput/InputItemCard';

import InputQuantityBottomSheet from '@components/inputOutput/InputQuantityBottomSheet';

import CropFilterModal from '@screens/POP/CropFilterModal';

import {
  InputFilterItem,
} from '@components/inputOutput/InputCategoryFilter';

import InputSubCategoryFilter from '@components/inputOutput/InputSubCategoryFilter';

import Pagination from '@components/common/Pagination/Pagination';

import SideFab from '@components/AppFab/SideFab';
import {FabAction} from '@navigation/fab/fabTypes';

/* ==========================================================================
   Types
========================================================================== */

export type SelectedInputItem = {
  item: InputItem;
  quantity: number;
};

/* ==========================================================================
   Helpers
========================================================================== */

const normalizeFilterValue = (
  value: unknown,
) =>
  String(value ?? '')
    .trim()
    .toLowerCase();

/* ==========================================================================
   FAB
========================================================================== */

const SelectedInputListAction: FabAction = {
  id: 'selected-input-list',
  icon: 'playlist-check',
  label: 'ইনপুট আইটেম লিস্ট',
  color: colors.primary,
  route: 'InputRequest',
};

/* ==========================================================================
   Screen
========================================================================== */

const InputOutputScreen = () => {
  const {theme} = useThemeMode();
  const {t} = useTranslation();

  const navigation = useNavigation<any>();

  /* ------------------------------------------------------------------------
     Guest Access
  ------------------------------------------------------------------------ */

  const {
    isGuest,
    visible,
    openGuestAccess,
    closeGuestAccess,
    goToRegistration,
  } = useGuestAccess();

  /* ------------------------------------------------------------------------
     Auth

     IMPORTANT:
     token is NOT required for viewing products.

     Guest users must also load products from the real API.
  ------------------------------------------------------------------------ */

  const {token} = useAuth();

  const selectedInputListAction = useMemo<FabAction>(
    () => ({
      ...SelectedInputListAction,
      label: t('input_item_list'),
    }),
    [t],
  );

  /* ------------------------------------------------------------------------
     Filter
  ------------------------------------------------------------------------ */

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('all');

  const [
    selectedSubCategory,
    setSelectedSubCategory,
  ] = useState('all');

  const [
    filterVisible,
    setFilterVisible,
  ] = useState(false);

  /* ------------------------------------------------------------------------
     Pagination
  ------------------------------------------------------------------------ */

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const ITEMS_PER_PAGE = 10;

  /* ------------------------------------------------------------------------
     Quantity
  ------------------------------------------------------------------------ */

  const [
    quantitySheetVisible,
    setQuantitySheetVisible,
  ] = useState(false);

  const [
    quantityItem,
    setQuantityItem,
  ] = useState<InputItem | null>(null);

  /* ------------------------------------------------------------------------
     Selected Request
  ------------------------------------------------------------------------ */

  const [
    selectedInputItems,
    setSelectedInputItems,
  ] = useState<SelectedInputItem[]>([]);

  /* ------------------------------------------------------------------------
     Products
  ------------------------------------------------------------------------ */

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    inputItems,
    setInputItems,
  ] = useState<InputItem[]>([]);

  /* ==========================================================================
     Image URL Resolver

     Handles:

     1. Absolute CDN URL
        https://...

     2. Relative API path
        uploads/product_images/...

     3. Existing image fields
  ========================================================================== */

  const resolveProductImageUrl = useCallback(
    (
      filePath: unknown,
      baseUrl?: string,
    ) => {
      if (!filePath) {
        return '';
      }

      const path = String(filePath).trim();

      if (!path) {
        return '';
      }

      /* Already absolute */
      if (
        path.startsWith('http://') ||
        path.startsWith('https://')
      ) {
        return path;
      }

      /*
       * API base URL normally contains:
       *
       * /api/v1
       *
       * Remove it before attaching uploaded file path.
       */

      const root = String(baseUrl ?? '')
        .replace(/\/api\/v1\/?$/, '')
        .replace(/\/$/, '');

      if (!root) {
        return path;
      }

      return `${root}/${path.replace(/^\//, '')}`;
    },
    [],
  );

  /* ==========================================================================
     Categories

     Categories are derived from REAL API products.
  ========================================================================== */

  const categories = useMemo(() => {
    const categoryMap =
      new Map<string, InputFilterItem>();

    categoryMap.set('all', {
      value: 'all',
      label: 'সব',
    });

    inputItems.forEach(item => {
      const value =
        normalizeFilterValue(
          item.category,
        );

      if (!value || value === 'all') {
        return;
      }

      if (!categoryMap.has(value)) {
        categoryMap.set(value, {
          value,
          label: String(item.category).trim(),
        });
      }
    });

    return Array.from(
      categoryMap.values(),
    );
  }, [inputItems]);

  /* ==========================================================================
     Subcategories

     Derived from REAL API products belonging to selected category.
  ========================================================================== */

  const subCategories = useMemo(() => {
    if (
      selectedCategory === 'all'
    ) {
      return [];
    }

    const subCategoryMap =
      new Map<string, InputFilterItem>();

    inputItems.forEach(item => {
      const category =
        normalizeFilterValue(
          item.category,
        );

      if (
        category !==
        normalizeFilterValue(
          selectedCategory,
        )
      ) {
        return;
      }

      const value =
        normalizeFilterValue(
          item.sub_category,
        );

      if (!value || value === 'all') {
        return;
      }

      if (
        !subCategoryMap.has(value)
      ) {
        subCategoryMap.set(
          value,
          {
            value,
            label: String(item.sub_category).trim(),
          },
        );
      }
    });

    return Array.from(
      subCategoryMap.values(),
    );
  }, [
    inputItems,
    selectedCategory,
  ]);

  /* ==========================================================================
     Filtered Products
  ========================================================================== */

  const filteredItems = useMemo(() => {
    if (
      selectedCategory === 'all'
    ) {
      return inputItems;
    }

    return inputItems.filter(
      item => {
        if (
          normalizeFilterValue(
            item.category,
          ) !==
          normalizeFilterValue(
            selectedCategory,
          )
        ) {
          return false;
        }

        if (
          selectedSubCategory ===
          'all'
        ) {
          return true;
        }

        return (
          normalizeFilterValue(
            item.sub_category,
          ) ===
          normalizeFilterValue(
            selectedSubCategory,
          )
        );
      },
    );
  }, [
    inputItems,
    selectedCategory,
    selectedSubCategory,
  ]);

  /* ==========================================================================
     PRODUCTS API

     IMPORTANT CHANGE:

     ❌ OLD:
     if (!token) {
       setInputItems([]);
       return;
     }

     ✅ NEW:
     Guest users also call the REAL products API.

     No demo data is used anywhere.
  ========================================================================== */

  const loadProducts = useCallback(
    async () => {
      try {
        setLoading(true);

        console.log(
          '================================',
        );

        console.log(
          'PRODUCTS API',
        );

        console.log(
          'Guest:',
          isGuest,
        );

        console.log(
          'Token available:',
          !!token,
        );

        console.log(
          '================================',
        );

        /*
         * IMPORTANT:
         *
         * We intentionally call the same API for both:
         *
         * Guest
         * Registered
         *
         * The token is passed when available.
         *
         * If token is empty, apiGet must send the request
         * without an Authorization header.
         */

        const response = await apiGet(
          API_ROUTES.GET.PRODUCTS,
          token,
          {
            params: {
              page: 1,
              page_size: 50,
              sort_order: 'desc',
            },
          },
        );

        console.log(
          'PRODUCTS RESPONSE:',
          response,
        );

        const apiItems =
          response?.data?.items ?? [];

        /*
         * ================================================================
         * Normalize API response
         *
         * API:
         *
         * name
         * category_name
         * subcategory_name
         * packets
         * images
         *
         * Existing UI:
         *
         * product_name
         * category
         * sub_category
         * agri_product_prices
         * image
         * ================================================================
         */

        const normalizedItems: InputItem[] =
          apiItems.map(
            (product: any) => ({
              ...product,

              /* Product ID */
              id: product.id,

              /* Name */
              product_name:
                product.name ??
                product.product_name,

              /* Code */
              product_code:
                product.code ??
                product.product_code,

              /* Category */
              category:
                product.category_name ??
                product.category,

              /* Subcategory */
              sub_category:
                product.subcategory_name ??
                product.sub_category,

              /* Description */
              description:
                product.description ?? '',

              /* Product Image */
              image:
                resolveProductImageUrl(
                  product.images?.[0]
                    ?.file_path ??
                    product.image ??
                    product.image_url,
                  response?.config
                    ?.baseURL ??
                    'http://134.209.155.11:5000',
                ),

              /* Packet / Price */
              agri_product_prices:
                Array.isArray(
                  product.packets,
                )
                  ? product.packets.map(
                      (
                        packet: any,
                      ) => ({
                        prod_price_id:
                          packet.id,

                        quantity:
                          packet.packet_size,

                        /*
                         * Keep discounted price
                         * separately.
                         */
                        discounted_price:
                          packet.discounted_price,

                        /*
                         * Main displayed price.
                         *
                         * If discount exists:
                         * discounted_price
                         *
                         * Otherwise:
                         * sales_price
                         */
                        sales_price:
                          packet.discounted_price ??
                          packet.sales_price,

                        /*
                         * Original price
                         */
                        price:
                          packet.sales_price,

                        unit: {
                          unit_name:
                            packet.unit,
                        },
                      }),
                    )
                  : product.agri_product_prices ??
                    [],
            }),
          );

        console.log(
          'NORMALIZED PRODUCT ITEMS:',
          normalizedItems,
        );

        console.log(
          'PRODUCT COUNT:',
          normalizedItems.length,
        );

        setInputItems(
          normalizedItems,
        );

        /*
         * Reset pagination whenever
         * fresh API data arrives.
         */
        setCurrentPage(1);

        /*
         * If current selected category
         * no longer exists after reload,
         * reset filter.
         */
        const hasSelectedCategory =
          normalizedItems.some(
            item =>
              normalizeFilterValue(
                item.category,
              ) ===
              normalizeFilterValue(
                selectedCategory,
              ),
          );

        if (
          selectedCategory !==
            'all' &&
          !hasSelectedCategory
        ) {
          setSelectedCategory('all');
          setSelectedSubCategory('all');
        }

        console.log(
          '================================',
        );
      } catch (error: any) {
        console.log(
          '================================',
        );

        console.log(
          'PRODUCTS API ERROR',
        );

        console.log(
          'Status:',
          error?.response?.status,
        );

        console.log(
          'Response:',
          error?.response?.data,
        );

        console.log(
          'Message:',
          error?.message,
        );

        console.log(
          '================================',
        );

        // API failure: keep the list empty. No fallback/demo data is used.
        setInputItems([]);
      } finally {
        setLoading(false);
      }
    },
    [
      token,
      isGuest,
      resolveProductImageUrl,
      selectedCategory,
    ],
  );

  /* ==========================================================================
     Load Products

     Guest + Registered both load REAL API data.
  ========================================================================== */

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  /* ==========================================================================
     Pagination
  ========================================================================== */

  const totalPages = Math.ceil(
    filteredItems.length /
      ITEMS_PER_PAGE,
  );

  const paginatedItems = useMemo(() => {
    const start =
      (currentPage - 1) *
      ITEMS_PER_PAGE;

    return filteredItems.slice(
      start,
      start + ITEMS_PER_PAGE,
    );
  }, [
    filteredItems,
    currentPage,
  ]);

  /* ==========================================================================
     Category
  ========================================================================== */

  const handleCategoryChange =
    useCallback(
      (item: InputFilterItem) => {
        const value =
          String(item.value);

        setSelectedCategory(
          value,
        );

        setSelectedSubCategory(
          'all',
        );

        setCurrentPage(1);

        setFilterVisible(false);
      },
      [],
    );

  /* ==========================================================================
     Subcategory
  ========================================================================== */

  const handleSubCategoryChange =
    useCallback(
      (item: InputFilterItem) => {
        const value =
          String(item.value);

        setSelectedSubCategory(
          value,
        );

        setCurrentPage(1);
      },
      [],
    );

  /* ==========================================================================
     Open Quantity

     Registered user:
       → quantity bottom sheet

     Guest:
       → GuestAccessModal
  ========================================================================== */

  const handleBuy =
    useCallback(
      (item: InputItem) => {
        if (isGuest) {
          /*
           * Guest cannot create an input request.
           *
           * Do NOT open quantity sheet.
           */
          openGuestAccess();
          return;
        }

        setQuantityItem(item);

        setQuantitySheetVisible(
          true,
        );
      },
      [
        isGuest,
        openGuestAccess,
      ],
    );

  /* ==========================================================================
     Remove Selected
  ========================================================================== */

  const handleRemove =
    useCallback(
      (item: InputItem) => {
        const itemId =
          item.id ?? item.fid;

        setSelectedInputItems(
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

  /* ==========================================================================
     Add / Update Request

     This function is only reached for
     registered users because Guest is
     blocked inside handleBuy.
  ========================================================================== */

  const handleAddToRequest =
    useCallback(
      (
        item: InputItem,
        quantity: number,
      ) => {
        const itemId =
          item.id ?? item.fid;

        setSelectedInputItems(
          current => {
            const existingIndex =
              current.findIndex(
                selected =>
                  (selected.item.id ??
                    selected.item.fid) ===
                  itemId,
              );

            /*
             * New item
             */
            if (
              existingIndex ===
              -1
            ) {
              return [
                ...current,
                {
                  item,
                  quantity,
                },
              ];
            }

            /*
             * Update existing item
             */
            const updated =
              [...current];

            updated[
              existingIndex
            ] = {
              item,
              quantity,
            };

            return updated;
          },
        );

        setQuantitySheetVisible(
          false,
        );

        setQuantityItem(null);
      },
      [],
    );

  /* ==========================================================================
     Selected Helper
  ========================================================================== */

  const isItemSelected =
    useCallback(
      (item: InputItem) => {
        const id =
          item.id ?? item.fid;

        return selectedInputItems.some(
          selected =>
            (selected.item.id ??
              selected.item.fid) ===
            id,
        );
      },
      [selectedInputItems],
    );

  /* ==========================================================================
     Render Item
  ========================================================================== */

  const renderItem =
    useCallback(
      ({
        item,
      }: {
        item: InputItem;
      }) => (
        <InputItemCard
          item={item}
          selected={isItemSelected(item)}
          onBuy={handleBuy}
          onRemove={handleRemove}
        />
      ),
      [
        isItemSelected,
        handleBuy,
        handleRemove,
      ],
    );

  /* ==========================================================================
     Selected Summary
  ========================================================================== */

  const selectedCount =
    selectedInputItems.length;

  const totalSelectedQuantity =
    selectedInputItems.reduce(
      (total, item) =>
        total + item.quantity,
      0,
    );

  /* ==========================================================================
     UI
  ========================================================================== */

  return (
    <Container
      backgroundColor={
        theme.colors.background
      }
      style={styles.container}
    >
      {/* ====================================================================
          Header
      ==================================================================== */}

      <CustomHeader
        showFilter
        onFilterPress={() =>
          setFilterVisible(true)
        }
      />

      {/* ====================================================================
          Main Content
      ==================================================================== */}

      <View
        style={styles.content}
      >
        {/* ================================================================
            Subcategory Filter
        ================================================================ */}

        {subCategories.length >
          0 && (
          <InputSubCategoryFilter
            items={
              subCategories
            }
            selectedValue={
              selectedSubCategory
            }
            onSelect={
              handleSubCategoryChange
            }
          />
        )}

        {/* ================================================================
            Products
        ================================================================ */}

        {loading ? (
          <View
            style={
              styles.loadingContainer
            }
          >
            <PlantLoader />
          </View>
        ) : (
          <FlatList
            data={
              paginatedItems
            }
            renderItem={
              renderItem
            }
            keyExtractor={item =>
              String(
                item.id ??
                  item.fid,
              )
            }
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.listContent
            }
            ListEmptyComponent={
              <View
                style={
                  styles.emptyContainer
                }
              >
                <AppIcon
                  type="MaterialIcons"
                  name="inventory-2"
                  size={38}
                  color={
                    colors.primary
                  }
                />

                <Headline
                  size="sm"
                  textColor={
                    theme.colors.text
                  }
                  style={
                    styles.emptyTitle
                  }
                >
                  {t('no_input_items_found')}
                </Headline>

                <Paragraph
                  size="xs"
                  textColor={
                    colors.subText
                  }
                >
                  {t('select_another_filter')}
                </Paragraph>
              </View>
            }
          />
        )}

        {/* ================================================================
            Fixed Pagination
        ================================================================ */}

        {totalPages > 1 && (
          <View
            style={[
              styles.fixedPagination,
              selectedCount > 0 &&
                styles.fixedPaginationWithRequest,
            ]}
          >
            <Pagination
              currentPage={
                currentPage
              }
              totalPages={
                totalPages
              }
              onPageChange={
                setCurrentPage
              }
            />
          </View>
        )}
      </View>

      {/* ====================================================================
          Selected Request Bar
      ==================================================================== */}

      {selectedCount > 0 && (
        <View
          style={
            styles.requestBar
          }
        >
          {/* ---------------------------------------------------------------
              Left
          ---------------------------------------------------------------- */}

          <View
            style={
              styles.requestInfo
            }
          >
            <View
              style={
                styles.requestIcon
              }
            >
              <AppIcon
                type="MaterialIcons"
                name="playlist-add-check"
                size={23}
                color={
                  colors.textLight
                }
              />

              <View
                style={
                  styles.requestCount
                }
              >
                <Paragraph
                  size="xs"
                  textColor={
                    colors.primary
                  }
                  style={
                    styles.requestCountText
                  }
                >
                  {selectedCount}
                </Paragraph>
              </View>
            </View>

            <View
              style={
                styles.requestText
              }
            >
              <Headline
                size="xs"
                textColor={
                  colors.textLight
                }
              >
                {t('my_request')}
              </Headline>

              <View
                style={
                  styles.requestMetaRow
                }
              >
                <Paragraph
                  size="xs"
                  textColor={
                    'rgba(255,255,255,0.78)'
                  }
                  style={
                    styles.requestMetaText
                  }
                >
                  {selectedCount}{t('pieces')}
                </Paragraph>

                <Paragraph
                  size="xs"
                  textColor={
                    'rgba(255,255,255,0.55)'
                  }
                  style={
                    styles.requestMetaDot
                  }
                >
                  •
                </Paragraph>

                <Paragraph
                  size="xs"
                  textColor={
                    'rgba(255,255,255,0.78)'
                  }
                  style={
                    styles.requestMetaText
                  }
                >
                  {totalSelectedQuantity}{t('pieces')}
                </Paragraph>
              </View>
            </View>
          </View>

          {/* ---------------------------------------------------------------
              View Request
          ---------------------------------------------------------------- */}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate(
                'InputRequest',
                {
                  selectedItems:
                    selectedInputItems,
                },
              )
            }
            style={
              styles.viewRequestButton
            }
          >
            <Paragraph
              size="xs"
              textColor={
                colors.primary
              }
              style={
                styles.viewRequestText
              }
            >
              {t('view')}
            </Paragraph>

            <AppIcon
              type="MaterialIcons"
              name="arrow-forward"
              size={17}
              color={
                colors.primary
              }
            />
          </TouchableOpacity>
        </View>
      )}

      {/* ====================================================================
          Quantity Bottom Sheet

          This will never open for Guest because
          handleBuy blocks Guest first.
      ==================================================================== */}

      <InputQuantityBottomSheet
        visible={
          quantitySheetVisible
        }
        item={
          quantityItem
        }
        initialQuantity={
          quantityItem
            ? selectedInputItems.find(
                selected =>
                  (selected.item.id ??
                    selected.item.fid) ===
                  (quantityItem.id ??
                    quantityItem.fid),
              )?.quantity ?? 1
            : 1
        }
        onClose={() => {
          setQuantitySheetVisible(
            false,
          );

          setQuantityItem(null);
        }}
        onAdd={
          handleAddToRequest
        }
      />

      {/* ====================================================================
          Category Filter
      ==================================================================== */}

      <CropFilterModal
        visible={
          filterVisible
        }
        onClose={() =>
          setFilterVisible(false)
        }
        selectedCrop={
          selectedCategory
        }
        onSelect={category => {
          const selectedItem =
            categories.find(
              item =>
                String(
                  item.value,
                ) ===
                String(category),
            );

          if (selectedItem) {
            handleCategoryChange(
              selectedItem,
            );
          }
        }}
        cropList={categories.map(
          item => ({
            value: String(
              item.value,
            ),
            label: item.label,
          }),
        )}
      />

      {/* ====================================================================
          Side FAB
      ==================================================================== */}

      {!isGuest && (
  <SideFab
    actions={[
      SelectedInputListAction,
    ]}
    bottom={
      selectedCount > 0
        ? 170
        : 100
    }
    onActionPress={action => {
      if (
        action.id ===
        'selected-input-list'
      ) {
        navigation.navigate(
          'MyInputRequests',
          {
            selectedItems:
              selectedInputItems,
          },
        );
      }
    }}
  />
)}

      {/* ====================================================================
          Guest Access Modal

          This is shown when Guest clicks "নিতে চাই".
      ==================================================================== */}

      <GuestAccessModal
        visible={visible}
        onClose={
          closeGuestAccess
        }
        onRegister={
          goToRegistration
        }
      />
    </Container>
  );
};

export default InputOutputScreen;

/* ==========================================================================
   Styles
========================================================================== */

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
    },

    content: {
      flex: 1,
      paddingHorizontal: 14,
      marginTop: 10,
    },

    listContent: {
      paddingTop: 1,
      paddingBottom: 100,
    },

    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 60,
    },

    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 70,
    },

    emptyTitle: {
      marginTop: 12,
      marginBottom: 4,
    },

    /* ======================================================================
       Fixed Pagination
    ====================================================================== */

    fixedPagination: {
      position: 'absolute',
      left: 14,
      right: 14,
      bottom: 10,

      backgroundColor:
        colors.surface,

      borderRadius: 18,

      elevation: 8,

      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.12,
      shadowRadius: 8,
    },

    fixedPaginationWithRequest: {
      bottom: 88,
    },

    /* ======================================================================
       Request Bar
    ====================================================================== */

    requestBar: {
      position: 'absolute',
      left: 12,
      right: 12,
      bottom: 10,

      minHeight: 68,

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

    requestInfo: {
      flex: 1,

      flexDirection: 'row',

      alignItems: 'center',

      minWidth: 0,
    },

    requestIcon: {
      width: 45,
      height: 45,

      borderRadius: 15,

      backgroundColor:
        'rgba(255,255,255,0.16)',

      alignItems: 'center',
      justifyContent: 'center',

      position: 'relative',

      marginRight: 9,
    },

    requestCount: {
      position: 'absolute',

      top: -4,
      right: -4,

      minWidth: 21,
      height: 21,

      borderRadius: 11,

      backgroundColor:
        colors.accent,

      alignItems: 'center',
      justifyContent: 'center',

      paddingHorizontal: 4,
    },

    requestCountText: {
      fontWeight: '800',
    },

    requestText: {
      flex: 1,

      minWidth: 0,

      justifyContent: 'center',
      alignItems: 'flex-start',
    },

    requestMetaRow: {
      flexDirection: 'row',

      alignItems: 'center',

      marginTop: 2,
    },

    requestMetaText: {
      lineHeight: 16,
      fontWeight: '500',
    },

    requestMetaDot: {
      marginHorizontal: 6,
      lineHeight: 16,
    },

    viewRequestButton: {
      height: 43,

      minWidth: 80,

      borderRadius: 15,

      paddingHorizontal: 12,

      backgroundColor:
        colors.accent,

      flexDirection: 'row',

      alignItems: 'center',
      justifyContent: 'center',
    },

    viewRequestText: {
      fontWeight: '800',
      marginRight: 4,
    },
  });