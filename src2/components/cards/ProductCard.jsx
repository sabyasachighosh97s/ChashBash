import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Card, Text, Button, IconButton, Chip } from 'react-native-paper';

export const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  description,
  imageUrl,
  rating,
  discount,
  inStock = true,
  onPress,
  onAddToCart,
  onWishlist,
  category,
}) => {
  const discountedPrice = discount 
    ? (price - (price * discount / 100)).toFixed(2)
    : price;

  return (
    <Card style={styles.card} onPress={onPress}>
      {/* Image with Wishlist Button */}
      <View style={styles.imageContainer}>
        <Card.Cover source={{ uri: imageUrl }} style={styles.image} />
        <IconButton
          icon="heart-outline"
          iconColor="#fff"
          size={24}
          style={styles.wishlistButton}
          onPress={onWishlist}
        />
        {discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <Card.Content style={styles.content}>
        {category && (
          <Chip icon="tag" style={styles.categoryChip} textStyle={styles.chipText}>
            {category}
          </Chip>
        )}
        
        <Text variant="titleMedium" style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        
        <Text variant="bodySmall" style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        {/* Rating */}
        {rating && (
          <View style={styles.ratingContainer}>
            <IconButton icon="star" iconColor="#FFB800" size={16} style={styles.starIcon} />
            <Text style={styles.rating}>{rating}</Text>
          </View>
        )}

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>${discountedPrice}</Text>
          {originalPrice && (
            <Text style={styles.originalPrice}>${originalPrice}</Text>
          )}
          {inStock ? (
            <Text style={styles.inStock}>In Stock</Text>
          ) : (
            <Text style={styles.outOfStock}>Out of Stock</Text>
          )}
        </View>
      </Card.Content>

      {/* Actions */}
      <Card.Actions style={styles.actions}>
        <Button 
          mode="contained" 
          onPress={onAddToCart}
          disabled={!inStock}
          style={styles.addButton}
        >
          Add to Cart
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: 200,
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    margin: 0,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    paddingTop: 12,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    backgroundColor: '#E3F2FD',
  },
  chipText: {
    fontSize: 10,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starIcon: {
    margin: 0,
    padding: 0,
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#999',
  },
  inStock: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 'auto',
  },
  outOfStock: {
    fontSize: 12,
    color: '#F44336',
    marginLeft: 'auto',
  },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  addButton: {
    flex: 1,
  },
});