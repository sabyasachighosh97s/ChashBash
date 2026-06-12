import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import AppIcon from '@components/AppIcon/AppIcon';
import { Card, Container, Headline, Paragraph } from '@components/ui';
import { CustomStatusBar } from '@components/common/CustomStatusBar';

const DiseaseResultScreen = ({ route }: any) => {
  const { image, disease } = route.params;

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
        রোগ শনাক্তকরণ ফলাফল
      </Headline>
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
              {disease.name}
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
            Severity: {disease.severity}
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

            <Paragraph style={styles.sectionTitle}>রোগের বিবরণ</Paragraph>
          </View>

          <Paragraph style={styles.bodyText}>{disease.description}</Paragraph>
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

            <Paragraph style={styles.sectionTitle}>
              চিকিৎসা ও প্রতিকার
            </Paragraph>
          </View>

          <Paragraph style={styles.bodyText}>{disease.treatment}</Paragraph>
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
              কৃষকের জন্য পরামর্শ
            </Paragraph>
          </View>

          <Paragraph style={styles.tipText}>
            • আক্রান্ত পাতা দ্রুত অপসারণ করুন
          </Paragraph>

          <Paragraph style={styles.tipText}>
            • ক্ষেত পরিষ্কার ও শুকনো রাখুন
          </Paragraph>

          <Paragraph style={styles.tipText}>
            • প্রয়োজন হলে অনুমোদিত ছত্রাকনাশক ব্যবহার করুন
          </Paragraph>

          <Paragraph style={styles.tipText}>
            • আক্রান্ত গাছ নিয়মিত পর্যবেক্ষণ করুন
          </Paragraph>
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
