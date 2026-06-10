import React, { useState } from 'react';

import { StyleSheet, TouchableOpacity, View } from 'react-native';
import colors from '@themes/colors';
import { Container, Card, Button, Paragraph, Headline } from '@components/ui';
import AppIcon from '@components/AppIcon/AppIcon';
import { TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';

const CreatePostScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [content, setContent] = useState('');

  const publishPost = () => {
    console.log({
      content,
    });

    navigation.goBack();
  };

  return (
    <Container backgroundColor={colors.background}>
      <Headline size="xl" style={styles.pageTitle}>
        Create Post
      </Headline>

      <Card style={styles.postCard}>
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Paragraph style={styles.avatarText}>R</Paragraph>
          </View>

          <View>
            <Headline size="md">Rahul Mondal</Headline>
          </View>
        </View>

        <TextInput
          placeholder={t('farm_today_prompt')}
          placeholderTextColor={colors.placeholder}
          multiline
          value={content}
          onChangeText={setContent}
          style={styles.input}
        />

        <TouchableOpacity style={styles.mediaCard}>
          <View style={styles.mediaContent}>
            <AppIcon
              type="MaterialCommunityIcons"
              name="image-plus"
              size={22}
              color={colors.info}
            />

            <Paragraph style={styles.mediaText}>{t('add_photo')}</Paragraph>
          </View>
        </TouchableOpacity>
      </Card>

      <TouchableOpacity
        style={[styles.publishButton, !content.trim() && styles.disabledButton]}
        onPress={publishPost}
        disabled={!content.trim()}
      >
        <Paragraph style={styles.publishText}> {t('publish_post')}</Paragraph>
      </TouchableOpacity>
    </Container>
  );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
  pageTitle: {
    marginTop: 40,
    marginHorizontal: 16,
    marginBottom: 16,
  },

  postCard: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 20,
    elevation: 2,
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: colors.textLight,
    fontWeight: '700',
    fontSize: 18,
  },

  input: {
    minHeight: 100,
    fontSize: 18,
    textAlignVertical: 'top',
    color: colors.text,
  },

  mediaCard: {
    // marginTop: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },

  mediaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  mediaText: {
    color: colors.info,
    fontWeight: '600',
    marginLeft: 8,
  },

  publishButton: {
    marginHorizontal: 16,
    marginTop: 20,
    color: colors.info,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledButton: {
    backgroundColor: colors.disabled,
  },

  publishText: {
    color: colors.textLight,
    fontWeight: '700',
  },
  card: {
    padding: 20,
  },
});
