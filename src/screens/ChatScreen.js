import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform, Dimensions, Keyboard,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send, Bot } from 'lucide-react-native';
import useBudgetStore from '../store/useBudgetStore';
import useTheme from '../utils/useTheme';
import { processChatMessage } from '../ai/chatEngine';
import GridBackground from '../components/GridBackground';
import TypewriterText from '../components/TypewriterText';
import { askAI } from '../services/api';

const { width } = Dimensions.get('window');

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Uy lodi! Ako ang Spendly Coach mo. Kamusta ang budget natin ngayon?', sender: 'ai', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef();
  const { income, expenses, getPaydayInfo, getTotals } = useBudgetStore();
  const C = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const handleSend = () => {
    if (inputText.trim() === '') return;
    const userMessage = { id: Date.now().toString(), text: inputText, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    const userId = '661e5f5e5f5e5f5e5f5e5f5e';
    const storeData = { income, expenses: expenses.length, paydayInfo: getPaydayInfo(), totals: getTotals() };

    askAI({
      user: userId,
      text: inputText,
      context: {
        income, expenses: expenses.length,
        budgetRemaining: storeData.totals.remaining.Bills + storeData.totals.remaining.Wants + storeData.totals.remaining.Savings,
        paydayInfo: storeData.paydayInfo.date,
      },
    }).then(response => {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: response.text, sender: 'ai', timestamp: new Date() }]);
      setIsTyping(false);
    }).catch(() => {
      setIsTyping(false);
      const responseText = processChatMessage(inputText, storeData);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: responseText + ' (Local Mode)', sender: 'ai', timestamp: new Date() }]);
    });
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const S = useMemo(() => StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1 },
    header: {
      padding: 20, flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'center', borderBottomWidth: 4, borderBottomColor: C.border,
      backgroundColor: C.card,
    },
    headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    headerTitle: { fontSize: 20, fontWeight: '900', color: C.text, letterSpacing: -0.5 },
    onlineBadge: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      backgroundColor: C.accent, paddingHorizontal: 8, paddingVertical: 4,
      borderWidth: 2, borderColor: C.border,
    },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00FF00', borderWidth: 1, borderColor: C.border },
    onlineText: { fontSize: 8, fontWeight: '900', color: '#000' },
    listContent: { padding: 20, paddingBottom: 20 },
    messageWrapper: { marginBottom: 20, maxWidth: '85%' },
    aiWrapper: { alignSelf: 'flex-start' },
    userWrapper: { alignSelf: 'flex-end' },
    messageCard: {
      padding: 16, borderWidth: 3, borderColor: C.border,
      shadowColor: C.shadow, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0,
    },
    aiCard: { backgroundColor: C.card },
    userCard: { backgroundColor: C.primary },
    messageText: { fontSize: 15, fontWeight: '800', color: C.text, lineHeight: 20 },
    userMessageText: { fontSize: 15, fontWeight: '800', color: '#000', lineHeight: 20 },
    timestamp: { fontSize: 10, fontWeight: '700', color: C.textMuted, opacity: 0.7, marginTop: 6, marginHorizontal: 4 },
    typingContainer: { padding: 10, alignSelf: 'flex-start' },
    typingText: { fontSize: 12, fontWeight: '700', color: C.textMuted, fontStyle: 'italic' },
    inputContainer: { padding: 16, flexDirection: 'row', gap: 12, backgroundColor: 'transparent' },
    inputCard: {
      flex: 1, height: 56, backgroundColor: C.card,
      borderWidth: 3, borderColor: C.border,
      flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
      shadowColor: C.shadow, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0,
    },
    input: { flex: 1, fontSize: 16, fontWeight: '800', color: C.text },
    sendBtn: {
      width: 56, height: 56, backgroundColor: C.secondary,
      borderWidth: 3, borderColor: C.border, justifyContent: 'center', alignItems: 'center',
      shadowColor: C.shadow, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0,
    },
  }), [C]);

  const lastAiMessageId = useMemo(() => {
    const aiMsgs = messages.filter(m => m.sender === 'ai');
    return aiMsgs.length > 0 ? aiMsgs[aiMsgs.length - 1].id : null;
  }, [messages]);

  const renderMessage = ({ item }) => {
    const isAi = item.sender === 'ai';
    const isLatestAi = isAi && item.id === lastAiMessageId;

    return (
      <View style={[S.messageWrapper, isAi ? S.aiWrapper : S.userWrapper]}>
        <View style={[S.messageCard, isAi ? S.aiCard : S.userCard]}>
          {isLatestAi ? (
            <TypewriterText
              text={item.text}
              style={S.messageText}
              speed={20}
              onComplete={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
          ) : (
            <Text style={isAi ? S.messageText : S.userMessageText}>{item.text}</Text>
          )}
        </View>
        <Text style={S.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <GridBackground>
      <SafeAreaView style={S.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={S.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <View style={S.header}>
            <View style={S.headerTitleContainer}>
              <Bot size={24} color={C.text} strokeWidth={3} />
              <Text style={S.headerTitle}>KAUSAP-AI</Text>
            </View>
            <View style={S.onlineBadge}>
              <View style={S.dot} />
              <Text style={S.onlineText}>ONLINE COACH</Text>
            </View>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={S.listContent}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={isTyping && (
              <View style={S.typingContainer}>
                <Text style={S.typingText}>Ang AI Coach ay nag-iisip...</Text>
              </View>
            )}
          />

          <View style={[S.inputContainer, { marginBottom: isKeyboardVisible ? 0 : 55 }]}>
            <View style={S.inputCard}>
              <TextInput
                style={S.input}
                placeholder="Tanong ka lang, lodi..."
                value={inputText}
                onChangeText={setInputText}
                placeholderTextColor={C.textMuted}
                onSubmitEditing={handleSend}
              />
            </View>
            <TouchableOpacity style={S.sendBtn} onPress={handleSend} activeOpacity={0.7}>
              <Send size={20} color="#000" strokeWidth={3} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GridBackground>
  );
};

export default ChatScreen;
