import React, {
  memo,
  useRef,
  useState,
} from 'react';

import {
  Image,
  LayoutAnimation,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
  ViewStyle,
} from 'react-native';

import {
  Headline,
  Paragraph,
} from '@components/ui';

import AppIcon from '@components/AppIcon/AppIcon';

import useThemeMode from '@hook/useThemeMode';

import colors from '@themes/colors';

import {useTranslation} from 'react-i18next';

/* ==========================================================================
   Types
========================================================================== */

export type InputItemPrice = {
  prod_price_id?: string | number;
  quantity?: number | string;
  sales_price?: number | string;
  discounted_price?: number | string | null;
  price?: number | string;

  unit?: {
    unit_name?: string;
    unit_sname?: string;
    fid?: string | number;
  };
};

export type InputItem = {
  id?: string | number;
  fid?: string | number;

  product_name?: string;
  name?: string;
  product_code?: string;
  description?: string;

  image?: string;
  image_url?: string;

  category?: string;
  sub_category?: string;

  agri_product_prices?: InputItemPrice[];
};

interface Props {
  item: InputItem;

  onPress?: (item: InputItem) => void;

  onBuy?: (item: InputItem) => void;

  onRemove?: (item: InputItem) => void;

  selected?: boolean;

  style?: StyleProp<ViewStyle>;
}

/* ==========================================================================
   Android Layout Animation
========================================================================== */

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* ==========================================================================
   Category Icon
========================================================================== */

const getCategoryIcon = (
  category?: string,
) => {
  switch (category) {
    case 'fertilizer':
      return 'eco';

    case 'seed':
      return 'spa';

    case 'pesticide':
      return 'bug-report';

    case 'equipment':
      return 'build';

    default:
      return 'category';
  }
};

/* ==========================================================================
   Packet options
   - 1–2 packets keep the existing compact layout.
   - 3+ packets stay in one horizontal row and can be swiped.
   - Small arrows move the list by roughly two packets.
========================================================================== */

type PacketOptionsProps = {
  packageOptions: InputItemPrice[];
  themeColors: any;
};

