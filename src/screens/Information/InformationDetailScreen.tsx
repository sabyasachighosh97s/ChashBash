import React, { useMemo } from 'react';
import {
  Image,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Card, Container, Headline, Paragraph } from '@components/ui';
import { BASE_URL } from '../../config/env';
import AppIcon from '@components/AppIcon/AppIcon';
import useThemeMode from '@hook/useThemeMode';
import CustomHeader from '@components/Header/CustomHeader';
import { useTranslation } from 'react-i18next';
import Logo from '../../assets/images/Logo.png';

const InformationDetailScreen = () => {
  const route = useRoute<any>();
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const { information } = route.params ?? {};

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
    const html = information?.description ?? '';

    if (!html) {
      return [];
    }

    // Remove YouTube/media blocks from description.
    // YouTube is still handled separately below.
    const withoutMedia = html.replace(/<figure[\s\S]*?<\/figure>/gi, '');

    const sections: Array<{
      type: 'heading' | 'paragraph' | 'list';
      text: string;
      ordered?: boolean;
      listNumber?: number;
    }> = [];

    // Preserve the exact order entered by Admin.
    const blockRegex = /<(h[1-6]|p|ul|ol)(?:\s[^>]*)?>[\s\S]*?<\/\1>/gi;

    let match: RegExpExecArray | null;
    let orderedListNumber = 0;

    while ((match = blockRegex.exec(withoutMedia)) !== null) {
      const tag = match[1].toLowerCase();
      const block = match[0];

      // ========================================
      // HEADINGS: <h1> ... <h6>
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
      // PARAGRAPHS: <p> ... </p>
      //
      // <p><strong>Heading</strong></p>
      // is treated as a heading.
      // ========================================

      if (tag === 'p') {
        const content = block
          .replace(/^<p[^>]*>/i, '')
          .replace(/<\/p>$/i, '')
          .trim();

        if (!content) {
          continue;
        }

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
      }
    }

    // ========================================
    // FALLBACK FOR PLAIN/OLDER CONTENT
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
  }, [information?.description]);

  const getFullFileUrl = (filePath: string) => {
    if (!filePath) {
      return '';
    }

    const path = filePath.trim();

    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    if (path.startsWith('/')) {
      return `${BASE_URL}${path}`;
    }
    return `${BASE_URL}/${path}`;
  };

  // ==========================================
  // OPEN FILE
  // ==========================================

  const openFile = async (filePath: string) => {
    const url = getFullFileUrl(filePath);

    if (!url) {
      Alert.alert(t('file_not_found'), t('file_url_not_found'));

      return;
    }

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log('Unable to open file:', error);

      Alert.alert(t('file_open_failed'), t('no_supported_app'));
    }
  };

  // ==========================================
  // GET YOUTUBE URL
  // ==========================================

  const getYoutubeUrl = (text: string) => {
    if (!text) {
      return null;
    }

    const match = text.match(
      /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)[^\s"'<>]+/i,
    );

    return match ? match[0] : null;
  };

  // ==========================================
  // DESCRIPTION
  // ==========================================

  // ==========================================
  // YOUTUBE FROM DESCRIPTION
  // ==========================================

  let youtubeUrl = getYoutubeUrl(information?.description ?? '');

  // ==========================================
  // YOUTUBE FROM DOCUMENTS
  // ==========================================

  if (!youtubeUrl && information?.documents?.length) {
    const youtubeFile = information.documents.find((file: any) => {
      const filePath = file?.file_path ?? '';

      const mimeType = file?.mime_type ?? '';

      const fileName = file?.file_name ?? '';

      return (
        filePath.includes('youtube.com') ||
        filePath.includes('youtu.be') ||
        mimeType.includes('youtube') ||
        fileName.toLowerCase().includes('youtube')
      );
    });

    if (youtubeFile?.file_path) {
      youtubeUrl = getFullFileUrl(youtubeFile.file_path);
    }
  }

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

          {information?.images?.length > 0 ? (
            <View
              style={[
                styles.imageContainer,
                {
                  backgroundColor: '#EDF8ED',
                },
              ]}
            >
              <Image
                source={{
                  uri: getFullFileUrl(information.images[0]?.file_path),
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
            {information?.title ?? t('information')}
          </Headline>

          {/* ==========================================
              DIVIDER
          ========================================== */}

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
                const sectionKey = `description-${section.type}-${index}`;

                // ======================================
                // HEADING
                // ======================================

                if (section.type === 'heading') {
                  return (
                    <View key={sectionKey}>
                      <Headline
                        size="sm"
                        style={{
                          color: theme.colors.text,
                          textAlign: 'left',
                          fontWeight: '700',
                          fontSize: 18,
                          lineHeight: 27,
                          marginTop: index === 0 ? 0 : 16,
                          marginBottom: 8,
                        }}
                      >
                        {section.text}
                      </Headline>
                    </View>
                  );
                }

                // ======================================
                // BULLET / NUMBERED LIST
                // ======================================

                if (section.type === 'list') {
                  return (
                    <View key={sectionKey} style={styles.listRow}>
                      <Paragraph
                        size="sm"
                        style={{
                          color: theme.colors.text,
                          lineHeight: 26,
                          marginRight: 8,
                          fontWeight: '700',
                          textAlign: 'left',
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
                            marginBottom: 5,
                          },
                        ]}
                      >
                        {section.text}
                      </Paragraph>
                    </View>
                  );
                }

                // ======================================
                // NORMAL PARAGRAPH
                // ======================================

                return (
                  <View key={sectionKey}>
                    <Paragraph
                      style={[
                        styles.description,
                        {
                          color: theme.colors.subText,
                          textAlign: 'left',
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
              YOUTUBE VIDEO
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
                {t('information_video')}
              </Headline>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => openFile(youtubeUrl)}
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
                    size="xs"
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

          {information?.documents?.length > 0 && (
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

              {information.documents.map((file: any, index: number) => {
                const fileUrl = getFullFileUrl(file?.file_path);

                const mimeType = file?.mime_type?.toLowerCase() ?? '';

                const fileName = file?.file_name ?? t('document');

                const isPdf =
                  mimeType.includes('pdf') ||
                  fileName.toLowerCase().endsWith('.pdf');

                const isImage =
                  mimeType.includes('image') ||
                  /\.(jpg|jpeg|png|webp)$/i.test(fileName);

                return (
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
                          isPdf
                            ? 'file-pdf-box'
                            : isImage
                            ? 'image-outline'
                            : 'file-outline'
                        }
                        size={30}
                        color={theme.colors.primary}
                      />
                    </View>

                    {/* FILE INFORMATION */}

                    <View style={styles.fileContent}>
                      <Headline
                        size="xs"
                        numberOfLines={1}
                        style={{
                          color: theme.colors.text,
                          textAlign: 'left',
                        }}
                      >
                        {fileName}
                      </Headline>

                      <Paragraph
                        size="xs"
                        style={{
                          color: theme.colors.subText,
                          textAlign: 'left',
                        }}
                      >
                        {isPdf
                          ? t('tap_to_view_pdf')
                          : isImage
                          ? t('tap_to_view_image')
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
                );
              })}
            </>
          )}

          {information?.images?.length > 1 && (
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

              {information.images.slice(1).map((image: any, index: number) => (
                <TouchableOpacity
                  key={`${image?.id ?? index}`}
                  activeOpacity={0.9}
                  onPress={() => openFile(image?.file_path)}
                  style={[
                    styles.additionalImageContainer,
                    {
                      backgroundColor: '#EDF8ED',
                    },
                  ]}
                >
                  <Image
                    source={{
                      uri: getFullFileUrl(image?.file_path),
                    }}
                    style={styles.additionalImage}
                    resizeMode="contain"
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

export default InformationDetailScreen;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 22,
  },

  imageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    lineHeight: 28,
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
    justifyContent: 'center',
    alignItems: 'flex-start',
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
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
