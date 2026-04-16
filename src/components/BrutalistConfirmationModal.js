import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Animated 
} from 'react-native';
import { AlertTriangle, X } from 'lucide-react-native';
import { COLORS } from '../utils/constants';

const BrutalistConfirmationModal = ({ 
  visible, 
  onClose, 
  onConfirm, 
  title = "SIGURADO KA BA?", 
  message = "Mabubura lahat ng iyong gastos at data. Hindi na ito maibabalik.",
  confirmText = "BURA LAHAT!",
  cancelText = "HUWAG MUNA"
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <AlertTriangle size={32} color={COLORS.black} strokeWidth={3} />
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color={COLORS.black} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.message}>{message}</Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.btn, styles.cancelBtn]} 
              onPress={onClose}
            >
              <Text style={styles.cancelBtnText}>{cancelText}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.btn, styles.confirmBtn]} 
              onPress={onConfirm}
            >
              <Text style={styles.confirmBtnText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderWidth: 4,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.black,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.black,
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    padding: 24,
    backgroundColor: COLORS.white,
  },
  message: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
    lineHeight: 24,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'column',
    padding: 20,
    gap: 12,
  },
  btn: {
    padding: 16,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  cancelBtn: {
    backgroundColor: '#EEE',
  },
  confirmBtn: {
    backgroundColor: COLORS.danger,
    shadowOffset: { width: 6, height: 6 },
  },
  cancelBtnText: {
    fontWeight: '900',
    fontSize: 14,
    color: COLORS.black,
  },
  confirmBtnText: {
    fontWeight: '900',
    fontSize: 16,
    color: COLORS.white,
  },
});

export default BrutalistConfirmationModal;
