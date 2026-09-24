import React, { useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Container, Card, Headline, Paragraph } from '@components/ui';
import CustomHeader from '@components/Header/CustomHeader';
import AppIcon from '@components/AppIcon/AppIcon';
import useThemeMode from '@hook/useThemeMode';
import { useTranslation } from 'react-i18next';
import Logo from '../../assets/images/Logo.png';

const POPDetailScreen = () => {
  const route = useRoute<any>();
  const { theme } = useThemeMode();
  const { t } = useTranslation();
  const { pop } = route.params ?? {};

  // Each table keeps its own horizontal scroll position/ref.
  // This only controls the table navigation UI; no business logic is changed.
  const tableScrollRefs = useRef<Array<ScrollView | null>>([]);
  const tableScrollOffsets = useRef<number[]>([]);

  const cropName = pop?.crop_name?.name ?? pop?.title ?? 'POP';
  const varietyName = pop?.crop_variety?.name;
  const imageUrl = pop?.images?.[0]?.file_path;

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
  // CLEAN HTML TEXT
  // ==========================================

  const cleanHtmlText = (html: string) => {
    if (!html) {
      return '';
    }

    return decodeHtmlEntities(
      html
        // Remove non-table figures/media
        .replace(
          /<figure\b[^>]*>[\s\S]*?<\/figure>/gi,
          (figure) => {
            return /<table\b/i.test(figure) ? figure : '';
          },
        )

        // Convert line breaks
        .replace(/<br\s*\/?>/gi, '\n')

        // Convert paragraph closing tags to line breaks
        .replace(/<\/p>/gi, '\n')

        // Remove list tags but keep their text
        .replace(/<\/li>/gi, '\n')
        .replace(/<li\b[^>]*>/gi, '')

        // Remove remaining HTML tags
        .replace(/<[^>]*>/g, '')

        // Remove extra blank lines
        .replace(/\n\s*\n/g, '\n')

        .trim(),
    );
  };

  // ==========================================
  // DESCRIPTION SECTION TYPE
  // ==========================================

  type DescriptionSection =
    | {
        type: 'heading';
        text: string;
      }
    | {
        type: 'paragraph';
        text: string;
      }
    | {
        type: 'list';
        items: string[];
        ordered: boolean;
      }
    | {
        type: 'table';
        rows: string[][];
        hasHeader: boolean;
      };

  // ==========================================
  // PARSE TABLE
  // ==========================================

  const parseDescriptionTable = (tableHtml: string) => {
    const tableMatch = tableHtml.match(
      /<table\b[^>]*>([\s\S]*?)<\/table>/i,
    );

    if (!tableMatch) {
      return null;
    }

    const tableContent = tableMatch[1];

    const rowMatches = tableContent.match(
      /<tr\b[^>]*>[\s\S]*?<\/tr>/gi,
    );

    if (!rowMatches || rowMatches.length === 0) {
      return null;
    }

    const rows: string[][] = [];

    rowMatches.forEach((rowHtml: string) => {
      const cellMatches = rowHtml.match(
        /<t[dh]\b[^>]*>[\s\S]*?<\/t[dh]>/gi,
      );

      if (!cellMatches || cellMatches.length === 0) {
        return;
      }

      const row = cellMatches.map((cellHtml: string) => {
        const cellContent = cellHtml
          .replace(/^<t[dh][^>]*>/i, '')
          .replace(/<\/t[dh]>$/i, '')
          .trim();

        return decodeHtmlEntities(
          cellContent
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim(),
        );
      });

      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
    });

    if (rows.length === 0) {
      return null;
    }

    // ==========================================
    // DETECT TABLE HEADER
    // ==========================================

    const firstRowHtml = rowMatches[0];

    const firstRowCells =
      firstRowHtml.match(
        /<t[dh]\b[^>]*>[\s\S]*?<\/t[dh]>/gi,
      ) ?? [];

    const hasHeader =
      /<th\b/i.test(firstRowHtml) ||
      (firstRowCells.length > 0 &&
        firstRowCells.every((cell: string) =>
          /<strong\b/i.test(cell),
        ));

    return {
      rows,
      hasHeader,
    };
  };

  // ==========================================
  // PARSE LIST
  //
  // Supports:
  // <ul>
  //   <li>Item 1</li>
  //   <li>Item 2</li>
  // </ul>
  //
  // Also supports:
  // <ol>
  //   <li>Item 1</li>
  //   <li>Item 2</li>
  // </ol>
  // ==========================================

  const parseDescriptionList = (listHtml: string) => {
    const listMatch = listHtml.match(
      /<(ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/i,
    );

    if (!listMatch) {
      return null;
    }

    const listType = listMatch[1].toLowerCase();
    const listContent = listMatch[2];

    const itemMatches = listContent.match(
      /<li\b[^>]*>[\s\S]*?<\/li>/gi,
    );

    if (!itemMatches || itemMatches.length === 0) {
      return null;
    }

    const items: string[] = [];

    itemMatches.forEach((itemHtml: string) => {
      const itemText = decodeHtmlEntities(
        itemHtml
          .replace(/^<li[^>]*>/i, '')
          .replace(/<\/li>$/i, '')
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]*>/g, '')
          .replace(/\n\s*\n/g, '\n')
          .replace(/[ \t]+/g, ' ')
          .trim(),
      );

      if (itemText) {
        items.push(itemText);
      }
    });

    if (items.length === 0) {
      return null;
    }

    return {
      items,
      ordered: listType === 'ol',
    };
  };

  // ==========================================
  // DESCRIPTION SECTIONS
  //
  // IMPORTANT:
  // Original Admin order is preserved.
  //
  // Example:
  //
  // Heading
  // Paragraph
  // Heading
  // Bullet list
  // Heading
  // Bullet list
  // Table
  // Heading
  // Paragraph
  //
  // Nothing is rearranged.
  // ==========================================

  const descriptionSections = useMemo<DescriptionSection[]>(() => {
    const html = pop?.description ?? '';

    if (!html) {
      return [];
    }

    // ==========================================
    // KEEP TABLE FIGURES
    //
    // Remove figures except figures containing
    // tables.
    // ==========================================

    const withoutMedia = html.replace(
      /<figure\b[^>]*>[\s\S]*?<\/figure>/gi,
      (figure: string) => {
        return /<table\b/i.test(figure) ? figure : '';
      },
    );

    // ==========================================
    // EXTRACT BLOCKS IN ORIGINAL ORDER
    //
    // Supported:
    //
    // <p>...</p>
    // <ul>...</ul>
    // <ol>...</ol>
    // <table>...</table>
    // <figure><table>...</table></figure>
    // ==========================================

    const blockMatches = withoutMedia.match(
      /<figure\b[^>]*>\s*<table\b[\s\S]*?<\/table>\s*<\/figure>|<table\b[\s\S]*?<\/table>|<ul\b[^>]*>[\s\S]*?<\/ul>|<ol\b[^>]*>[\s\S]*?<\/ol>|<p\b[^>]*>[\s\S]*?<\/p>/gi,
    );

    // ==========================================
    // FALLBACK
    // ==========================================

    if (!blockMatches) {
      const fallbackText = cleanHtmlText(withoutMedia);

      return fallbackText
        ? [
            {
              type: 'paragraph',
              text: fallbackText,
            },
          ]
        : [];
    }

    const sections: DescriptionSection[] = [];

    // ==========================================
    // PROCESS EVERY BLOCK
    // ==========================================

    blockMatches.forEach((block: string) => {
      // ==========================================
      // TABLE
      // ==========================================

      if (/<table\b/i.test(block)) {
        const table = parseDescriptionTable(block);

        if (table) {
          sections.push({
            type: 'table',
            rows: table.rows,
            hasHeader: table.hasHeader,
          });
        }

        return;
      }

      // ==========================================
      // LIST
      // ==========================================

      if (/<(ul|ol)\b/i.test(block)) {
        const list = parseDescriptionList(block);

        if (list) {
          sections.push({
            type: 'list',
            items: list.items,
            ordered: list.ordered,
          });
        }

        return;
      }

      // ==========================================
      // PARAGRAPH
      // ==========================================

      const content = block
        .replace(/^<p[^>]*>/i, '')
        .replace(/<\/p>$/i, '')
        .trim();

      if (!content) {
        return;
      }

      // ==========================================
      // HEADING
      //
      // Existing supported structure:
      //
      // <p><strong>Heading</strong></p>
      // ==========================================

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

        return;
      }

      // ==========================================
      // NORMAL PARAGRAPH
      // ==========================================

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
    });

    return sections;
  }, [pop?.description]);

  // ==========================================
  // TABLE COLUMN WIDTH
  // ==========================================

  const getTableColumnWidth = (
    columnIndex: number,
    totalColumns: number,
  ) => {
    if (totalColumns >= 3 && columnIndex === totalColumns - 1) {
      return 280;
    }

    if (totalColumns === 2) {
      return 180;
    }

    return 130;
  };

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

  const youtubeUrl = getYoutubeUrl(pop?.description);

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

      Alert.alert(
        t('file_open_failed'),
        t('file_currently_unavailable'),
      );
    }
  };

  // ==========================================
  // ATTACHMENTS
  // ==========================================

  const attachments = useMemo(() => {
    const list: any[] = [];

    // ========================================
    // DOCUMENTS
    // ========================================

    if (Array.isArray(pop?.documents)) {
      pop.documents.forEach((file: any) => {
        list.push({
          ...file,
          attachment_type: 'document',
        });
      });
    }

    // ========================================
    // VIDEOS
    // ========================================

    if (Array.isArray(pop?.videos)) {
      pop.videos.forEach((file: any) => {
        list.push({
          ...file,
          attachment_type: 'video',
        });
      });
    }

    // ========================================
    // GENERIC FILES
    // ========================================

    if (Array.isArray(pop?.files)) {
      pop.files.forEach((file: any) => {
        list.push({
          ...file,
          attachment_type: 'file',
        });
      });
    }

    // ========================================
    // AGRI FILES
    //
    // Keeping compatibility with the
    // previous Training/Information structure
    // ========================================

    if (Array.isArray(pop?.agri_files)) {
      pop.agri_files.forEach((file: any) => {
        list.push({
          ...file,
          attachment_type: 'agri_file',
        });
      });
    }

    return list;
  }, [pop]);

  // ==========================================
  // GET FILE TYPE
  // ==========================================

  const getFileType = (file: any) => {
    const mimeType = file?.mime_type?.toLowerCase() ?? '';
    const fileExt = file?.file_ext?.toLowerCase() ?? '';
    const filePath = file?.file_path?.toLowerCase() ?? '';

    // YouTube
    if (
      fileExt === 'youtube' ||
      fileExt === 'video' ||
      filePath.includes('youtube.com') ||
      filePath.includes('youtu.be')
    ) {
      return 'youtube';
    }

    // PDF
    if (
      mimeType.includes('pdf') ||
      fileExt.includes('pdf') ||
      filePath.endsWith('.pdf')
    ) {
      return 'pdf';
    }

    // Image
    if (
      mimeType.startsWith('image/') ||
      fileExt.includes('jpg') ||
      fileExt.includes('jpeg') ||
      fileExt.includes('png') ||
      fileExt.includes('webp') ||
      fileExt.includes('gif')
    ) {
      return 'image';
    }

    // Video
    if (
      mimeType.startsWith('video/') ||
      fileExt.includes('mp4') ||
      fileExt.includes('mov') ||
      fileExt.includes('avi')
    ) {
      return 'video';
    }

    return 'file';
  };

  // ==========================================
  // FILE TITLE
  // ==========================================

  const getFileTitle = (file: any, type: string) => {
    if (file?.file_name) {
      return file.file_name;
    }

    if (type === 'youtube') {
      return t('youtube_video');
    }

    if (type === 'pdf') {
      return t('pdf_document');
    }

    if (type === 'image') {
      return t('image');
    }

    if (type === 'video') {
      return t('video');
    }

    return t('attached_file');
  };

  // ==========================================
  // FILE SUBTITLE
  // ==========================================

  const getFileSubtitle = (type: string) => {
    switch (type) {
      case 'youtube':
        return t('tap_to_watch_youtube');

      case 'pdf':
        return t('tap_to_view_pdf');

      case 'image':
        return t('tap_to_view_image');

      case 'video':
        return t('tap_to_watch_video');

      default:
        return t('tap_to_view_file');
    }
  };

  // ==========================================
  // FILE ICON
  // ==========================================

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return 'youtube';

      case 'pdf':
        return 'file-pdf-box';

      case 'image':
        return 'image-outline';

      case 'video':
        return 'play-circle-outline';

      default:
        return 'file-outline';
    }
  };

  // ==========================================
  // OPEN ATTACHMENT
  // ==========================================

  const openAttachment = async (file: any) => {
    const filePath = file?.file_path;

    if (!filePath) {
      Alert.alert(
        t('file_not_found'),
        t('file_url_not_found'),
      );

      return;
    }

    try {
      const type = getFileType(file);

      if (type === 'pdf') {
        const viewerUrl = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(
          filePath,
        )}`;

        await Linking.openURL(viewerUrl);

        return;
      }

      await Linking.openURL(filePath);
    } catch (error) {
      console.log('Unable to open attachment:', error);

      Alert.alert(
        t('file_open_failed'),
        t('file_currently_unavailable'),
      );
    }
  };

  // ==========================================
  // SCREEN
  // ==========================================

  return (
    <Container>
      <CustomHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ==========================================
            HERO
        ========================================== */}

        <Card
          variant="contained"
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          <View style={styles.imageCircle}>
            {imageUrl ? (
              <Image
                source={{
                  uri: imageUrl,
                }}
                style={styles.heroImage}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={Logo}
                style={styles.detailLogo}
                resizeMode="contain"
              />
            )}
          </View>

          {/* CROP NAME */}

          <Headline
            size="lg"
            style={{
              marginTop: 12,
              textAlign: 'center',
              color: theme.colors.text,
            }}
          >
            {cropName}
          </Headline>

          {/* VARIETY */}

          {varietyName ? (
            <Paragraph
              size="sm"
              style={{
                textAlign: 'center',
                color: theme.colors.subText,
              }}
            >
              {varietyName}
            </Paragraph>
          ) : null}
        </Card>

        {/* ==========================================
            DESCRIPTION
        ========================================== */}

        {descriptionSections.length > 0 ? (
          <Card
            variant="contained"
            style={[
              styles.sectionCard,
              {
                backgroundColor: theme.colors.surface,
              },
            ]}
          >
            <Headline
              size="sm"
              style={{
                color: theme.colors.text,
                textAlign: 'left',
                marginBottom: 14,
              }}
            >
              {t('details')}
            </Headline>

            {descriptionSections.map((section, index) => {
              // ==========================================
              // HEADING
              // ==========================================

              if (section.type === 'heading') {
                return (
                  <Headline
                    key={`description-heading-${index}`}
                    size="xs"
                    style={{
                      color: theme.colors.text,
                      textAlign: 'left',
                      marginTop: index === 0 ? 0 : 14,
                      lineHeight: 18,
                    }}
                  >
                    {section.text}
                  </Headline>
                );
              }

              // ==========================================
              // BULLET / NUMBERED LIST
              // ==========================================

              if (section.type === 'list') {
                return (
                  <View
                    key={`description-list-${index}`}
                    style={styles.listContainer}
                  >
                    {section.items.map(
                      (item: string, itemIndex: number) => (
                        <View
                          key={`description-list-item-${index}-${itemIndex}`}
                          style={styles.listItem}
                        >
                          <Paragraph
                            size="xs"
                            style={[
                              styles.listBullet,
                              {
                                color: theme.colors.text,
                              },
                            ]}
                          >
                            {section.ordered
                              ? `${itemIndex + 1}.`
                              : '•'}
                          </Paragraph>

                          <Paragraph
                            size="xs"
                            style={[
                              styles.listText,
                              {
                                color: theme.colors.subText,
                              },
                            ]}
                          >
                            {item}
                          </Paragraph>
                        </View>
                      ),
                    )}
                  </View>
                );
              }

              // ==========================================
              // TABLE
              // ==========================================

              if (section.type === 'table') {
                const totalColumns = Math.max(
                  ...section.rows.map(
                    (row: string[]) => row.length,
                  ),
                );

                return (
                  <View
                    key={`description-table-wrapper-${index}`}
                    style={styles.tableWrapper}
                  >
                    <ScrollView
                      ref={(ref) => {
                        tableScrollRefs.current[index] = ref;
                      }}
                      horizontal
                      nestedScrollEnabled
                      showsHorizontalScrollIndicator={true}
                      persistentScrollbar={true}
                      scrollEventThrottle={16}
                      onScroll={(event) => {
                        tableScrollOffsets.current[index] =
                          event.nativeEvent.contentOffset.x;
                      }}
                      style={styles.tableScroll}
                      contentContainerStyle={
                        styles.tableScrollContent
                      }
                    >
                      <View style={styles.tableContainer}>
                        {section.rows.map(
                          (row: string[], rowIndex: number) => {
                            const isHeader =
                              section.hasHeader &&
                              rowIndex === 0;

                            return (
                              <View
                                key={`table-row-${rowIndex}`}
                                style={styles.tableRow}
                              >
                                {Array.from({
                                  length: totalColumns,
                                }).map(
                                  (
                                    _,
                                    columnIndex: number,
                                  ) => {
                                    const cellText =
                                      row[columnIndex] ?? '';

                                    return (
                                      <View
                                        key={`table-cell-${rowIndex}-${columnIndex}`}
                                        style={[
                                          styles.tableCell,
                                          {
                                            width:
                                              getTableColumnWidth(
                                                columnIndex,
                                                totalColumns,
                                              ),
                                            backgroundColor:
                                              isHeader
                                                ? theme.colors
                                                    .background
                                                : theme.colors
                                                    .surface,
                                          },
                                        ]}
                                      >
                                        <Paragraph
                                          size="xs"
                                          style={{
                                            color:
                                              theme.colors.text,
                                            fontWeight: isHeader
                                              ? '700'
                                              : '400',
                                            lineHeight: 18,
                                            textAlign: 'left',
                                          }}
                                        >
                                          {cellText}
                                        </Paragraph>
                                      </View>
                                    );
                                  },
                                )}
                              </View>
                            );
                          },
                        )}
                      </View>
                    </ScrollView>

                    {/* ======================================
                        HORIZONTAL SCROLL CONTROLS
                        The explanatory text is intentionally removed.
                    ====================================== */}

                    <View style={styles.tableScrollControls}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel="Scroll table left"
                        onPress={() => {
                          const currentOffset =
                            tableScrollOffsets.current[index] ?? 0;

                          tableScrollRefs.current[index]?.scrollTo({
                            x: Math.max(0, currentOffset - 220),
                            animated: true,
                          });
                        }}
                        style={styles.tableScrollButton}
                      >
                        <AppIcon
                          type="MaterialCommunityIcons"
                          name="chevron-left"
                          size={24}
                          color={theme.colors.subText}
                        />
                      </TouchableOpacity>


                      <TouchableOpacity
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel="Scroll table right"
                        onPress={() => {
                          const currentOffset =
                            tableScrollOffsets.current[index] ?? 0;

                          tableScrollRefs.current[index]?.scrollTo({
                            x: currentOffset + 220,
                            animated: true,
                          });
                        }}
                        style={styles.tableScrollButton}
                      >
                        <AppIcon
                          type="MaterialCommunityIcons"
                          name="chevron-right"
                          size={24}
                          color={theme.colors.subText}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }

              // ==========================================
              // PARAGRAPH
              // ==========================================

              return (
                <Paragraph
                  key={`description-paragraph-${index}`}
                  style={{
                    color: theme.colors.subText,
                    lineHeight: 25,
                    textAlign: 'left',
                    marginBottom: 10,
                  }}
                >
                  {section.text}
                </Paragraph>
              );
            })}
          </Card>
        ) : null}

        {/* ==========================================
            YOUTUBE VIDEO
        ========================================== */}

        {youtubeUrl && (
          <Card
            variant="contained"
            style={[
              styles.sectionCard,
              {
                backgroundColor: theme.colors.surface,
              },
            ]}
          >
            <Headline
              size="sm"
              style={{
                color: theme.colors.text,
                marginBottom: 14,
                textAlign: 'left',
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
              {/* YOUTUBE ICON */}

              <View style={styles.fileIcon}>
                <AppIcon
                  type="MaterialCommunityIcons"
                  name="youtube"
                  size={30}
                  color={theme.colors.primary}
                />
              </View>

              {/* FILE INFO */}

              <View style={styles.fileInfo}>
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
                    marginTop: 3,
                    textAlign: 'left',
                  }}
                >
                  {t('tap_to_watch_video')}
                </Paragraph>
              </View>

              {/* ARROW */}

              <AppIcon
                type="MaterialCommunityIcons"
                name="chevron-right"
                size={22}
                color={theme.colors.subText}
              />
            </TouchableOpacity>
          </Card>
        )}

        {/* ==========================================
            ATTACHMENTS
        ========================================== */}

        {attachments.length > 0 && (
          <Card
            variant="contained"
            style={[
              styles.sectionCard,
              {
                backgroundColor: theme.colors.surface,
              },
            ]}
          >
            <Headline
              size="sm"
              style={{
                color: theme.colors.text,
                marginBottom: 14,
                textAlign: 'left',
              }}
            >
              {t('attached_files')}
            </Headline>

            {attachments.map((file: any, index: number) => {
              const type = getFileType(file);

              return (
                <TouchableOpacity
                  key={
                    file?.id ??
                    file?.file_id ??
                    `${type}-${index}`
                  }
                  activeOpacity={0.85}
                  onPress={() => openAttachment(file)}
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
                      name={getFileIcon(type)}
                      size={28}
                      color={theme.colors.primary}
                    />
                  </View>

                  {/* FILE INFO */}

                  <View style={styles.fileInfo}>
                    <Headline
                      size="xs"
                      numberOfLines={1}
                      style={{
                        color: theme.colors.text,
                        textAlign: 'left',
                      }}
                    >
                      {getFileTitle(file, type)}
                    </Headline>

                    <Paragraph
                      size="xs"
                      numberOfLines={2}
                      style={{
                        color: theme.colors.subText,
                        marginTop: 3,
                        textAlign: 'left',
                      }}
                    >
                      {getFileSubtitle(type)}
                    </Paragraph>
                  </View>

                  {/* ARROW */}

                  <AppIcon
                    type="MaterialCommunityIcons"
                    name="chevron-right"
                    size={22}
                    color={theme.colors.subText}
                  />
                </TouchableOpacity>
              );
            })}
          </Card>
        )}

        {/* ==========================================
            NO ATTACHMENT
        ========================================== */}

        {attachments.length === 0 && (
          <Card
            variant="contained"
            style={[
              styles.sectionCard,
              {
                backgroundColor: theme.colors.surface,
              },
            ]}
          >
            <View style={styles.noFileContainer}>
              <AppIcon
                type="MaterialCommunityIcons"
                name="file-document-outline"
                size={35}
                color={theme.colors.subText}
              />

              <Paragraph
                size="xs"
                style={{
                  marginTop: 8,
                  color: theme.colors.subText,
                }}
              >
                কোনো সংযুক্ত ফাইল নেই
              </Paragraph>
            </View>
          </Card>
        )}
      </ScrollView>
    </Container>
  );
};

export default POPDetailScreen;

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  content: {
    padding: 18,
    paddingBottom: 20,
  },

  heroCard: {
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },

  imageCircle: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 4,
    borderColor: '#D6B56A',
    backgroundColor: '#F4F8EF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#B89445',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5,
  },

  heroImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },

  // ==========================================
  // SECTION
  // ==========================================

  sectionCard: {
    marginTop: 16,
    marginBottom: 0,
    padding: 18,
    borderRadius: 18,
  },

  // ==========================================
  // LIST
  // ==========================================

  listContainer: {
    marginTop: 4,
    marginBottom: 10,
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 7,
  },

  listBullet: {
    width: 24,
    lineHeight: 22,
    textAlign: 'left',
    fontWeight: '700',
  },

  listText: {
    flex: 1,
    lineHeight: 22,
    textAlign: 'left',
  },

  // ==========================================
  // TABLE
  // ==========================================

  tableWrapper: {
    marginTop: 6,
    // marginBottom: 14,
  },

  tableScroll: {
    marginTop: 2,
  },

  tableScrollContent: {
    paddingRight: 4,
  },

  tableContainer: {
    alignSelf: 'flex-start',
  },

  tableRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  tableCell: {
    minHeight: 42,
    paddingHorizontal: 8,
    paddingVertical: 7,
    justifyContent: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#B8B8B8',
  },

  tableScrollControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    // paddingBottom: 2,
   
  },

  tableScrollButton: {
    width: 36,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },


  // ==========================================
  // FILE
  // ==========================================

  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EDF8ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  fileInfo: {
    flex: 1,
  },

  // ==========================================
  // NO FILE
  // ==========================================

  noFileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },

  detailLogo: {
    width: 100,
    height: 100,
  },
});