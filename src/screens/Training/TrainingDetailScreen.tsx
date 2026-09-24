import React, { useMemo } from 'react';

import {
  Image,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import Logo from '../../assets/images/Logo.png';
import { Container, Card, Headline, Paragraph } from '@components/ui';

import AppIcon from '@components/AppIcon/AppIcon';

import useThemeMode from '@hook/useThemeMode';

import CustomHeader from '@components/Header/CustomHeader';

import { useTranslation } from 'react-i18next';

const TrainingDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { theme } = useThemeMode();

  const { t } = useTranslation();

  const { training } = route.params ?? {};

  // ==========================================
  // OPEN FILE
  // ==========================================

  const openFile = async (filePath: string) => {
    if (!filePath) {
      return;
    }

    try {
      await Linking.openURL(filePath);
    } catch (error) {
      console.log('Unable to open URL:', error);
    }
  };

  // ==========================================
  // OPEN YOUTUBE
  // ==========================================

  const openYoutube = async (url: string) => {
    if (!url) {
      return;
    }

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log('Unable to open YouTube:', error);
    }
  };

  // ==========================================
  // DECODE HTML ENTITIES
  // ==========================================

  const decodeHtmlEntities = (text: string) => {
    if (!text) {
      return '';
    }

    return text
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&#x27;/gi, "'");
  };

  // ==========================================
  // DESCRIPTION SECTIONS
  // ==========================================

  const descriptionSections = useMemo(() => {
    const html = training?.description ?? '';

    if (!html) {
      return [];
    }

    // ========================================
    // REMOVE YOUTUBE / MEDIA BLOCK
    // ========================================

    // YouTube is handled separately below.
    const withoutMedia = html.replace(/<figure[\s\S]*?<\/figure>/gi, '');

    // ========================================
    // SECTION TYPE
    // ========================================

    const sections: Array<{
      type: 'heading' | 'paragraph' | 'list';
      text: string;
      ordered?: boolean;
      listNumber?: number;
    }> = [];

    // ========================================
    // READ ADMIN HTML IN ORIGINAL ORDER
    // ========================================

    const blockRegex = /<(h[1-6]|p|ul|ol)(?:\s[^>]*)?>[\s\S]*?<\/\1>/gi;

    let match: RegExpExecArray | null;

    let orderedListNumber = 0;

    while ((match = blockRegex.exec(withoutMedia)) !== null) {
      const tag = match[1].toLowerCase();

      const block = match[0];

      // ========================================
      // HEADING TAG
      //
      // Example:
      // <h2>মাটি ও জলবায়ু</h2>
      // ========================================

      if (/^h[1-6]$/i.test(tag)) {
        const headingText = decodeHtmlEntities(
          block
            .replace(/^<h[1-6][^>]*>/i, '')
            .replace(/<\/h[1-6]>$/i, '')
            .replace(/<br\s*\/?>/gi, ' ')
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim(),
        );

        if (headingText) {
          sections.push({
            type: 'heading',
            text: headingText,
          });
        }

        continue;
      }

      // ========================================
      // PARAGRAPH
      //
      // Example:
      // <p>এই হলো paragraph...</p>
      //
      // Heading:
      // <p><strong>মাটি ও জলবায়ু</strong></p>
      // ========================================

      if (tag === 'p') {
        const content = block
          .replace(/^<p[^>]*>/i, '')
          .replace(/<\/p>$/i, '')
          .trim();

        if (!content) {
          continue;
        }

        // ======================================
        // BOLD-ONLY PARAGRAPH = HEADING
        // ======================================

        const headingMatch = content.match(
          /^<strong[^>]*>([\s\S]*?)<\/strong>$/i,
        );

        if (headingMatch) {
          const headingText = decodeHtmlEntities(
            headingMatch[1]
              .replace(/<br\s*\/?>/gi, ' ')
              .replace(/<[^>]*>/g, '')
              .replace(/\s+/g, ' ')
              .trim(),
          );

          if (headingText) {
            sections.push({
              type: 'heading',
              text: headingText,
            });
          }

          continue;
        }

        // ======================================
        // NORMAL PARAGRAPH
        // ======================================

        const paragraphText = decodeHtmlEntities(
          content
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]*>/g, '')
            .replace(/\n\s*\n/g, '\n')
            .trim(),
        );

        if (paragraphText) {
          sections.push({
            type: 'paragraph',
            text: paragraphText,
          });
        }

        continue;
      }

      // ========================================
      // BULLET / NUMBERED LIST
      // ========================================

      if (tag === 'ul' || tag === 'ol') {
        const ordered = tag === 'ol';

        const listItems = block.match(/<li[\s\S]*?<\/li>/gi) ?? [];

        listItems.forEach((item: string) => {
          const itemText = decodeHtmlEntities(
            item
              .replace(/^<li[^>]*>/i, '')
              .replace(/<\/li>$/i, '')
              .replace(/<br\s*\/?>/gi, ' ')
              .replace(/<[^>]*>/g, '')
              .replace(/\s+/g, ' ')
              .trim(),
          );

          if (!itemText) {
            return;
          }

          if (ordered) {
            orderedListNumber += 1;
          }

          sections.push({
            type: 'list',
            text: itemText,
            ordered,
            listNumber: ordered ? orderedListNumber : undefined,
          });
        });

        continue;
      }
    }

    // ========================================
    // FALLBACK
    //
    // For older/plain description content
    // ========================================

    if (sections.length === 0) {
      const fallbackText = decodeHtmlEntities(
        withoutMedia
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<\/p>/gi, '\n')
          .replace(/<[^>]*>/g, '')
          .replace(/\n\s*\n/g, '\n')
          .trim(),
      );

      if (fallbackText) {
        sections.push({
          type: 'paragraph',
          text: fallbackText,
        });
      }
    }

    return sections;
  }, [training?.description]);

  // ==========================================
  // GET YOUTUBE URL FROM DESCRIPTION
  // ==========================================

  const getYoutubeUrl = (description: string) => {
    if (!description) {
      return null;
    }

    const match = description.match(
      /https?:\/\/(?:www\.)?youtu\.be\/[^\s"<]+|https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[^\s"<]+|https?:\/\/(?:www\.)?youtube\.com\/embed\/[^\s"<]+/i,
    );

    return match ? match[0] : null;
  };

  const youtubeUrl = getYoutubeUrl(training?.description);

  // ==========================================
  // SCREEN
  // ==========================================

  return (
    <Container>
      <CustomHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      >
        <Card
          variant="contained"
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          {/* ==========================================
              IMAGE
          ========================================== */}

          {training?.images?.length > 0 ? (
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: training.images[0]?.file_path,
                }}
                style={styles.heroImage}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View style={styles.heroBanner}>
              <Image
                source={Logo}
                style={styles.detailLogo}
                resizeMode="contain"
              />
            </View>
          )}

          {/* ==========================================
              TITLE
          ========================================== */}

          <Headline
            size="md"
            style={[
              styles.title,
              {
                color: theme.colors.text,
              },
            ]}
          >
            {training?.title ?? t('training')}
          </Headline>

          <View
            style={[
              styles.divider,
              {
                backgroundColor: theme.colors.border,
              },
            ]}
          />

          {/* ==========================================
              DESCRIPTION
          ========================================== */}

          {descriptionSections.length > 0 ? (
            <View>
              {descriptionSections.map((section, index) => {
                const sectionKey = `${
                  section.type
                }-${index}-${section.text.slice(0, 30)}`;

                if (section.type === 'heading') {
                  return (
                    <View key={sectionKey}>
                      <Headline
                        size="sm"
                        style={{
                          color: theme.colors.text,
                          textAlign: 'left',
                          marginTop: index === 0 ? 0 : 16,
                          // marginBottom: 5,
                          lineHeight: 25,
                        }}
                      >
                        {section.text}
                      </Headline>
                    </View>
                  );
                }

                if (section.type === 'list') {
                  return (
                    <View key={sectionKey} style={styles.listRow}>
                      <Paragraph
                        size="sm"
                        style={{
                          color: theme.colors.text,
                          lineHeight: 26,
                          marginRight: 7,
                          fontWeight: '700',
                        }}
                      >
                        {section.ordered ? `${section.listNumber}.` : '•'}
                      </Paragraph>

                      <Paragraph
                        size="sm"
                        style={[
                          styles.description,
                          {
                            color: theme.colors.subText,
                            flex: 1,
                          },
                        ]}
                      >
                        {section.text}
                      </Paragraph>
                    </View>
                  );
                }

                return (
                  <View key={sectionKey}>
                    <Paragraph
                      style={[
                        styles.description,
                        {
                          color: theme.colors.subText,
                          marginBottom: 10,
                        },
                      ]}
                    >
                      {section.text}
                    </Paragraph>
                  </View>
                );
              })}
            </View>
          ) : null}

          {/* ==========================================
              YOUTUBE
          ========================================== */}

          {youtubeUrl && (
            <>
              <View
                style={[
                  styles.divider,
                  {
                    backgroundColor: theme.colors.border,

                    marginTop: 22,
                  },
                ]}
              />

              <Headline
                size="sm"
                style={{
                  color: theme.colors.text,
                  marginBottom: 12,
                }}
              >
                {t('training_video')}
              </Headline>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => openYoutube(youtubeUrl)}
                style={[
                  styles.fileCard,
                  {
                    backgroundColor: theme.colors.background,
                  },
                ]}
              >
                <View style={styles.fileIcon}>
                  <AppIcon
                    type="MaterialCommunityIcons"
                    name="youtube"
                    size={30}
                    color={theme.colors.primary}
                  />
                </View>

                <View style={styles.fileContent}>
                  <Headline
                    size="xs"
                    style={{
                      color: theme.colors.text,
                      textAlign: 'left',
                    }}
                  >
                    {t('youtube_video')}
                  </Headline>

                  <Paragraph
                    style={{
                      color: theme.colors.subText,
                      textAlign: 'left',
                    }}
                  >
                    {t('tap_to_watch_video')}
                  </Paragraph>
                </View>

                <AppIcon
                  type="MaterialCommunityIcons"
                  name="chevron-right"
                  size={22}
                  color={theme.colors.subText}
                />
              </TouchableOpacity>
            </>
          )}

          {/* ==========================================
              DOCUMENTS
          ========================================== */}

          {training?.documents?.length > 0 && (
            <>
              <View
                style={[
                  styles.divider,
                  {
                    backgroundColor: theme.colors.border,

                    marginTop: 22,
                  },
                ]}
              />

              <Headline
                size="sm"
                style={{
                  color: theme.colors.text,
                  marginBottom: 15,
                }}
              >
                {t('attached_files')}
              </Headline>

              {training.documents.map((file: any, index: number) => (
                <TouchableOpacity
                  key={`${file?.id ?? index}`}
                  activeOpacity={0.85}
                  onPress={() => openFile(file?.file_path)}
                  style={[
                    styles.fileCard,
                    {
                      backgroundColor: theme.colors.background,
                    },
                  ]}
                >
                  {/* FILE ICON */}

                  <View style={styles.fileIcon}>
                    <AppIcon
                      type="MaterialCommunityIcons"
                      name={
                        file?.mime_type?.includes('pdf')
                          ? 'file-pdf-box'
                          : file?.mime_type?.includes('image')
                          ? 'image-outline'
                          : 'file-outline'
                      }
                      size={30}
                      color={theme.colors.primary}
                    />
                  </View>

                  {/* FILE NAME */}

                  <View style={styles.fileContent}>
                    <Headline
                      size="xs"
                      numberOfLines={1}
                      style={{
                        color: theme.colors.text,

                        textAlign: 'left',
                      }}
                    >
                      {file?.file_name ?? t('document')}
                    </Headline>

                    <Paragraph
                      size="xs"
                      style={{
                        color: theme.colors.subText,

                        textAlign: 'left',
                      }}
                    >
                      {file?.mime_type?.includes('pdf')
                        ? t('pdf_document')
                        : t('tap_to_view_file')}
                    </Paragraph>
                  </View>

                  <AppIcon
                    type="MaterialCommunityIcons"
                    name="chevron-right"
                    size={22}
                    color={theme.colors.subText}
                  />
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* ==========================================
              IMAGES
          ========================================== */}

          {training?.images?.length > 1 && (
            <>
              <View
                style={[
                  styles.divider,
                  {
                    backgroundColor: theme.colors.border,

                    marginTop: 22,
                  },
                ]}
              />

              <Headline
                size="sm"
                style={{
                  color: theme.colors.text,
                  marginBottom: 15,
                }}
              >
                {t('images')}
              </Headline>

              {training.images.slice(1).map((image: any) => (
                <TouchableOpacity
                  key={image?.id}
                  activeOpacity={0.9}
                  onPress={() => openFile(image?.file_path)}
                  style={styles.additionalImageContainer}
                >
                  <Image
                    source={{
                      uri: image?.file_path,
                    }}
                    style={styles.additionalImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </>
          )}
        </Card>
      </ScrollView>
    </Container>
  );
};

export default TrainingDetailScreen;

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 22,
  },

  imageContainer: {
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 20,
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  heroBanner: {
    height: 180,
    borderRadius: 18,
    backgroundColor: '#EDF8ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    textAlign: 'left',
    marginBottom: 15,
    lineHeight: 34,
  },

  divider: {
    height: 1,
    marginBottom: 18,
  },

  description: {
    textAlign: 'left',
    lineHeight: 25,
    fontSize: 15,
  },

  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
  },

  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },

  fileContent: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  fileIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#EDF8ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  additionalImageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },

  additionalImage: {
    width: '100%',
    height: '100%',
  },
  detailLogo: {
    width: 110,
    height: 110,
  },
});