const PacketOptions = ({
  packageOptions,
  themeColors,
}: PacketOptionsProps) => {
  const {t} = useTranslation();

  const scrollRef =
    useRef<ScrollView | null>(null);

  const [scrollX, setScrollX] =
    useState(0);

  const [containerWidth, setContainerWidth] =
    useState(0);

  const [contentWidth, setContentWidth] =
    useState(0);

  const isScrollable =
    contentWidth >
    containerWidth + 2;

  const canScrollLeft =
    scrollX > 2;

  const canScrollRight =
    contentWidth > 0 &&
    containerWidth > 0 &&
    scrollX <
      contentWidth -
        containerWidth -
        2;

  const movePackets = (
    direction: 'left' | 'right',
  ) => {
    const step = 224;

    const nextX =
      direction === 'right'
        ? Math.min(
            Math.max(
              0,
              contentWidth -
                containerWidth,
            ),
            scrollX + step,
          )
        : Math.max(
            0,
            scrollX - step,
          );

    scrollRef.current?.scrollTo({
      x: nextX,
      animated: true,
    });
  };

  const renderPacket = (
    packet: InputItemPrice,
    index: number,
  ) => {
    const packetPrice =
      packet.discounted_price ??
      packet.sales_price ??
      packet.price;

    const packetOriginalPrice =
      packet.sales_price ??
      packet.price;

    const packetUnit =
      packet.unit?.unit_name ||
      packet.unit?.unit_sname ||
      '';

    const packetSize =
      packet.quantity !== undefined &&
      packet.quantity !== null &&
      packet.quantity !== ''
        ? `${packet.quantity} ${packetUnit}`.trim()
        : packetUnit;

    const packetHasDiscount =
      packet.discounted_price !==
        undefined &&
      packet.discounted_price !==
        null &&
      String(
        packet.discounted_price,
      ) !==
        String(
          packetOriginalPrice ?? '',
        );

    return (
      <View
        key={String(
          packet.prod_price_id ??
            `packet-${index}`,
        )}
        style={[
          styles.packetChip,
          packageOptions.length > 2 &&
            styles.packetChipScrollable,
        ]}
      >
        <Paragraph
          size="xs"
          textColor={
            themeColors.onSurfaceVariant ??
            colors.subText
          }
          style={
            styles.packetLabel
          }
        >
          {t('packet')}
        </Paragraph>

        <Paragraph
          size="sm"
          textColor={
            themeColors.text ??
            colors.text
          }
          style={
            styles.packetSize
          }
          numberOfLines={1}
        >
          {packetSize || t('packet')}
        </Paragraph>

        {packetPrice !== undefined &&
        packetPrice !== null ? (
          <Paragraph
            size="sm"
            textColor={
              colors.primary
            }
            style={
              styles.packetPrice
            }
          >
            ₹{packetPrice}
          </Paragraph>
        ) : null}

        {packetHasDiscount ? (
          <Paragraph
            size="xs"
            textColor={
              colors.subText
            }
            style={
              styles.packetOriginalPrice
            }
          >
            ₹{packetOriginalPrice}
          </Paragraph>
        ) : null}
      </View>
    );
  };

  /* ------------------------------------------------------------------------
     Keep existing appearance for one or two packet options.
  ------------------------------------------------------------------------ */

  if (packageOptions.length <= 2) {
    return (
      <View
        style={
          styles.packetSection
        }
      >
        <View
          style={
            styles.packetList
          }
        >
          {packageOptions.map(
            renderPacket,
          )}
        </View>
      </View>
    );
  }

  return (
    <View
      style={
        styles.packetSection
      }
    >
      <View
        style={
          styles.packetCarousel
        }
        onLayout={event =>
          setContainerWidth(
            event.nativeEvent.layout.width,
          )
        }
      >
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          bounces={false}
          directionalLockEnabled
          nestedScrollEnabled
          contentContainerStyle={
            styles.packetScrollContent
          }
          onContentSizeChange={width =>
            setContentWidth(width)
          }
          onScroll={(
            event: NativeSyntheticEvent<NativeScrollEvent>,
          ) =>
            setScrollX(
              event.nativeEvent
                .contentOffset.x,
            )
          }
          scrollEventThrottle={16}
        >
          {packageOptions.map(
            renderPacket,
          )}
        </ScrollView>

        {isScrollable &&
        canScrollLeft ? (
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() =>
              movePackets('left')
            }
            style={[
              styles.packetArrow,
              styles.packetArrowLeft,
            ]}
          >
            <AppIcon
              type="MaterialIcons"
              name="chevron-left"
              size={21}
              color={
                colors.primary
              }
            />
          </TouchableOpacity>
        ) : null}

        {isScrollable &&
        canScrollRight ? (
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() =>
              movePackets('right')
            }
            style={[
              styles.packetArrow,
              styles.packetArrowRight,
            ]}
          >
            <AppIcon
              type="MaterialIcons"
              name="chevron-right"
              size={21}
              color={
                colors.primary
              }
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

/* ==========================================================================
   Component
========================================================================== */

const InputItemCard = ({
  item,
  onBuy,
  onPress,
  onRemove,
  selected = false,
  style,
}: Props) => {
  const {theme} =
    useThemeMode();

  const {t} =
    useTranslation();

  const themeColors =
    theme.colors;

  const [expanded, setExpanded] =
    useState(false);

  const [imageLoadFailed, setImageLoadFailed] =
    useState(false);

  /* ------------------------------------------------------------------------
     Product information
  ------------------------------------------------------------------------ */

  const productName =
    item?.product_name ||
    item?.name ||
    t('input_item');

  const category =
    item?.category || '';

  const subCategory =
    item?.sub_category || '';

  const firstPrice =
    item?.agri_product_prices?.[0];

  const price =
    firstPrice?.discounted_price ??
    firstPrice?.sales_price ??
    firstPrice?.price;

  const originalPrice =
    firstPrice?.sales_price ??
    firstPrice?.price;

  const packageQuantity =
    firstPrice?.quantity;

  const unitName =
    firstPrice?.unit?.unit_name ||
    firstPrice?.unit?.unit_sname ||
    '';

  const productImage =
    item?.image ||
    item?.image_url;

  const packageOptions =
    item?.agri_product_prices ?? [];

  const hasDiscount =
    firstPrice?.discounted_price !==
      undefined &&
    firstPrice?.discounted_price !==
      null &&
    String(
      firstPrice.discounted_price,
    ) !==
      String(
        originalPrice ?? '',
      );

  /* ------------------------------------------------------------------------
     Text
  ------------------------------------------------------------------------ */

  const priceText =
    price !== undefined &&
    price !== null
      ? `₹${price}`
      : '';

  const packageText =
    packageQuantity !==
      undefined &&
    packageQuantity !== null &&
    packageQuantity !== ''
      ? `${packageQuantity} ${unitName}`.trim()
      : unitName;

  /* ------------------------------------------------------------------------
     Toggle details
  ------------------------------------------------------------------------ */

  const toggleDetails = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets
        .easeInEaseOut,
    );

    setExpanded(
      value => !value,
    );
  };

  /* ==========================================================================
     UI
  ========================================================================== */

  return (
    <View
      style={[
        styles.wrapper,
        style,
      ]}
    >
      {/* ====================================================================
          SINGLE CARD
          Everything including expanded details stays inside this card.
      ==================================================================== */}

      <View
        style={[
          styles.card,
          {
            backgroundColor:
              themeColors.surface ??
              colors.surface,

            borderColor: selected
              ? colors.primary
              : themeColors.border ??
                colors.border,

            borderWidth: selected
              ? 1.5
              : 1,
          },
        ]}
      >
        {/* ================================================================
            Main Product Area
        ================================================================= */}

        <View
          style={
            styles.mainContent
          }
        >
          {/* ==============================================================
              Product image
          ============================================================== */}

          <View
            style={[
              styles.imageContainer,
              {
                backgroundColor:
                  `${colors.primary}0C`,
              },
            ]}
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
                  styles.imageFallback
                }
              >
                <View
                  style={
                    styles.imageIconCircle
                  }
                >
                  <AppIcon
                    type="MaterialIcons"
                    name={getCategoryIcon(
                      category,
                    )}
                    size={38}
                    color={
                      colors.primary
                    }
                  />
                </View>
              </View>
            )}

            {/* Selected */}

            {selected && (
              <View
                style={
                  styles.selectedBadge
                }
              >
                <AppIcon
                  type="MaterialIcons"
                  name="check"
                  size={15}
                  color={
                    colors.textLight
                  }
                />
              </View>
            )}
          </View>

          {/* ==============================================================
              Product content
          ============================================================== */}

          <View
            style={
              styles.content
            }
          >
            {/* Product title */}

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                onPress?.(item)
              }
            >
              <View
                style={
                  styles.titleRow
                }
              >
                <Headline
                  size="sm"
                  numberOfLines={2}
                  textColor={
                    themeColors.text ??
                    colors.text
                  }
                  style={
                    styles.productName
                  }
                >
                  {productName}
                </Headline>
              </View>

              {/* Price */}

              {(priceText ||
                packageText) && (
                <View
                  style={
                    styles.priceRow
                  }
                >
                  {priceText ? (
                    <View
                      style={
                        styles.priceGroup
                      }
                    >
                      <Headline
                        size="sm"
                        textColor={
                          colors.primary
                        }
                        style={
                          styles.price
                        }
                      >
                        {priceText}
                      </Headline>

                      {hasDiscount ? (
                        <Paragraph
                          size="xs"
                          textColor={
                            themeColors.onSurfaceVariant ??
                            colors.subText
                          }
                          style={
                            styles.originalPrice
                          }
                        >
                          ₹
                          {
                            originalPrice
                          }
                        </Paragraph>
                      ) : null}
                    </View>
                  ) : null}

                  {packageText ? (
                    <Paragraph
                      size="xs"
                      numberOfLines={1}
                      textColor={
                        themeColors
                          .onSurfaceVariant ??
                        colors.subText
                      }
                      style={
                        styles.unitText
                      }
                    >
                      / {packageText}
                    </Paragraph>
                  ) : null}
                </View>
              )}
            </TouchableOpacity>

            {/* Actions */}

            <View
              style={
                styles.actionRow
              }
            >
              {/* Details */}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={
                  toggleDetails
                }
                style={[
                  styles.detailsButton,
                  {
                    borderColor:
                      expanded
                        ? colors.primary
                        : `${colors.primary}35`,

                    backgroundColor:
                      expanded
                        ? `${colors.primary}0C`
                        : 'transparent',
                  },
                ]}
              >
                <AppIcon
                  type="MaterialIcons"
                  name={
                    expanded
                      ? 'keyboard-arrow-up'
                      : 'visibility'
                  }
                  size={18}
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
                    styles.detailsText
                  }
                >
                  {expanded
                    ? t(
                        'close_details',
                      )
                    : t('details')}
                </Paragraph>
              </TouchableOpacity>

              {/* Select / Remove */}

              {selected ? (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    onRemove?.(item)
                  }
                  style={
                    styles.removeButton
                  }
                >
                  <Paragraph
                    size="xs"
                    textColor={
                      colors.error
                    }
                    style={
                      styles.removeText
                    }
                  >
                    {t('remove')}
                  </Paragraph>

                  <AppIcon
                    type="MaterialIcons"
                    name="delete-outline"
                    size={17}
                    color={
                      colors.error
                    }
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    onBuy?.(item)
                  }
                  style={
                    styles.buyButton
                  }
                >
                  <Paragraph
                    size="xs"
                    textColor={
                      colors.textLight
                    }
                    style={
                      styles.buyText
                    }
                  >
                    {t(
                      'want_to_take',
                    )}
                  </Paragraph>

                  <AppIcon
                    type="MaterialIcons"
                    name="arrow-forward"
                    size={17}
                    color={
                      colors.textLight
                    }
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* ==================================================================
            Expanded Details
            Compact farmer-friendly layout
        ================================================================== */}

        {expanded && (
          <View
            style={[
              styles.expandedSection,
              {
                borderTopColor:
                  themeColors.outline ??
                  colors.border,
              },
            ]}
          >
            {/* Section heading */}

            <View
              style={
                styles.expandedHeadingRow
              }
            >
              <View
                style={
                  styles.expandedHeadingIcon
                }
              >
                <AppIcon
                  type="MaterialIcons"
                  name="info-outline"
                  size={19}
                  color={
                    colors.primary
                  }
                />
              </View>

              <View
                style={
                  styles.expandedHeadingContent
                }
              >
                <Headline
                  size="sm"
                  textColor={
                    themeColors.text ??
                    colors.text
                  }
                  style={
                    styles.expandedHeadingTitle
                  }
                >
                  {t(
                    'material_details',
                  )}
                </Headline>
              </View>
            </View>

            {/* Product description */}

            {item.description ? (
              <View
                style={
                  styles.descriptionBox
                }
              >
                <Paragraph
                  size="sm"
                  textColor={
                    themeColors.text ??
                    colors.text
                  }
                  style={
                    styles.descriptionText
                  }
                >
                  {item.description}
                </Paragraph>
              </View>
            ) : null}

            {/* Category + sub-category */}

            {(category ||
              subCategory) ? (
              <View
                style={
                  styles.infoGrid
                }
              >
                {category ? (
                  <View
                    style={
                      styles.infoItem
                    }
                  >
                    <Paragraph
                      size="xs"
                      textColor={
                        themeColors.onSurfaceVariant ??
                        colors.subText
                      }
                      style={
                        styles.infoLabel
                      }
                    >
                      {t(
                        'category',
                      )}
                    </Paragraph>

                    <Paragraph
                      size="sm"
                      textColor={
                        themeColors.text ??
                        colors.text
                      }
                      style={
                        styles.infoValue
                      }
                      numberOfLines={
                        1
                      }
                    >
                      {category}
                    </Paragraph>
                  </View>
                ) : null}

                {subCategory ? (
                  <View
                    style={
                      styles.infoItem
                    }
                  >
                    <Paragraph
                      size="xs"
                      textColor={
                        themeColors.onSurfaceVariant ??
                        colors.subText
                      }
                      style={
                        styles.infoLabel
                      }
                    >
                      {t(
                        'sub_category',
                      )}
                    </Paragraph>

                    <Paragraph
                      size="sm"
                      textColor={
                        themeColors.text ??
                        colors.text
                      }
                      style={
                        styles.infoValue
                      }
                      numberOfLines={
                        1
                      }
                    >
                      {subCategory}
                    </Paragraph>
                  </View>
                ) : null}
              </View>
            ) : null}

            {/* Available packets */}

            {packageOptions.length >
            0 ? (
              <PacketOptions
                packageOptions={
                  packageOptions
                }
                themeColors={
                  themeColors
                }
              />
            ) : null}

            {/* Product code - only when API provides it */}

            {item.product_code ? (
              <View
                style={
                  styles.productCodeRow
                }
              >
                <Paragraph
                  size="xs"
                  textColor={
                    themeColors.onSurfaceVariant ??
                    colors.subText
                  }
                  style={
                    styles.infoLabel
                  }
                >
                  {t(
                    'product_code',
                  )}
                </Paragraph>

                <Paragraph
                  size="xs"
                  textColor={
                    themeColors.text ??
                    colors.text
                  }
                  style={
                    styles.productCodeValue
                  }
                  numberOfLines={1}
                >
                  {item.product_code}
                </Paragraph>
              </View>
            ) : null}

            {/* Collapse */}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={
                toggleDetails
              }
              style={
                styles.collapseButton
              }
            >
              <Paragraph
                size="xs"
                textColor={
                  colors.primary
                }
                style={
                  styles.collapseText
                }
              >
                {t(
                  'close_details',
                )}
              </Paragraph>

              <AppIcon
                type="MaterialIcons"
                name="keyboard-arrow-up"
                size={18}
                color={
                  colors.primary
                }
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default memo(
  InputItemCard,
);

/* ==========================================================================
   Styles
========================================================================== */

const styles =
  StyleSheet.create({
    wrapper: {
      width: '100%',
      marginBottom: 13,
    },

    /* ==========================================================================
       Single unified card
    ========================================================================== */

    card: {
      width: '100%',
      borderRadius: 20,
      padding: 10,

      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,

      overflow: 'hidden',
    },

    /* ==========================================================================
       Main product section
    ========================================================================== */

    mainContent: {
      width: '100%',

      flexDirection: 'row',
      alignItems: 'center',
    },

    imageContainer: {
      width: 94,
      height: 126,

      borderRadius: 16,

      alignItems: 'center',
      justifyContent: 'center',

      overflow: 'hidden',
    },

    productImage: {
      width: '100%',
      height: '100%',
    },

    imageFallback: {
      flex: 1,
      width: '100%',

      alignItems: 'center',
      justifyContent: 'center',
    },

    imageIconCircle: {
      width: 62,
      height: 62,

      borderRadius: 31,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        `${colors.primary}10`,
    },

    selectedBadge: {
      position: 'absolute',

      top: 7,
      right: 7,

      width: 25,
      height: 25,

      borderRadius: 13,

      backgroundColor:
        colors.primary,

      alignItems: 'center',
      justifyContent: 'center',
    },

    content: {
      flex: 1,

      marginLeft: 13,

      paddingVertical: 2,
    },

    titleRow: {
      width: '100%',

      flexDirection: 'row',
      alignItems: 'flex-start',
    },

    productName: {
      flex: 1,

      paddingRight: 5,

      lineHeight: 21,
    },

    priceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',

      marginTop: 8,
    },

    priceGroup: {
      flexDirection: 'row',
      alignItems: 'baseline',

      flexShrink: 1,
    },

    originalPrice: {
      marginLeft: 7,

      lineHeight: 17,

      textDecorationLine:
        'line-through',
    },

    price: {
      lineHeight: 20,
    },

    unitText: {
      marginLeft: 5,

      lineHeight: 18,

      flexShrink: 1,
    },

    /* ==========================================================================
       Actions
    ========================================================================== */

    actionRow: {
      width: '100%',

      flexDirection: 'row',
      alignItems: 'center',

      marginTop: 12,
    },

    detailsButton: {
      height: 36,

      paddingHorizontal: 10,

      borderRadius: 18,

      borderWidth: 1,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    detailsText: {
      marginLeft: 5,

      fontWeight: '600',
    },

    buyButton: {
      height: 36,

      flex: 1,

      marginLeft: 8,

      paddingHorizontal: 11,

      borderRadius: 18,

      backgroundColor:
        colors.primary,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    removeButton: {
      height: 36,

      flex: 1,

      marginLeft: 8,

      paddingHorizontal: 11,

      borderRadius: 18,

      backgroundColor:
        `${colors.error}08`,

      borderWidth: 1,

      borderColor:
        `${colors.error}25`,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    removeText: {
      fontWeight: '700',

      marginRight: 5,
    },

    buyText: {
      fontWeight: '700',

      marginRight: 5,
    },

    /* ==========================================================================
       Expanded details
       Compact, clean and farmer-friendly
    ========================================================================== */

    expandedSection: {
      width: '100%',

      marginTop: 12,

      paddingTop: 13,
      paddingHorizontal: 2,
      paddingBottom: 1,

      borderTopWidth:
        StyleSheet.hairlineWidth,
    },

    expandedHeadingRow: {
      width: '100%',

      flexDirection: 'row',
      alignItems: 'center',

      marginBottom: 10,
    },

    expandedHeadingIcon: {
      width: 36,
      height: 36,

      borderRadius: 12,

      backgroundColor:
        `${colors.primary}0A`,

      borderWidth: 1,

      borderColor:
        `${colors.primary}16`,

      alignItems: 'center',
      justifyContent: 'center',
    },

    expandedHeadingContent: {
      flex: 1,

      marginLeft: 9,

      minWidth: 0,
    },

    expandedHeadingTitle: {
      fontWeight: '800',

      lineHeight: 20,
    },

    expandedHeadingSubtitle: {
      marginTop: 1,

      lineHeight: 16,
    },

    descriptionBox: {
      width: '100%',

      paddingHorizontal: 11,
      paddingVertical: 9,

      marginBottom: 10,

      borderRadius: 12,

      backgroundColor:
        `${colors.primary}05`,

      borderWidth: 1,

      borderColor:
        `${colors.primary}0D`,
    },

    descriptionLabel: {
      fontWeight: '600',

      lineHeight: 15,

      marginBottom: 3,
    },

    descriptionText: {
      lineHeight: 19,

      textAlign: 'left',
    },

    infoGrid: {
      width: '100%',

      flexDirection: 'row',

      gap: 8,

      marginBottom: 9,
    },

    infoItem: {
      flex: 1,

      minWidth: 0,

      paddingHorizontal: 10,
      paddingVertical: 8,

      borderRadius: 11,

      backgroundColor:
        colors.surface,

      borderWidth: 1,

      borderColor:
        colors.border,
    },

    infoLabel: {
      lineHeight: 15,

      marginBottom: 2,
    },

    infoValue: {
      fontWeight: '700',

      lineHeight: 18,

      flexShrink: 1,
    },

    packetSection: {
      width: '100%',

      marginBottom: 8,
    },

    packetSectionHeader: {
      width: '100%',

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',

      marginBottom: 6,
    },

    packetSectionLabel: {
      fontWeight: '700',

      lineHeight: 16,
    },

    packetCountBadge: {
      minWidth: 30,
      height: 21,

      paddingHorizontal: 6,

      borderRadius: 11,

      backgroundColor:
        `${colors.accent}55`,

      alignItems: 'center',
      justifyContent: 'center',
    },

    packetCountText: {
      fontWeight: '700',

      lineHeight: 14,
    },

    packetList: {
      width: '100%',

      flexDirection: 'row',

      gap: 7,
    },

    packetCarousel: {
      width: '100%',

      position: 'relative',
    },

    packetScrollContent: {
      flexDirection: 'row',

      gap: 7,

      paddingRight: 2,
    },

    packetChip: {
      flexGrow: 1,

      minWidth: 96,

      paddingHorizontal: 10,
      paddingVertical: 8,

      borderRadius: 12,

      backgroundColor:
        `${colors.primary}05`,

      borderWidth: 1,

      borderColor:
        `${colors.primary}14`,
    },

    packetChipScrollable: {
      width: 104,

      flexGrow: 0,
    },

    packetArrow: {
      position: 'absolute',

      top: '50%',

      marginTop: -16,

      width: 30,
      height: 32,

      borderRadius: 16,

      backgroundColor:
        colors.surface,

      borderWidth: 1,

      borderColor:
        `${colors.primary}22`,

      alignItems: 'center',
      justifyContent: 'center',

      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity: 0.12,
      shadowRadius: 4,

      elevation: 2,
    },

    packetArrowLeft: {
      left: 2,
    },

    packetArrowRight: {
      right: 2,
    },

    packetLabel: {
      lineHeight: 14,
    },

    packetSize: {
      marginTop: 1,

      fontWeight: '700',

      lineHeight: 18,
    },

    packetPrice: {
      marginTop: 2,

      fontWeight: '800',

      lineHeight: 18,
    },

    packetOriginalPrice: {
      marginTop: 0,

      lineHeight: 14,

      textDecorationLine:
        'line-through',
    },

    productCodeRow: {
      width: '100%',

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',

      paddingHorizontal: 10,
      paddingVertical: 7,

      marginBottom: 8,

      borderRadius: 10,

      backgroundColor:
        `${colors.primary}04`,
    },

    productCodeValue: {
      flexShrink: 1,

      marginLeft: 10,

      fontWeight: '600',
    },

    collapseButton: {
      alignSelf: 'center',

      minWidth: 132,

      height: 32,

      paddingHorizontal: 11,

      marginTop: 1,

      borderRadius: 16,

      backgroundColor:
        `${colors.primary}07`,

      borderWidth: 1,

      borderColor:
        `${colors.primary}16`,

      flexDirection: 'row',

      alignItems: 'center',
      justifyContent: 'center',
    },

    collapseText: {
      fontWeight: '700',

      lineHeight: 16,

      marginRight: 3,
    },
  });