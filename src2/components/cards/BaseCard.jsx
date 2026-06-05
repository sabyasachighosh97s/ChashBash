import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';

export const BaseCard = ({
  title,
  subtitle,
  content,
  leftIcon,
  rightIcon,
  onPress,
  onLongPress,
  actions = [],
  coverImage,
  elevation = 2,
  style,
  contentStyle,
  titleStyle,
  subtitleStyle,
  mode = 'elevated', // 'elevated' or 'outlined'
}) => {
  const theme = useTheme();

  return (
    <Card
      mode={mode}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.card, { elevation }, style]}
    >
      {coverImage && (
        <Card.Cover source={coverImage} style={styles.cover} />
      )}
      
      <Card.Title
        title={title}
        subtitle={subtitle}
        left={leftIcon}
        right={rightIcon}
        titleStyle={[styles.title, titleStyle]}
        subtitleStyle={[styles.subtitle, subtitleStyle]}
      />
      
      {content && (
        <Card.Content style={contentStyle}>
          {typeof content === 'string' ? (
            <Text variant="bodyMedium">{content}</Text>
          ) : (
            content
          )}
        </Card.Content>
      )}
      
      {actions.length > 0 && (
        <Card.Actions style={styles.actions}>
          {actions.map((action, index) => (
            <Button
              key={index}
              mode={action.mode || 'text'}
              onPress={action.onPress}
              icon={action.icon}
              buttonColor={action.buttonColor}
              textColor={action.textColor}
            >
              {action.label}
            </Button>
          ))}
        </Card.Actions>
      )}
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
  },
  actions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});