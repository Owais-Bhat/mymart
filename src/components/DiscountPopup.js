import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import {FadeIn, FadeOut, ZoomIn, ZoomOut} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

const {width} = Dimensions.get('window');

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const DiscountPopup = ({visible, onClose, discountCode = 'SAVE20', discountPercent = 20}) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!visible && !show) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <AnimatedView
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={styles.backdrop}
        />
        <AnimatedView
          entering={ZoomIn.springify().damping(15)}
          exiting={ZoomOut.duration(200)}
          style={styles.popupContainer}>
          <View style={styles.popup}>
            <View style={styles.header}>
              <Text style={styles.emoji}>🎉</Text>
              <Text style={styles.title}>Special Offer!</Text>
            </View>

            <View style={styles.content}>
              <Text style={styles.discountText}>
                Get {discountPercent}% OFF
              </Text>
              <Text style={styles.description}>
                Use code <Text style={styles.code}>{discountCode}</Text> on your next purchase
              </Text>
              <View style={styles.codeContainer}>
                <Text style={styles.codeText}>{discountCode}</Text>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => {
                    // In a real app, you'd copy to clipboard
                    alert(`Code ${discountCode} copied!`);
                  }}>
                  <Text style={styles.copyText}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttons}>
              <AnimatedTouchableOpacity
                entering={FadeIn.delay(200).duration(400)}
                style={styles.primaryButton}
                onPress={handleClose}
                activeOpacity={0.8}>
                <Text style={styles.primaryButtonText}>Shop Now</Text>
              </AnimatedTouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                activeOpacity={0.7}>
                <Text style={styles.closeButtonText}>Maybe Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </AnimatedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  popupContainer: {
    width: width - 40,
    maxWidth: 400,
  },
  popup: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  discountText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    justifyContent: 'space-between',
  },
  code: {
    fontWeight: 'bold',
    color: '#6366f1',
  },
  codeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    letterSpacing: 2,
  },
  copyButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  copyText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#6b7280',
    fontSize: 16,
  },
});

export default DiscountPopup;

