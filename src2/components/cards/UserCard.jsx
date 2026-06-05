import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Avatar, Text, Button, IconButton } from 'react-native-paper';

export const UserCard = ({
  name,
  email,
  avatarUrl,
  role,
  followers,
  following,
  onEdit,
  onFollow,
  isFollowing = false,
}) => {
  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content style={styles.content}>
        {/* Avatar and Edit Button */}
        <View style={styles.header}>
          <Avatar.Image 
            source={{ uri: avatarUrl }} 
            size={80}
            style={styles.avatar}
          />
          {onEdit && (
            <IconButton
              icon="pencil"
              size={20}
              onPress={onEdit}
              style={styles.editButton}
            />
          )}
        </View>

        {/* User Info */}
        <Text variant="titleLarge" style={styles.name}>
          {name}
        </Text>
        <Text variant="bodyMedium" style={styles.email}>
          {email}
        </Text>
        
        {role && (
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{role}</Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{followers || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{following || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {/* Follow Button */}
        {onFollow && (
          <Button
            mode={isFollowing ? 'outlined' : 'contained'}
            onPress={onFollow}
            style={styles.followButton}
            icon={isFollowing ? 'check' : 'account-plus'}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
  },
  content: {
    alignItems: 'center',
  },
  header: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    marginBottom: 8,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    elevation: 2,
  },
  name: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  email: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  roleText: {
    fontSize: 12,
    color: '#1976D2',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  followButton: {
    width: '100%',
  },
});