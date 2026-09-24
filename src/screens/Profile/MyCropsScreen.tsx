import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Container, Card, Headline, Paragraph } from '@components/ui';
import AppIcon from '@components/AppIcon/AppIcon';
import CustomHeader from '@components/Header/CustomHeader';
import useThemeMode from '@hook/useThemeMode';
import { useTranslation } from 'react-i18next';

interface Crop {
  id: string;
  crop_variety_id: string;
  crop_variety_name: string;
  crop_name_id: string;
  crop_name: string;
  crop_type_id: string;
  crop_type_name: string;
  area_hectares: number;
  status: string;
}

interface Land {
  id: string;
  name: string;
  area: number;
  crops: Crop[];
}

const MyCropsScreen = ({ route }: any) => {
  const { theme } = useThemeMode();
  const { t } = useTranslation();

  // console.log('MyCropsScreen route.params =', route?.params);

  /*
  =========================================================
  EXISTING BUSINESS LOGIC
  =========================================================
  */

  const lands: Land[] = route?.params?.locCropData?.lands || [];

  /*
  =========================================================
  CROP CARD
  =========================================================
  */

  const renderCrop = ({ item }: { item: Crop }) => {
    const isActive = item.status === 'ACTIVE';

    return (
      <View
        style={[
          styles.cropCard,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {/* =================================================
            CROP HEADER
        ================================================= */}

        <View style={styles.cropHeader}>
          {/* LEFT */}

          <View style={styles.cropTitleWrapper}>
            {/* CROP NAME + ICON */}

            <View style={styles.cropNameRow}>
              <View
                style={[
                  styles.cropIconWrapper,
                  {
                    backgroundColor: theme.colors.primary + '12',
                  },
                ]}
              >
                <AppIcon
                  type="MaterialCommunityIcons"
                  name="sprout"
                  size={17}
                  color={theme.colors.primary}
                />
              </View>

              <Headline
                size="sm"
                numberOfLines={1}
                style={[
                  styles.cropName,
                  {
                    color: theme.colors.text,
                  },
                ]}
              >
                {item.crop_name}
              </Headline>
            </View>

            {/* CROP TYPE - EXACTLY BELOW CROP NAME */}

            {/* <Paragraph
              size="xs"
              numberOfLines={1}
              style={[
                styles.cropTypeName,
                {
                  color: theme.colors.subText,
                },
              ]}
            >
              {item.crop_type_name}
            </Paragraph> */}
          </View>

          {/* STATUS */}

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isActive ? '#EAF7EE' : '#FFF4E5',
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isActive ? '#2E7D32' : '#F57C00',
                },
              ]}
            />

            <Paragraph
              size="xs"
              style={{
                color: isActive ? '#2E7D32' : '#F57C00',
                fontWeight: '700',
              }}
            >
              {item.status === 'ACTIVE' ? t('active') : t('inactive')}
            </Paragraph>
          </View>
        </View>

        {/* =================================================
            DIVIDER
        ================================================= */}

        <View
          style={[
            styles.divider,
            {
              backgroundColor: theme.colors.border,
            },
          ]}
        />

        {/* =================================================
            CROP DETAILS
        ================================================= */}

        <View style={styles.detailsContainer}>
          {/* Crop Type */}

          <View style={styles.infoRow}>
            <Paragraph
              size="xs"
              numberOfLines={1}
              style={[
                styles.infoLabel,
                {
                  color: theme.colors.subText,
                },
              ]}
            >
              {t('crop_type', {
                defaultValue: 'Crop Type',
              })}
            </Paragraph>

            <Paragraph
              size="xs"
              numberOfLines={1}
              style={[
                styles.infoValue,
                {
                  color: theme.colors.text,
                },
              ]}
            >
              {item.crop_type_name}
            </Paragraph>
          </View>

          {/* Crop Name */}

          <View style={styles.infoRow}>
            <Paragraph
              size="xs"
              numberOfLines={1}
              style={[
                styles.infoLabel,
                {
                  color: theme.colors.subText,
                },
              ]}
            >
              {t('crop_name', {
                defaultValue: 'Crop Name',
              })}
            </Paragraph>

            <Paragraph
              size="xs"
              numberOfLines={1}
              style={[
                styles.infoValue,
                {
                  color: theme.colors.text,
                },
              ]}
            >
              {item.crop_name}
            </Paragraph>
          </View>

          {/* Variety */}

          <View style={styles.infoRow}>
            <Paragraph
              size="xs"
              numberOfLines={1}
              style={[
                styles.infoLabel,
                {
                  color: theme.colors.subText,
                },
              ]}
            >
              {t('variety', {
                defaultValue: 'Variety',
              })}
            </Paragraph>

            <Paragraph
              size="xs"
              numberOfLines={1}
              style={[
                styles.infoValue,
                {
                  color: theme.colors.text,
                },
              ]}
            >
              {item.crop_variety_name}
            </Paragraph>
          </View>

          {/* Crop Area */}

          <View style={[styles.infoRow, styles.lastInfoRow]}>
            <Paragraph
              size="xs"
              numberOfLines={1}
              style={[
                styles.infoLabel,
                {
                  color: theme.colors.subText,
                },
              ]}
            >
              {t('crop_area', {
                defaultValue: 'Crop Area',
              })}
            </Paragraph>

            <Paragraph
              size="xs"
              numberOfLines={1}
              style={[
                styles.infoValue,
                {
                  color: theme.colors.text,
                },
              ]}
            >
              {item.area_hectares} {t('Bigha')}
            </Paragraph>
          </View>
        </View>
      </View>
    );
  };

  /*
  =========================================================
  LAND / PLOT CARD
  =========================================================
  */

  const renderLand = ({ item }: { item: Land }) => {
    return (
      <Card
        variant="contained"
        style={[
          styles.landCard,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {/* =================================================
            PLOT HEADER
        ================================================= */}

        <View
          style={[
            styles.landHeader,
            {
              backgroundColor: theme.colors.primary + '0D',
            },
          ]}
        >
          {/* LEFT ACCENT */}

          <View
            style={[
              styles.headerAccent,
              {
                backgroundColor: theme.colors.primary,
              },
            ]}
          />

          <Headline
            size="sm"
            numberOfLines={1}
            style={[
              styles.landName,
              {
                color: theme.colors.text,
              },
            ]}
          >
            {item.name}
          </Headline>

          <View
            style={[
              styles.areaBadge,
              {
                backgroundColor: theme.colors.primary + '12',
              },
            ]}
          >
            <Headline
              size="xs"
              style={[
                styles.landArea,
                {
                  color: theme.colors.primary,
                },
              ]}
            >
              {item.area} {t('Bigha')}
            </Headline>
          </View>
        </View>

        {/* =================================================
            CROPS
        ================================================= */}

        <View style={styles.cropsContainer}>
          {item.crops?.map(crop => (
            <View key={crop.id}>{renderCrop({ item: crop })}</View>
          ))}
        </View>
      </Card>
    );
  };

  /*
  =========================================================
  EMPTY STATE
  =========================================================
  */

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Headline
          size="sm"
          style={{
            color: theme.colors.text,
            textAlign: 'center',
          }}
        >
          {t('no_land_crop_information', {
            defaultValue: 'No Land/Crop Information Found',
          })}
        </Headline>

        <Paragraph
          size="xs"
          style={{
            color: theme.colors.subText,
            textAlign: 'center',
            marginTop: 5,
            lineHeight: 18,
          }}
        >
          {t('no_land_crop_information_desc', {
            defaultValue: 'No land or crop information is available.',
          })}
        </Paragraph>
      </View>
    );
  };

  /*
  =========================================================
  SCREEN
  =========================================================
  */

  return (
    <Container>
      <CustomHeader />

      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <FlatList
          data={lands}
          renderItem={renderLand}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.contentContainer,
            lands.length === 0 && styles.emptyListContainer,
          ]}
          ListEmptyComponent={renderEmpty}
        />
      </View>
    </Container>
  );
};

