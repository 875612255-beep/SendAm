import { useEffect, useRef from 'react';
import { useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import MessageList from './MessageList';
import usePolling from './usePolling';
import { API_BASE_URL } from './config.js';

function TypingIndicator() {
  const dots = [useRef(new Animated.Value(0)), useRef(new Animated.Value(0)), useRef(new Animated.Value(0))];

  useEffect(() => {
    const animations = dots.map((dot, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 150),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(300),
        ]),
      ),
    );
    animations.forEach((animation) => animation.start());
    return () => animations.forEach((animation) => animation.stop());
  }, []);

  return (
    <View className="flex-row items-center gap-1 px-3 py-2">
      <Text className="text-sm text-gray-500">SendAm is typing</Text>
      {dots.map((dot, index) => (
        <Animated.Text
          key={index}
          className="text-sm text-gray-500"
          style={{ opacity: dot }}
        >
          .
        </Animated.Text>
      ))
    </View>
  );
}

export default function ChatScreen() {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  usePolling(phoneNumber, setMessages);

  function handleStart() {
    const trimmed = phoneInput.trim();
    if (!trimmed) return;
    setPhoneNumber(trimmed);
  }

  function handleReset() {
    setPhoneNumber(null);
    setPhoneInput('');
    setMessages([]);
    setInputText('');
    setSending(false);
  }

  async function handleSend() {
    const text = inputText.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, text, sender: 'user' }]);
    setInputText('');
    setSending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/sim/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, text }),
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      const replies = data.replies ?? [];
      setMessages((prev) => [
        ...prev,
        ...replies.map((reply, index) => ({ id: `b-${Date.now()}-${index}`, text: reply, sender: 'bot' })),
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, text: `Couldn't reach SendAm: ${error.message}`, sender: 'bot' },
      ]);
    } finally {
      setSending(false);
    }
  }

  if (!phoneNumber) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6 gap-3">
        <Text className="text-lg font-semibold text-gray-900">Enter your phone number</Text>
        <TextInput
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base"
          placeholder="+2348000000001"
          keyboardType="phone-pad"
          value={phoneInput}
          onChangeText={setPhoneInput}
          onSubmitEditing={handleStart}
        />
        <Pressable
          className="w-full bg-green-500 rounded-lg py-2 items-center"
          onPress={handleStart}
          disabled={!phoneInput.trim()}
        >
          <Text className="text-white font-semibold">Start chatting</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-row items-center justify-between px-3 py-2 border-b border-gray-200">
        <Text className="text-base font-semibold text-gray-900">{phoneNumber}</Text>
        <Pressable
          testID="reset-session-button"
          className="border border-gray-300 rounded-lg px-3 py-1"
          onPress={handleReset}
        >
          <Text className="text-sm font-semibold text-gray-700">Switch Account</Text>
        </Pressable>
      </View>
      <View className="flex-1">
        <MessageList messages={messages} />
        {sending ? <TypingIndicator /> : null}
      </View>
      <View className="flex-row items-center gap-2 px-3 py-2 border-t border-gray-200">
        <TextInput
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-base"
          placeholder="Type a message"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
          editable={!sending}
        />
        <Pressable
          testID="send-button"
          className="bg-green-500 rounded-full px-4 py-2 items-center justify-center"
          onPress={handleSend}
          disabled={sending || !inputText.trim()}
        >
          <Text className="text-white font-semibold">{sending ? '...' : 'Send'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
