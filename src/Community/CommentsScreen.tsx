import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { Container, Card, Paragraph } from '@components/ui';
import { useTranslation } from 'react-i18next';

const CommentsScreen = ({ route }: any) => {
  const { t } = useTranslation();

  const { post } = route.params;

  const [comment, setComment] = useState('');

  const [comments, setComments] = useState([
    {
      id: '1',
      user: 'Amit',
      text: 'I had the same issue last month.',
      time: '2h',
    },
    {
      id: '2',
      user: 'Raj',
      text: 'Try checking nitrogen deficiency.',
      time: '1h',
    },
  ]);

  const addComment = () => {
    if (!comment.trim()) {
      return;
    }

    setComments(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        user: 'You',
        text: comment,
        time: 'Just now',
      },
    ]);

    setComment('');
  };

  const renderComment = ({ item }: any) => (
    <View style={styles.commentRow}>
      <View style={styles.commentAvatar}>
        <Paragraph style={styles.commentAvatarText}>
          {item.user.charAt(0)}
        </Paragraph>
      </View>

      <View style={styles.commentContent}>
        <Paragraph style={styles.commentUser}>{item.user}</Paragraph>

        {/* <Paragraph style={styles.commentTime}>{item.time}</Paragraph> */}

        <Paragraph style={styles.commentText}>{item.text}</Paragraph>
      </View>
    </View>
  );

  return (
    <Container backgroundColor="#F5F6F7">
      {/* Original Post */}
      <Card style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.avatar}>
            <Paragraph style={styles.avatarText}>
              {post.userName.charAt(0)}
            </Paragraph>
          </View>

          <View style={styles.userInfo}>
            <Paragraph style={styles.userName}>{post.userName}</Paragraph>

            <Paragraph style={styles.timeText}>
              Original Post • 2h ago
            </Paragraph>
          </View>
        </View>

        <Paragraph style={styles.postText}>{post.content}</Paragraph>
      </Card>

      {/* Comments */}
      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        renderItem={renderComment}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {/* Comment Input */}
      <View style={styles.commentComposer}>
        <View style={styles.myAvatar}>
          <Paragraph style={styles.commentAvatarText}>Y</Paragraph>
        </View>

        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder={t('write_comment')}
          placeholderTextColor="#8A8D91"
          style={styles.commentInput}
        />

        <TouchableOpacity style={styles.sendButton} onPress={addComment}>
          <Paragraph style={styles.sendText}>➤</Paragraph>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default CommentsScreen;

const styles = StyleSheet.create({
  postCard: {
    marginHorizontal: 16,
    marginTop: 60,
    marginBottom: 12,
    padding: 16,
    borderRadius: 18,
  },

  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#114603',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },

  timeText: {
    fontSize: 12,
    color: '#65676B',
  },

  postText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'left',
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 22,
  },

  commentAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#114603',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  commentAvatarText: {
    color: '#FFF',
    fontWeight: '700',
  },

  commentContent: {
    flex: 1,
    paddingTop: 2,
  },

  commentUser: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'left',
  },

  commentTime: {
    fontSize: 12,
    color: '#65676B',
    marginBottom: 6,
    textAlign: 'left',
  },

  commentText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#222',
    textAlign: 'left',
  },

  commentComposer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E6EB',
  },

  myAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#114603',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  commentInput: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 22,
    paddingHorizontal: 16,
    height: 50,
    color: '#000',
  },

  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1877F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  sendText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
