import React from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';

import AppIcon from '@components/AppIcon/AppIcon';
import {
  Container,
  Headline,
  Paragraph,
} from '@components/ui';
import { CustomCard } from '@components/cards/CustomCard';
import CustomHeader from '@components/Header/CustomHeader';
import colors from '@themes/colors';

type SelectedInputItem = {
  id: string | number;
  name: string;
  quantity: number;
  unit?: string;
  price?: number;
  category?: string;
  subcategory?: string;
  image?: string;

  // Demo-তে image না থাকলে icon ব্যবহার হবে।
  // API এলে image পাওয়া গেলে image ব্যবহার করা হবে।
  icon?: string;
};

/*
 * ============================================================
 * DEMO SELECTED ITEMS
 * ============================================================
 */

const DEMO_SELECTED_ITEMS: SelectedInputItem[] = [
  {
    id: 1,
    name: 'ইউরিয়া সার',
    quantity: 50,
    unit: 'কেজি',
    price: 1350,
    category: 'সার',
    subcategory: 'রাসায়নিক সার',
    icon: 'flask-outline',
  },
  {
    id: 2,
    name: 'টিএসপি সার',
    quantity: 25,
    unit: 'কেজি',
    price: 1100,
    category: 'সার',
    subcategory: 'রাসায়নিক সার',
    icon: 'beaker-outline',
  },
  {
    id: 3,
    name: 'এমওপি সার',
    quantity: 25,
    unit: 'কেজি',
    price: 850,
    category: 'সার',
    subcategory: 'রাসায়নিক সার',
    icon: 'barley',
  },
  {
    id: 4,
    name: 'ধানের বীজ',
    quantity: 10,
    unit: 'কেজি',
    price: 950,
    category: 'বীজ',
    subcategory: 'ধান',
    icon: 'sprout-outline',
  },
  {
    id: 5,
    name: 'হাইব্রিড টমেটো বীজ',
    quantity: 5,
    unit: 'প্যাকেট',
    price: 600,
    category: 'বীজ',
    subcategory: 'সবজি',
    icon: 'food-apple-outline',
  },
  {
    id: 6,
    name: 'কীটনাশক',
    quantity: 2,
    unit: 'লিটার',
    price: 720,
    category: 'বালাইনাশক',
    subcategory: 'কীটনাশক',
    icon: 'spray-bottle',
  },
];

const MyInputRequestsScreen = (props: any) => {
  const route = props.route;

  /*
   * ============================================================
   * DATA SOURCE
   * ============================================================
   */

  const selectedItems: SelectedInputItem[] =
    route.params?.selectedItems?.length > 0
      ? route.params.selectedItems
      : DEMO_SELECTED_ITEMS;


  /*
   * ============================================================
   * PRODUCT CARD
   * ============================================================
   */

  const renderItem: ListRenderItem<SelectedInputItem> = ({ item }) => {
    return (
      <CustomCard style={styles.itemCard}>
        {/* ==================================================
            Product Main Section
        ================================================== */}

        <View style={styles.productMainRow}>
          {/* Product Image / Demo Icon */}
          <View style={styles.productVisual}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.productIconContainer}>
                <AppIcon
                  type="MaterialCommunityIcons"
                  name={
                    item.icon || 'package-variant-closed'
                  }
                  size={32}
                  color={colors.primary}
                />
              </View>
            )}
          </View>

          {/* Product Information */}
          <View style={styles.productInfo}>
            <View style={styles.productTitleRow}>
              <View style={styles.productTitleContainer}>
                <Headline
                  numberOfLines={2}
                  style={styles.productName}
                >
                  {item.name}
                </Headline>

                {/* Category Information */}
                {item.category ? (
                  <View style={styles.categoryBadge}>
                    <Paragraph
                      numberOfLines={1}
                      style={styles.categoryText}
                    >
                      {item.category}
                    </Paragraph>
                  </View>
                ) : null}
              </View>

              {/* Selected Indicator + Subcategory */}
              <View style={styles.selectedColumn}>
                <View style={styles.selectedBadge}>
                  <AppIcon
                    type="MaterialCommunityIcons"
                    name="check"
                    size={15}
                    color={colors.primary}
                  />
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
          </View>
        </View>

        {/* ==================================================
            Product Details
        ================================================== */}

        <View style={styles.detailsSection}>
          {/* Quantity */}
          <View style={styles.quantitySection}>
            <Paragraph style={styles.detailLabel}>
              পরিমাণ
            </Paragraph>

            <View style={styles.quantityValueRow}>
              <Paragraph style={styles.quantityValue}>
                {Number(item.quantity).toLocaleString('bn-BD')}
              </Paragraph>

              {item.unit ? (
                <Paragraph style={styles.quantityUnit}>
                  {item.unit}
                </Paragraph>
              ) : null}
            </View>
          </View>

          {/* Price */}
          {typeof item.price === 'number' ? (
            <View style={styles.priceSection}>
              <Paragraph style={styles.detailLabel}>
                আনুমানিক মূল্য
              </Paragraph>

              <Paragraph style={styles.priceValue}>
                {item.price.toLocaleString('bn-BD')} {' '}{'টাকা '}
              </Paragraph>
            </View>
          ) : null}
        </View>

      </CustomCard>
    );
  };

  const keyExtractor = (item: SelectedInputItem) =>
    String(item.id);

  /*
   * ============================================================
   * SCREEN
   * ============================================================
   */

  return (
    <Container style={styles.container}>
           <CustomHeader
                
              />
      <View style={styles.content}>
        <FlatList
          data={selectedItems}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </Container>
  );
};

export default MyInputRequestsScreen;

/*
 * ============================================================
 * STYLES
 * ============================================================
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    marginTop:6
  },

  /* ========================================================
     LIST
  ======================================================== */

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },

  /* ========================================================
     PRODUCT CARD
  ======================================================== */

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

  selectedColumn: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    minWidth: 70,
    marginLeft: 4,
  },

  selectedBadge: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ========================================================
     CATEGORY
  ======================================================== */

  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
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

  /* ========================================================
     DETAILS
  ======================================================== */

  detailsSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
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
    alignItems: 'baseline',
    minHeight: 22,
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

  priceValue: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    color: colors.primary,
    margin: 0,
  },


});