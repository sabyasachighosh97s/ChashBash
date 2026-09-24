import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { problemHistoryCommentsGet } from '../api/client';
import { API_ROUTES } from '../api/routes';
import { Container, Paragraph } from '@components/ui';
import CustomHeader from '@components/Header/CustomHeader';
import AppIcon from '@components/AppIcon/AppIcon';
import { PROBLEM_HISTORY_BASE_URL } from '../config/env';
import useThemeMode from '@hook/useThemeMode';
import { useTranslation } from 'react-i18next';
import colors from '@themes/colors';

// interface ProblemHistoryItem {
//   id: number;
//   treatment_mapping_id: number;
//   user_id: string;
//   user_ph: string;
//   image: string;
//   crop: string;
//   label: string;
//   class_id: number;
//   confidence: number;
//   sms_en: string;
//   created_at: string;
// }/

interface ProblemHistoryItem {
  id: number;
  user_id: string;
  user_ph: string;
  image: string;
  crop: string;
  label: {
    class_id: number;
    name_en: string;
    name_bn: string;
    primary_category_en: string;
    primary_category_bn: string;
  };
  class_id: number;
  confidence: number;
  primary_treatment: {
    id: number;
    crop_en: string;
    crop_bn: string;
    chemical: string;
    chemical_type: string;
    dosage: string;
    sms_en: string | null;
    sms_bn: string | null;
    sms_stage2_bn: string | null;
  };
  created_at: string;
}

interface CommentItem {
  id: number;
  treatment_mapping_id: number;
  kvp_id: string;
  kvp_name: string;
  comment: string;
  created_date: string;
}

interface Props {
  navigation: any;

  route: {
    params?: {
      historyData?: ProblemHistoryItem;
    };
  };
}

const HistoryResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useThemeMode();
  const { t } = useTranslation();

  const historyData = route?.params?.historyData;

  /* COMMENTS STATE */

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [commentsError, setCommentsError] = useState<boolean>(false);

  useEffect(() => {
    const getComments = async () => {
      if (!historyData?.id) {
        return;
      }

      try {
        setCommentsLoading(true);
        setCommentsError(false);

        const response = await problemHistoryCommentsGet(
          API_ROUTES.GET.PROBLEM_HISTORY_COMMENTS(
            historyData.primary_treatment.id,
          ),
          {
            headers: {
              Accept: 'application/json',
            },
          },
        );

        if (Array.isArray(response.data)) {
          setComments(response.data);
        } else {
          setComments([]);
        }
      } catch (error: any) {
        console.log(
          'Comments API Error:',
          error?.response?.data || error?.message || error,
        );

        // console.log(' Error:', error);

        setComments([]);
        setCommentsError(true);
      } finally {
        setCommentsLoading(false);
      }
    };
    getComments();
  }, [historyData?.id]);

  if (!historyData) {
    return (
      <Container>
        <CustomHeader />
        <View
          style={[
            styles.emptyContainer,
            {
              backgroundColor: theme.colors.background,
            },
          ]}
        >
          <Paragraph
            style={[
              styles.emptyText,
              {
                color: theme.colors.text,
              },
            ]}
          >
            {t('no_history_information_found')}
          </Paragraph>

          <TouchableOpacity
            style={[
              styles.backButton,
              {
                backgroundColor: theme.colors.primary,
              },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Paragraph style={styles.backButtonText}>{t('go_back')}</Paragraph>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }

  /* ==========================================
      IMAGE URL
  ========================================== */

  const imageUrl = historyData.image?.startsWith('http')
    ? historyData.image
    : `${PROBLEM_HISTORY_BASE_URL}${historyData.image}`;

  /* ==========================================
      FORMAT DATE
  ========================================== */

  const formatDate = (dateString?: string) => {
    if (!dateString) {
      return '';
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Container>
      <CustomHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ==================================
      DISEASE IMAGE
  ================================== */}

        <View
          style={[
            styles.imageCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.diseaseImage}
            resizeMode="cover"
            onError={error => {
              console.log('History Image Error:', error.nativeEvent);
            }}
          />

          <View style={styles.imageOverlay}>
            <View style={styles.imageBadge}>
              <AppIcon
                type="MaterialCommunityIcons"
                name="leaf"
                size={16}
                color="#FFFFFF"
              />

              <Text style={styles.imageBadgeText}>{t('disease_result')}</Text>
            </View>
          </View>
        </View>

        {/* ==================================
    RESULT SUMMARY
================================== */}

        <View
          style={[
            styles.resultCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {/* Crop */}
          <View style={styles.summaryItem}>
            <View
              style={[
                styles.summaryIcon,
                {
                  backgroundColor: theme.colors.primary + '15',
                },
              ]}
            >
              <AppIcon
                type="MaterialCommunityIcons"
                name="sprout"
                size={18}
                color={theme.colors.primary}
              />
            </View>

            <Text style={[styles.infoLabel, { color: theme.colors.subText }]}>
              {t('crop')}
            </Text>

            <Text
              style={[styles.infoValue, { color: theme.colors.text }]}
              numberOfLines={1}
            >
              {historyData.primary_treatment.crop_bn || '--'}
            </Text>
          </View>

          {/* Problem */}
          <View
            style={[
              styles.summaryItem,
              styles.summaryItemBorder,
              {
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.summaryIcon,
                {
                  backgroundColor: '#EF4444' + '15',
                },
              ]}
            >
              <AppIcon
                type="MaterialCommunityIcons"
                name="bug-outline"
                size={18}
                color="#EF4444"
              />
            </View>

            <Text style={[styles.infoLabel, { color: theme.colors.subText }]}>
              {t('problem')}
            </Text>

            <Text
              style={[styles.problemValue, { color: theme.colors.primary }]}
              numberOfLines={1}
            >
              {historyData.label.name_bn || '--'}
            </Text>
          </View>

          {/* Date */}
          <View style={styles.summaryItem}>
            <View
              style={[
                styles.summaryIcon,
                {
                  backgroundColor: '#64748B' + '15',
                },
              ]}
            >
              <AppIcon
                type="MaterialCommunityIcons"
                name="calendar-month-outline"
                size={18}
                color="#64748B"
              />
            </View>

            <Text style={[styles.infoLabel, { color: theme.colors.subText }]}>
              {t('date')}
            </Text>

            <Text
              style={[styles.infoValue, { color: theme.colors.text }]}
              numberOfLines={1}
            >
              {formatDate(historyData.created_at) || '--'}
            </Text>
          </View>
        </View>
        {/* ==================================
      RECOMMENDATION
  ================================== */}

        <View
          style={[
            styles.messageCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.messageHeader}>
            <View
              style={[
                styles.messageIcon,
                {
                  backgroundColor: theme.colors.primary + '15',
                },
              ]}
            >
              <AppIcon
                type="MaterialCommunityIcons"
                name="lightbulb-on-outline"
                size={23}
                color={theme.colors.primary}
              />
            </View>

            <View
              style={{
                flex: 1,
                alignItems: 'flex-start',
              }}
            >
              <Paragraph
                style={[styles.messageTitle, { color: theme.colors.text }]}
              >
                {t('recommendation')}
              </Paragraph>

              <Text
                style={[
                  styles.messageSubtitle,
                  { color: theme.colors.subText },
                ]}
              >
                {t('recommended_action')}
              </Text>
            </View>
          </View>

          <View>
            {/* Stage 1 */}
            {historyData.primary_treatment.sms_bn ? (
              <View style={{ marginBottom: 14 }}>
                <Text style={[styles.stageTitle, { color: theme.colors.text }]}>
                  পর্যায় ১
                </Text>

                <Text
                  style={[styles.messageText, { color: theme.colors.text }]}
                >
                  {historyData.primary_treatment.sms_bn}
                </Text>
              </View>
            ) : null}

            {/* Stage 2 */}
            {historyData.primary_treatment.sms_stage2_bn ? (
              <View>
                <Text style={[styles.stageTitle, { color: theme.colors.text }]}>
                  পর্যায় ২
                </Text>

                <Text
                  style={[styles.messageText, { color: theme.colors.text }]}
                >
                  {historyData.primary_treatment.sms_stage2_bn}
                </Text>
              </View>
            ) : null}

            {/* No recommendation */}
            {!historyData.primary_treatment.sms_bn &&
            !historyData.primary_treatment.sms_stage2_bn ? (
              <Text style={[styles.messageText, { color: theme.colors.text }]}>
                {t('no_recommendation_available')}
              </Text>
            ) : null}
          </View>

          {/* ==================================
        COMMENTS LOADING
    ================================== */}

          {commentsLoading && (
            <View style={styles.commentLoading}>
              <ActivityIndicator size="small" color={theme.colors.primary} />

              <Text
                style={[styles.loadingText, { color: theme.colors.subText }]}
              >
                {t('loading_expert_advice')}
              </Text>
            </View>
          )}

          {/* ==================================
        EXPERT ADVICE
    ================================== */}

          {!commentsLoading && comments.length > 0 && (
            <View style={styles.commentsContainer}>
              <View style={styles.expertHeader}>
                <View
                  style={[
                    styles.expertIcon,
                    {
                      backgroundColor: theme.colors.primary + '15',
                    },
                  ]}
                >
                  <AppIcon
                    type="MaterialCommunityIcons"
                    name="account-tie-outline"
                    size={21}
                    color={theme.colors.primary}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.commentHeading,
                      { color: theme.colors.text },
                    ]}
                  >
                    {t('expert_advice')}
                  </Text>

                  <Text
                    style={[
                      styles.expertSubtitle,
                      { color: theme.colors.subText },
                    ]}
                  >
                    {t('expert_recommendations')}
                  </Text>
                </View>
              </View>

              {comments.map((item, index) => (
                <View
                  key={item?.id ? item.id.toString() : index.toString()}
                  style={[
                    styles.commentItem,
                    {
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  {/* KVP Header */}
                  <View style={styles.commentHeaderRow}>
                    <View style={styles.kvpProfileRow}>
                      <View
                        style={[
                          styles.kvpAvatar,
                          {
                            backgroundColor: theme.colors.primary + '15',
                          },
                        ]}
                      >
                        <AppIcon
                          type="MaterialCommunityIcons"
                          name="account-tie-outline"
                          size={19}
                          color={theme.colors.primary}
                        />
                      </View>

                      <View style={styles.kvpInfo}>
                        <View style={styles.kvpNameRow}>
                          <Text
                            style={[
                              styles.kvpName,
                              { color: theme.colors.text },
                            ]}
                          >
                            {item.kvp_name}
                          </Text>

                          <View style={styles.verifiedBadge}>
                            <AppIcon
                              type="MaterialCommunityIcons"
                              name="check-decagram"
                              size={14}
                              color={colors.success}
                            />
                          </View>
                        </View>

                        <View style={styles.commentDateRow}>
                          <AppIcon
                            type="MaterialCommunityIcons"
                            name="calendar-month-outline"
                            size={13}
                            color={theme.colors.subText}
                          />

                          <Text
                            style={[
                              styles.commentDate,
                              { color: theme.colors.subText },
                            ]}
                          >
                            {formatDate(item.created_date)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Comment */}
                  <View style={styles.commentBody}>
                    <Text
                      style={[styles.commentText, { color: theme.colors.text }]}
                    >
                      {item.comment}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ==================================
        NO COMMENTS
    ================================== */}

          {!commentsLoading && !commentsError && comments.length === 0 && (
            <View style={styles.noCommentsContainer}>
              <AppIcon
                type="MaterialCommunityIcons"
                name="comment-off-outline"
                size={28}
                color={theme.colors.subText}
              />

              <Text
                style={[styles.noCommentsText, { color: theme.colors.subText }]}
              >
                {t('no_additional_advice')}
              </Text>
            </View>
          )}

          {/* ==================================
        COMMENT API ERROR
    ================================== */}

          {!commentsLoading && commentsError && (
            <View style={styles.noCommentsContainer}>
              <AppIcon
                type="MaterialCommunityIcons"
                name="alert-circle-outline"
                size={28}
                color="#DC2626"
              />

              <Text
                style={[styles.noCommentsText, { color: theme.colors.subText }]}
              >
                {t('expert_advice_load_failed')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Container>
  );
};

export default HistoryResultScreen;

/* ==========================================
   STYLES
========================================== */

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 40,
  },

  /* ========================================
     IMAGE
  ======================================== */

  imageCard: {
    width: '100%',
    height: 280,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  diseaseImage: {
    width: '100%',
    height: '100%',
  },

  imageOverlay: {
    position: 'absolute',
    left: 12,
    bottom: 12,
  },

  imageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.62)',
  },

  imageBadgeText: {
    marginLeft: 5,
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  /* ========================================
     RESULT
  ======================================== */

  resultCard: {
    marginTop: 14,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'stretch',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  infoRow: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  /* ========================================
     CONFIDENCE
  ======================================== */

  confidenceCard: {
    marginTop: 16,
    minHeight: 88,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  confidenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  confidenceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  confidenceTitle: {
    fontSize: 12,
    fontWeight: '500',
  },

  confidenceValue: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: '800',
  },

  confidenceCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  confidenceCircleText: {
    fontSize: 13,
    fontWeight: '800',
  },

  /* ========================================
     RECOMMENDATION
  ======================================== */
  messageCard: {
    marginTop: 14,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },

  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },

  messageIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },

  messageTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  messageSubtitle: {
    marginTop: 1,
    fontSize: 11,
    fontWeight: '500',
  },

  recommendationBox: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },

  messageText: {
    fontSize: 14,
    lineHeight: 23,
    fontWeight: '400',
  },

  /* ========================================
     EXPERT ADVICE
  ======================================== */

  commentsContainer: {
    marginTop: 17,
    paddingTop: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },

  expertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  expertIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },

  commentHeading: {
    fontSize: 15,
    fontWeight: '700',
  },

  expertSubtitle: {
    marginTop: 1,
    fontSize: 10,
  },

  commentItem: {
    marginTop: 8,
    paddingHorizontal: 11,
    paddingVertical: 11,
    borderRadius: 13,
    borderWidth: 1,
  },
  commentTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  commentNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },

  commentNumberText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  commentText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '400',
  },

  /* ========================================
     LOADING
  ======================================== */

  commentLoading: {
    marginTop: 20,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginLeft: 8,
    fontSize: 13,
  },

  /* ========================================
     EMPTY / ERROR
  ======================================== */

  noCommentsContainer: {
    marginTop: 18,
    paddingTop: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },

  noCommentsText: {
    marginTop: 8,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },

  /* ========================================
     EMPTY HISTORY
  ======================================== */

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },

  backButton: {
    marginTop: 20,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },

  backButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    minWidth: 0,
  },

  summaryItemBorder: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
  },

  summaryIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },

  infoLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 2,
    textAlign: 'center',
  },

  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    maxWidth: '100%',
  },

  problemValue: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    maxWidth: '100%',
  },

  commentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  kvpProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  kvpAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  kvpInfo: {
    flex: 1,
  },

  kvpNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  kvpName: {
    fontSize: 14,
    fontWeight: '700',
  },

  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 7,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
  },

  verifiedText: {
    marginLeft: 3,
    fontSize: 10,
    fontWeight: '600',
    color: '#2563EB',
  },

  commentBody: {
    marginTop: 10,
    paddingLeft: 50,
  },

  commentDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  commentDate: {
    marginLeft: 4,
    fontSize: 10,
    fontWeight: '500',
  },

  stageTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
});
