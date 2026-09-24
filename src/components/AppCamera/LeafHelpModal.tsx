import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Card, Paragraph } from '@components/ui';
import { useTranslation } from 'react-i18next';
import { Rbutton } from '@components/common/Rbutton';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const LeafHelpModal = ({ visible, onClose }: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Card style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerAccent} />

            <Paragraph size="lg" style={styles.title}>
              {t('disease_detection_tips')}
            </Paragraph>
          </View>

          {/* Tip 1 */}
          <View style={styles.tipRow}>
            <View style={styles.numberCircle}>
              <Paragraph size="sm" style={styles.numberText}>
                1
              </Paragraph>
            </View>

            <Paragraph size="base" style={styles.tipText}>
              {t('tip_1')}
            </Paragraph>
          </View>

          {/* Tip 2 */}
          <View style={styles.tipRow}>
            <View style={styles.numberCircle}>
              <Paragraph size="sm" style={styles.numberText}>
                2
              </Paragraph>
            </View>

            <Paragraph size="base" style={styles.tipText}>
              {t('tip_2')}
            </Paragraph>
          </View>

          {/* Tip 3 */}
          <View style={styles.tipRow}>
            <View style={styles.numberCircle}>
              <Paragraph size="sm" style={styles.numberText}>
                3
              </Paragraph>
            </View>

            <Paragraph size="base" style={styles.tipText}>
              {t('tip_3')}
            </Paragraph>
          </View>

          {/* AI Disclaimer */}
          <View style={styles.aiDisclaimer}>
            <View style={styles.aiIndicator} />

            <Paragraph size="sm" style={styles.aiText}>
              {t('ai_detection_disclaimer')}
            </Paragraph>
          </View>

          {/* Action */}
          <Rbutton
            title={t('got_it')}
            buttonColor="#1565C0"
            onPress={onClose}
            style={styles.button}
          />
        </Card>
      </View>
    </Modal>
  );
};

export default LeafHelpModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,

    // Premium elevation
    elevation: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },

  header: {
    alignItems: 'center',
    marginBottom: 22,
  },

  headerAccent: {
    width: 42,
    height: 4,
    borderRadius: 10,
    backgroundColor: '#1565C0',
    marginBottom: 12,
  },

  title: {
    fontWeight: '700',
    textAlign: 'center',
  },

  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },

  numberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8F1FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 1,
  },

  numberText: {
    color: '#1565C0',
    fontWeight: '700',
  },

  tipText: {
    flex: 1,
    lineHeight: 21,
    marginBottom: 0,
  },

  aiDisclaimer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#FFF3F3',
    borderRadius: 14,
    marginTop: 4,
    marginBottom: 6,
    overflow: 'hidden',
  },

  aiIndicator: {
    width: 4,
    backgroundColor: '#D32F2F',
  },

  aiText: {
    flex: 1,
    color: '#B71C1C',
    lineHeight: 21,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontWeight: '500',
  },

  button: {
    marginTop: 14,
    borderRadius: 18,
  },
});
