import React, { useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AppIcon from '@components/AppIcon/AppIcon';
import { Card, Container, Headline, Paragraph } from '@components/ui';
import { CustomStatusBar } from '@components/common/CustomStatusBar';
import { TextToSpeech } from '@utils/TextToSpeech';

const DiseaseResultScreen = ({ route }: any) => {
  const { t } = useTranslation();
  const { image, disease } = route.params;

  useEffect(() => {
    return () => {
      TextToSpeech.stop();
    };
  }, []);

  const playAudio = () => {
    TextToSpeech.stop();

    const text = `
রোগের নাম ${t('leaf_blight')}

${t('leaf_blight_description')}

চিকিৎসা

${t('leaf_blight_treatment')}

${t('remove_infected_leaves')}

${t('keep_field_clean')}

${t('use_fungicide')}

${t('monitor_plants')}
`;

    TextToSpeech.speak(text);
  };
  const stopAudio = () => {
    TextToSpeech.stop();
  };
  const getSeverityColor = () => {
    switch (disease.severity?.toLowerCase()) {
      case 'high':
        return '#E53935';

      case 'medium':
        return '#FB8C00';

      default:
        return '#43A047';
    }
  };

  return (
    <Container>
      <CustomStatusBar />
      <Headline size="xl" style={styles.title}>
        {t('disease_detection_result')}
      </Headline>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 15,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: '#2E7D32',
            padding: 12,
            borderRadius: 12,
            marginRight: 10,
          }}
          onPress={playAudio}
        >
          <AppIcon
            type="MaterialCommunityIcons"
            name="volume-high"
            size={26}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#E53935',
            padding: 12,
            borderRadius: 12,
          }}
          onPress={stopAudio}
        >
          <AppIcon
            type="MaterialCommunityIcons"
            name="stop-circle"
            size={26}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Image Section */}
        <Card style={styles.imageCard}>
          <Image
            source={{ uri: image.uri }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.diseaseBadge}>
            <Paragraph
              style={{
                color: '#fff',
                fontWeight: '700',
              }}
            >
              {t('leaf_blight')}
            </Paragraph>
          </View>
        </Card>

        {/* Severity */}
        <View
          style={[
            styles.severityBadge,
            {
              backgroundColor: getSeverityColor(),
            },
          ]}
        >
          <Paragraph
            style={{
              color: '#fff',
              fontWeight: '700',
            }}
          >
            {t('severity')}: {t(disease.severity.toLowerCase())}
          </Paragraph>
        </View>

        {/* Disease Info */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AppIcon
              type="MaterialCommunityIcons"
              name="leaf"
              size={22}
              color="#2E7D32"
            />

            <Paragraph style={styles.sectionTitle}>
              {t('description')}
            </Paragraph>
          </View>

          <Paragraph style={styles.bodyText}>
            {t('leaf_blight_description')}
          </Paragraph>
        </Card>

        {/* Treatment */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AppIcon
              type="MaterialCommunityIcons"
              name="medical-bag"
              size={22}
              color="#1565C0"
            />

            <Paragraph style={styles.sectionTitle}>{t('treatment')}</Paragraph>
          </View>

          <Paragraph style={styles.bodyText}>
            {t('leaf_blight_treatment')}
          </Paragraph>
        </Card>

        {/* Recommendations */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AppIcon
              type="MaterialCommunityIcons"
              name="lightbulb-on"
              size={22}
              color="#F9A825"
            />

            <Paragraph style={styles.sectionTitle}>
              {t('farmer_advice')}
            </Paragraph>
          </View>

          <Paragraph style={styles.tipText}>
            {t('remove_infected_leaves')}
          </Paragraph>

          <Paragraph style={styles.tipText}>{t('keep_field_clean')}</Paragraph>

          <Paragraph style={styles.tipText}>{t('use_fungicide')}</Paragraph>

          <Paragraph style={styles.tipText}>{t('monitor_plants')}</Paragraph>
        </Card>
      </ScrollView>
    </Container>
  );
};

export default DiseaseResultScreen;

const styles = StyleSheet.create({
  title: {
    textAlign: 'left',
    marginTop: 40,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  content: {
    paddingBottom: 40,
  },

  imageCard: {
    overflow: 'hidden',
    borderRadius: 24,
    marginBottom: 16,
    marginHorizontal: 12,
  },

  image: {
    width: '100%',
    height: 280,
  },

  diseaseBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  severityBadge: {
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 18,
  },

  sectionCard: {
    marginBottom: 16,
    padding: 18,
    marginHorizontal: 12,
    borderRadius: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  sectionTitle: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '700',
  },

  bodyText: {
    lineHeight: 24,
    color: '#475569',
  },

  tipText: {
    marginBottom: 8,
    lineHeight: 22,
    color: '#334155',
  },
});
