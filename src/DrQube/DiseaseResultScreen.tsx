import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import AppIcon from '@components/AppIcon/AppIcon';
import { Card, Container, Headline, Paragraph } from '@components/ui';
import { CustomStatusBar } from '@components/common/CustomStatusBar';
import { generateDiseaseAnalysis } from '@services/geminiService';
import { TextToSpeech } from '@utils/TextToSpeech';

const DiseaseResultScreen = ({ route }: any) => {
  const { image, disease } = route.params;

  const [prompt, setPrompt] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [severity, setSeverity] = useState('');
  const [aiDiseaseName, setAiDiseaseName] = useState('');

  const getBase64Image = async uri => {
    const response = await fetch(uri);

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        } else {
          reject('Failed');
        }
      };

      reader.readAsDataURL(blob);
    });
  };

  const handleGenerateAnalysis = async () => {
    try {
      setLoading(true);

      const base64Image = await getBase64Image(image.uri);

      const finalPrompt =
        prompt.trim() ||
        `
ছবিটি বিশ্লেষণ করে বাংলায় উত্তর দাও।

নিচের ৬টি শিরোনাম ব্যবহার করো:

রোগের নাম:
রোগের মাত্রা: (Low / Medium / High)
রোগের বিবরণ:
প্রধান লক্ষণ:
রোগের কারণ:
প্রতিকার:
প্রতিরোধ ব্যবস্থা:

নিয়ম:
- রোগের মাত্রা অবশ্যই Low, Medium অথবা High হবে
- প্রতিটি অংশ ১-২ লাইনের মধ্যে হবে
- সর্বোচ্চ 120 শব্দ
- Markdown ব্যবহার করবে না
- Bullet ব্যবহার করবে না
- সহজ কৃষকবান্ধব বাংলা ব্যবহার করবে
`;

      const result = await generateDiseaseAnalysis(base64Image, finalPrompt);
      const severityMatch = result.match(
        /রোগের মাত্রা\s*[:\-]\s*(Low|Medium|High)/i,
      );

      if (severityMatch?.[1]) {
        setSeverity(severityMatch[1].trim());
      }
      const diseaseMatch = result.match(/রোগের নাম\s*:\s*(.*)/i);
      if (diseaseMatch?.[1]) {
        setAiDiseaseName(diseaseMatch[1].trim());
      }
      setAiAnalysis(result);

      const cleanText = getCleanTextForSpeech(result);

      TextToSpeech.stop();

      setTimeout(() => {
        TextToSpeech.speak(cleanText);
      }, 300);
    } catch (error) {
      setSeverity('');
      setAiDiseaseName('');
      setAiAnalysis('বিশ্লেষণ করতে সমস্যা হয়েছে।');
      console.log(error);

      setAiAnalysis('বিশ্লেষণ করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };
  const getSeverityColor = () => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return '#E53935';

      case 'medium':
        return '#FB8C00';

      default:
        return '#43A047';
    }
  };
  const getCleanTextForSpeech = (text = '') => {
    return text
      .replace(/#/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/---/g, '')
      .replace(/:/g, '। ')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };
  useEffect(() => {
    return () => {
      TextToSpeech.stop();
    };
  }, []);

  const playAudio = () => {
    TextToSpeech.stop();

    if (!aiAnalysis) {
      TextToSpeech.speak('এখনও কোনো এআই বিশ্লেষণ তৈরি করা হয়নি।');

      return;
    }

    const cleanText = getCleanTextForSpeech(aiAnalysis);

    TextToSpeech.speak(cleanText);
  };

  const stopAudio = () => {
    TextToSpeech.stop();
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
        {/* IMAGE */}
        <Card style={styles.imageCard}>
          <Image
            source={{ uri: image.uri }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.diseaseBadge}>
            <Paragraph style={styles.badgeText}>
              {aiDiseaseName || 'রোগ শনাক্ত হয়নি'}
            </Paragraph>
          </View>
        </Card>

        {/* SEVERITY */}

        <Card
          style={{
            marginHorizontal: 12,
            marginBottom: 16,
            padding: 14,
            borderRadius: 20,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            {/* Disease Name */}
            <View style={{ flex: 1 }}>
              <Paragraph
                style={{
                  color: '#64748B',
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                রোগ
              </Paragraph>

              <Paragraph
                style={{
                  fontWeight: '700',
                  color: '#0F172A',
                }}
              >
                {aiDiseaseName || 'Unknown'}
              </Paragraph>
            </View>

            {/* Severity */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Paragraph
                style={{
                  color: '#64748B',
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                Severity
              </Paragraph>

              <Paragraph
                style={{
                  color: getSeverityColor(),
                  fontWeight: '700',
                }}
              >
                {severity || 'Unknown'}
              </Paragraph>
            </View>

            {/* AI Status */}
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Paragraph
                style={{
                  color: '#64748B',
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                AI Status
              </Paragraph>

              <Paragraph
                style={{
                  color: aiAnalysis ? '#16A34A' : '#DC2626',
                  fontWeight: '700',
                }}
              >
                {aiAnalysis ? 'Ready' : 'Pending'}
              </Paragraph>
            </View>
          </View>
        </Card>

        {/* PROMPT SECTION */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AppIcon
              type="MaterialCommunityIcons"
              name="form-textbox"
              size={24}
              color="#007AFF"
            />

            <Headline style={styles.sectionTitle}>আপনার প্রশ্ন লিখুন</Headline>
          </View>

          <TextInput
            style={styles.promptInput}
            multiline
            placeholder="যেমন: এই রোগের কারণ ও প্রতিকার বাংলায় বিস্তারিত বলুন"
            value={prompt}
            onChangeText={setPrompt}
          />

          <TouchableOpacity
            style={styles.submitButton}
            disabled={loading}
            onPress={handleGenerateAnalysis}
          >
            <Paragraph style={styles.submitButtonText}>
              {loading ? 'বিশ্লেষণ হচ্ছে...' : 'Submit'}
            </Paragraph>
          </TouchableOpacity>
        </Card>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 15,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: aiAnalysis ? '#2E7D32' : '#94A3B8',
              padding: 12,
              borderRadius: 12,
              marginRight: 10,
            }}
            onPress={playAudio}
            disabled={!aiAnalysis}
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
              backgroundColor: aiAnalysis ? '#E53935' : '#94A3B8',
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
        {/* RESULT */}
        {loading ? (
          <Card style={styles.sectionCard}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />

              <Paragraph style={styles.loadingText}>
                এআই বিশ্লেষণ করছে...
              </Paragraph>
            </View>
          </Card>
        ) : aiAnalysis ? (
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <AppIcon
                type="MaterialCommunityIcons"
                name="robot-outline"
                size={24}
                color="#007AFF"
              />

              <Headline style={styles.sectionTitle}>
                বিস্তারিত এআই বিশ্লেষণ
              </Headline>
            </View>

            {aiAnalysis.split('\n').map((item, index) => {
              const isHeading =
                item.includes('রোগের নাম') ||
                item.includes('রোগের মাত্রা') ||
                item.includes('রোগের বিবরণ') ||
                item.includes('প্রধান লক্ষণ') ||
                item.includes('রোগের কারণ') ||
                item.includes('প্রতিকার') ||
                item.includes('প্রতিরোধ ব্যবস্থা');

              if (isHeading && item.includes(':')) {
                const [title, ...rest] = item.split(':');

                return (
                  <Paragraph
                    key={index}
                    style={{
                      color: '#334155',
                      marginBottom: 8,
                      lineHeight: 24,

                      // justifyContent: 'flex-start',
                      // alignItems: 'flex-start',
                      // alignSelf: 'flex-start',
                    }}
                  >
                    <Paragraph
                      style={{
                        textAlign: 'auto',
                        fontWeight: '700',
                        color: '#0F172A',
                      }}
                    >
                      {title}:
                    </Paragraph>
                    <Paragraph
                      style={{
                        fontWeight: '400',
                        color: '#475569',
                      }}
                    >
                      {rest.join(':').trim()}
                    </Paragraph>
                  </Paragraph>
                );
              }

              return (
                <Paragraph
                  key={index}
                  style={{
                    color: '#475569',
                    marginBottom: 8,
                    lineHeight: 24,
                    // justifyContent: 'flex-start',
                    // alignItems: 'flex-start',
                    // alignSelf: 'flex-start',
                  }}
                >
                  {item}
                </Paragraph>
              );
            })}
          </Card>
        ) : null}
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

  badgeText: {
    color: '#fff',
    fontWeight: '700',
  },

  severityBadge: {
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 18,
  },

  sectionCard: {
    marginHorizontal: 12,
    marginBottom: 16,
    padding: 18,
    borderRadius: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '700',
  },

  promptInput: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    textAlignVertical: 'top',
  },

  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  bodyText: {
    lineHeight: 24,
    color: '#475569',
    fontSize: 15,
  },

  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },

  loadingText: {
    marginTop: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});
