import React from 'react';

import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Paragraph } from '@components/ui';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const LeafHelpModal = ({ visible, onClose }: Props) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Paragraph style={styles.title}>
            লক্ষণ দেখে রোগ নির্ণয় করার পরামর্শ
          </Paragraph>

          <Paragraph style={styles.text}>
            ১. ফসলের কাছাকাছি এগিয়ে আসুন এবং ক্ষতিগ্রস্ত অংশটি ফ্রেমের মধ্যে
            রাখুন।
          </Paragraph>

          <Paragraph style={styles.text}>
            ২. ক্যামেরা যেন সঠিকভাবে ফোকাস করে তা নিশ্চিত করুন।
          </Paragraph>

          <Paragraph style={styles.text}>
            ৩. পরিষ্কার আলোতে ছবি তুলুন।
          </Paragraph>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Paragraph style={styles.buttonText}>পেয়েছি</Paragraph>
          </TouchableOpacity>
        </View>
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
    borderRadius: 24,
    padding: 24,
  },

  title: {
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },

  text: {
    marginBottom: 12,
    lineHeight: 24,
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