export default MyCropsScreen;

/*
=========================================================
STYLES
=========================================================
*/

const styles = StyleSheet.create({
  /*
  =========================================================
  SCREEN
  =========================================================
  */

  container: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 18,
  },

  emptyListContainer: {
    flexGrow: 1,
  },

  /*
  =========================================================
  LAND / PLOT CARD
  =========================================================
  */

  landCard: {
    borderRadius: 17,
    marginHorizontal: 8,
    marginVertical: 6,

    borderWidth: 1,

    overflow: 'hidden',

    // Android
    elevation: 2,

    // iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.06,
    shadowRadius: 5,
  },

  /*
  =========================================================
  PLOT HEADER
  =========================================================
  */

  landHeader: {
    minHeight: 50,

    flexDirection: 'row',
    alignItems: 'center',

    paddingLeft: 13,
    paddingRight: 10,

    position: 'relative',
  },

  headerAccent: {
    width: 3,
    height: 25,

    borderRadius: 4,

    marginRight: 9,
  },

  landName: {
    flex: 1,

    fontWeight: '700',

    minWidth: 0,
  },

  /*
  =========================================================
  AREA BADGE
  =========================================================
  */

  areaBadge: {
    minWidth: 48,

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 8,

    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: 8,

    flexShrink: 0,
  },

  landArea: {
    fontWeight: '700',
  },

  /*
  =========================================================
  CROP SECTION
  =========================================================
  */

  cropsContainer: {
    paddingHorizontal: 7,
    paddingTop: 7,
    paddingBottom: 4,
  },

  /*
  =========================================================
  CROP CARD
  =========================================================
  */

  cropCard: {
    borderRadius: 12,

    borderWidth: 1,

    paddingHorizontal: 11,
    paddingVertical: 8,

    marginBottom: 6,

    // Android
    elevation: 1,

    // iOS
    shadowOffset: {
      width: 0,
      height: 1,
    },

    shadowOpacity: 0.035,
    shadowRadius: 3,

    overflow: 'hidden',
  },

  /*
  =========================================================
  CROP HEADER
  =========================================================
  */

  cropHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    justifyContent: 'space-between',

    width: '100%',
  },

  cropTitleWrapper: {
    flex: 1,

    marginRight: 8,

    alignItems: 'flex-start',

    minWidth: 0,
  },

  /*
  =========================================================
  CROP NAME + ICON
  =========================================================
  */

  cropNameRow: {
    flexDirection: 'row',
    alignItems: 'center',

    alignSelf: 'flex-start',

    maxWidth: '100%',

    minWidth: 0,
  },

  cropIconWrapper: {
    width: 25,
    height: 25,

    borderRadius: 8,

    alignItems: 'center',
    justifyContent: 'center',

    flexShrink: 0,
  },

  cropName: {
    fontWeight: '700',

    marginLeft: 7,

    flexShrink: 1,

    minWidth: 0,
  },

  /*
  =========================================================
  CROP TYPE
  =========================================================
  */

  cropTypeName: {
    marginTop: 2,

    marginLeft: 32,

    alignSelf: 'flex-start',

    maxWidth: '100%',

    flexShrink: 1,
  },

  /*
  =========================================================
  STATUS
  =========================================================
  */

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 8,
    paddingVertical: 4,

    borderRadius: 20,

    marginTop: 1,

    flexShrink: 0,
  },

  statusDot: {
    width: 5,
    height: 5,

    borderRadius: 3,

    marginRight: 5,
  },

  /*
  =========================================================
  DIVIDER
  =========================================================
  */

  divider: {
    height: StyleSheet.hairlineWidth,

    marginVertical: 5,
  },

  /*
  =========================================================
  DETAILS
  =========================================================
  */

  detailsContainer: {
    gap: 1,

    width: '100%',
  },

  infoRow: {
    minHeight: 21,

    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',

    width: '100%',
  },

  infoLabel: {
    flex: 1,

    minWidth: 0,

    textAlign: 'left',

    flexShrink: 1,
  },

  lastInfoRow: {
    marginBottom: 0,
  },

  infoValue: {
    flex: 1,

    minWidth: 0,

    textAlign: 'right',

    fontWeight: '600',

    marginLeft: 12,

    flexShrink: 1,
  },

  /*
  =========================================================
  EMPTY STATE
  =========================================================
  */

  emptyContainer: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 30,
    paddingBottom: 50,
  },
});
