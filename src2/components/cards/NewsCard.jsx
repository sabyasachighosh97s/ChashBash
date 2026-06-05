import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, IconButton, Chip } from 'react-native-paper';

export const NewsCard = ({
  title,
  summary,
  date,
  author,
  imageUrl,
  category,
  readTime,
  likes = 0,
  comments = 0,
  onPress,
  onLike,
  onShare,
  isLiked = false,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      {imageUrl && (
        <Card.Cover source={{ uri: imageUrl }} style={styles.cover} />
      )}
      
      <Card.Content style={styles.content}>
        {/* Category and Date */}
        <View style={styles.metaContainer}>
          {category && (
            <Chip mode="flat" style={styles.category}>
              {category}
            </Chip>
          )}
          <Text style={styles.date}>{formatDate(date)}</Text>
        </View>

        {/* Title */}
        <Text variant="titleLarge" style={styles.title}>
          {title}
        </Text>

        {/* Summary */}
        <Text variant="bodyMedium" style={styles.summary} numberOfLines={3}>
          {summary}
        </Text>

        {/* Author and Read Time */}
        <View style={styles.authorContainer}>
          <Text variant="labelSmall" style={styles.author}>
            By {author}
          </Text>
          {readTime && (
            <Text variant="labelSmall" style={styles.readTime}>
              • {readTime} min read
            </Text>
          )}
        </View>
      </Card.Content>

      {/* Interaction Buttons */}
      <Card.Actions style={styles.actions}>
        <View style={styles.interactionButtons}>
          <IconButton
            icon={isLiked ? 'heart' : 'heart-outline'}
            iconColor={isLiked ? '#FF4444' : '#666'}
            size={20}
            onPress={onLike}
          />
          <Text style={styles.interactionCount}>{likes}</Text>
          
          <IconButton
            icon="comment-outline"
            iconColor="#666"
            size={20}
            onPress={() => {}}
          />
          <Text style={styles.interactionCount}>{comments}</Text>
          
          <IconButton
            icon="share-outline"
            iconColor="#666"
            size={20}
            onPress={onShare}
          />
        </View>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cover: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: 180,
  },
  content: {
    paddingTop: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    backgroundColor: '#E3F2FD',
    height: 28,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summary: {
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  author: {
    color: '#666',
  },
  readTime: {
    color: '#999',
    marginLeft: 4,
  },
  actions: {
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  interactionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: -4,
    marginRight: 12,
  },
});