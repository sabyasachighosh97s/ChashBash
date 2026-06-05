import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Share,
} from 'react-native';

import { Container, Card, Headline, Paragraph } from '@components/ui';
import { CustomStatusBar } from '@components/common/CustomStatusBar';
import AppIcon from '@components/AppIcon/AppIcon';
import { useTranslation } from 'react-i18next';

const CommunityScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([
    {
      id: '1',
      userName: 'Rahul Mondal',
      content: t('rice_leaf_issue'),
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854',
      likes: 12,
      comments: 4,
      liked: false,
      createdAt: `2 ${t('hours_ago')}`,
    },
    {
      id: '2',
      userName: 'Sourav Das',
      content: t('rain_warning'),
      image: '',
      likes: 7,
      comments: 2,
      liked: false,
      createdAt: `5 ${t('hours_ago')}`,
    },
    {
      id: '3',
      userName: 'Bikash Roy',
      content: t('organic_fertilizer_question'),
      image: '',
      likes: 9,
      comments: 3,
      liked: false,
      createdAt: `7 ${t('hours_ago')}`,
    },
    {
      id: '4',
      userName: 'Ratan Das',
      content: t('tomato_leaf_curl'),
      image: '',
      likes: 14,
      comments: 8,
      liked: false,
      createdAt: `9 ${t('hours_ago')}`,
    },
    {
      id: '5',
      userName: 'Anup Ghosh',
      content: t('healthy_paddy'),
      image: '',
      likes: 21,
      comments: 6,
      liked: false,
      createdAt: `1 ${t('day_ago')}`,
    },
  ]);

  const likePost = (id: string) => {
    setPosts(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              liked: !item.liked,
              likes: item.liked ? item.likes - 1 : item.likes + 1,
            }
          : item,
      ),
    );
  };
  const sharePost = async (content: string) => {
    await Share.share({
      message: content,
    });
  };

  const renderPost = ({ item }: any) => (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Paragraph style={styles.avatarText}>
            {item.userName.charAt(0)}
          </Paragraph>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.topRow}>
            <View style={styles.nameSection}>
              <View style={styles.userNameWrapper}>
                <Headline size="lg" style={styles.userName}>
                  {item.userName}
                </Headline>
              </View>

              <Paragraph size="xs" style={styles.timeText}>
                {item.createdAt}
              </Paragraph>
            </View>
            {/* 
            <View style={styles.badge}>
              <Paragraph size="xs" style={styles.badgeText}>
                Farmer
              </Paragraph>
            </View> */}
          </View>
        </View>
      </View>

      <Paragraph size="md" style={styles.content}>
        {item.content}
      </Paragraph>

      {!!item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}

      {/* <View style={styles.divider} /> */}

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.facebookButton}
          onPress={() => likePost(item.id)}
        >
          <AppIcon
            type="MaterialCommunityIcons"
            name={item.liked ? 'thumb-up' : 'thumb-up-outline'}
            size={22}
            color={item.liked ? '#1877F2' : '#65676B'}
          />

          <Paragraph
            size="sm"
            style={[
              styles.actionText,
              item.liked && styles.likedText,
              { marginTop: 4 },
            ]}
          >
            {item.likes} {t('like')}
          </Paragraph>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.facebookButton}
          onPress={() =>
            navigation.navigate('Comments', {
              post: item,
            })
          }
        >
          <AppIcon
            type="MaterialCommunityIcons"
            name="message-outline"
            size={22}
            color="#65676B"
          />

          <Paragraph size="sm" style={[styles.actionText, { marginTop: 4 }]}>
            {item.comments} {t('comment')}
          </Paragraph>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.facebookButton}
          onPress={() => sharePost(item.content)}
        >
          <AppIcon
            type="MaterialCommunityIcons"
            name="share-variant-outline"
            size={22}
            color="#65676B"
          />

          <Paragraph size="sm" style={[styles.actionText, { marginTop: 4 }]}>
            {t('share')}
          </Paragraph>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <Container>
      <CustomStatusBar />
      <Headline size="xl" style={styles.title}>
        {t('farmer_community')}
      </Headline>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Add')}
      >
        <View style={styles.fabContent}>
          <AppIcon
            type="MaterialCommunityIcons"
            name="plus-circle"
            size={20}
            color="#FFFFFF"
          />

          <Paragraph style={styles.fabText}>{t('create_post')}</Paragraph>
        </View>
      </TouchableOpacity>
    </Container>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
  title: {
    textAlign: 'left',
    marginTop: 40,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  card: {
    marginHorizontal: 16,
    // marginTop: 10,
    padding: 16,
    borderRadius: 20,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#114603',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },

  content: {
    textAlign: 'left',
    marginBottom: 14,
    lineHeight: 28,
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
  },

  actionRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E4E6EB',
    marginTop: 12,
    paddingTop: 8,
    justifyContent: 'space-between',
  },

  facebookButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionText: {
    color: '#65676B',
    fontWeight: '600',
  },

  likedText: {
    color: '#1877F2', // Facebook Blue
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#114603',
    paddingHorizontal: 18,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  divider: {
    height: 1,
    backgroundColor: '#ECEFF1',
    marginTop: 16,
  },

  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  userNameWrapper: {
    alignSelf: 'flex-start',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  userName: {
    textAlign: 'left',
    marginBottom: 0,
  },

  timeText: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    color: '#757575',
    fontSize: 12,
    lineHeight: 10,
  },

  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  badgeText: {
    color: '#114603',
    fontWeight: '600',
  },
  fabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  fabText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
});
