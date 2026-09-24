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
import { Rbutton } from '@components/common/Rbutton';
import CustomHeader from '@components/Header/CustomHeader';
import { generateDiseaseAnalysis } from '@services/geminiService';
import { TextToSpeech } from '@utils/TextToSpeech';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../src/context/AuthContext';

const DiseaseResultScreen = ({ route }: any) => {
  const { image, disease } = route.params;
  const [prompt, setPrompt] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [severity, setSeverity] = useState('');
  const [aiDiseaseName, setAiDiseaseName] = useState('');
  const [aiCropName, setAiCropName] = useState('');
  const [aiDiseaseCategory, setAiDiseaseCategory] = useState('');
  const { user } = useAuth();
  const { t } = useTranslation();

  const getBase64Image = async (uri: RequestInfo) => {
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

      // const base64Image = await getBase64Image(image.uri);

      //       const finalPrompt =
      //         prompt.trim() ||
      //         `
      // ছবিটি বিশ্লেষণ করে বাংলায় উত্তর দাও।

      // নিচের ৬টি শিরোনাম ব্যবহার করো:

      // রোগের নাম:
      // রোগের মাত্রা: (Low / Medium / High)
      // রোগের বিবরণ:
      // প্রধান লক্ষণ:
      // রোগের কারণ:
      // প্রতিকার:
      // প্রতিরোধ ব্যবস্থা:

      // নিয়ম:
      // - রোগের মাত্রা অবশ্যই Low, Medium অথবা High হবে
      // - প্রতিটি অংশ ১-২ লাইনের মধ্যে হবে
      // - সর্বোচ্চ 120 শব্দ
      // - Markdown ব্যবহার করবে না
      // - Bullet ব্যবহার করবে না
      // - সহজ কৃষকবান্ধব বাংলা ব্যবহার করবে
      // `;

      // const formData = new FormData();

      // formData.append('image', {
      //   uri: image.uri,
      //   name: 'image.jpg',
      //   type: 'image/jpeg',
      // } as any);

      // const response = await api.post('/diagnose', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      const formData = new FormData();
      formData.append('image', {
        uri: image.uri,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as any);
      formData.append('user_id', user.id);
      formData.append('user_ph', user.phone);
      formData.append('user_name', user.name);
      formData.append('district_name', user.state);
      formData.append('district_id', user.stateID);
      formData.append('block_id', user.districtID);
      formData.append('block_name', user.district);
      formData.append('panchayat_name', user.block);
      formData.append('panchayat_id', user.blockID);


//       const curlCommand = [
//   `curl --location "https://aireport.mygreenqube.com:9901/diagnose"`,
//   `--form "image=@${image.uri}"`,
//   `--form "user_id=${user.id}"`,
//   `--form "user_ph=${user.phone}"`,
//   `--form "user_name=${user.name}"`,
//   `--form "district_name=${user.state}"`,
//   `--form "district_id=${user.stateID}"`,
//   `--form "block_id=${user.districtID}"`,
//   `--form "block_name=${user.district}"`,
//   `--form "panchayat_name=${user.block}"`,
//   `--form "panchayat_id=${user.blockID}"`,
// ].join(' ');

      const response = await api.post('/diagnose', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


      
console.log("response",response)
      if (response?.status === 200) {
        const diagnosis = response?.data?.diagnosis;

        setAiAnalysis(
          response?.data?.recommendations?.[0]?.sms_bn +
            '\n' +
            '\n' +
            response?.data?.recommendations?.[0]?.sms_stage2_bn || '',
        );
        setAiDiseaseName(diagnosis?.problem?.bn || '');
        setAiCropName(diagnosis?.crop?.bn || '');
        setAiDiseaseCategory(diagnosis?.category?.bn || '');
      }
    } catch (error) {
      console.log('Error generating analysis:', error);
      setSeverity('');
      setAiDiseaseName('');
      setAiAnalysis(t('analysis_error'));
      console.log(error);

      setAiAnalysis(t('analysis_error'));
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
      TextToSpeech.speak(t('no_ai_analysis'));
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
      <CustomHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Card style={styles.imageCard}>
          <Image
            source={{ uri: image.uri }}
            style={styles.image}
            resizeMode="cover"
          />
        </Card>
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
            <View style={{ flex: 1 }}>
              <Paragraph
                style={{
                  color: '#64748B',
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                {t('disease')}
              </Paragraph>

              <Paragraph
                style={{
                  fontWeight: '700',
                  color: '#0F172A',
                }}
              >
                {aiDiseaseName}
              </Paragraph>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
              }}
            >
              <Paragraph
                style={{
                  color: '#64748B',
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                {t('crop')}
              </Paragraph>

              <Paragraph
                style={{
                  fontWeight: '700',
                  color: '#0F172A',
                }}
              >
                {aiCropName}
              </Paragraph>
            </View>

            {/* রোগের ধরন */}
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
              }}
            >
              <Paragraph
                style={{
                  color: '#64748B',
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                {t('disease_category')}
              </Paragraph>

              <Paragraph
                style={{
                  fontWeight: '700',
                  color: '#0F172A',
                  textAlign: 'right',
                }}
              >
                {aiDiseaseCategory}
              </Paragraph>
            </View>
          </View>
        </Card>

        {/* PROMPT SECTION */}
        <Card style={styles.sectionCard}>
          <Rbutton
            title={loading ? t('analyzing') : t('submit')}
            buttonColor="#007AFF"
            onPress={handleGenerateAnalysis}
            disabled={loading}
            style={{
              marginTop: 0,
              borderRadius: 12,
            }}
          />
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
                {t('ai_analyzing')}
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
                {t('detailed_ai_analysis')}
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
    marginTop: 20,
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
