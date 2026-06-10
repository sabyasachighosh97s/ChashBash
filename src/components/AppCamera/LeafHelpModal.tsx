import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
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
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Card style={styles.container}>
          <Paragraph size="lg" style={styles.title}>
            {t('disease_detection_tips')}
          </Paragraph>

          <Paragraph size="base" style={styles.text}>
            {t('tip_1')}
          </Paragraph>

          <Paragraph size="base" style={styles.text}>
            {t('tip_2')}
          </Paragraph>

          <Paragraph size="base" style={styles.text}>
            {t('tip_3')}
          </Paragraph>

          <Rbutton
            title={t('got_it')}
            buttonColor="#1565C0"
            onPress={onClose}
            style={{
              marginTop: 10,
              borderRadius: 18,
            }}
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },

  container: {
    backgroundColor: '#FFF',
    // borderRadius: 24,
    padding: 24,
  },

  title: {
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },

  text: {
    marginBottom: 12,
  },

  button: {
    backgroundColor: '#1565C0',
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
  },

  buttonText: {
    color: '#FFF',
    textAlign: 'center',
  },
});
